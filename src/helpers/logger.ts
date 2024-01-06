'use strict'
import winston from 'winston'
import { LoggerConfig, ConsoleTransportConfig } from '../config/loggerConfig'

const consoleConfig: ConsoleTransportConfig = {
  level: 'info',
}
const logConfig: LoggerConfig = new LoggerConfig('info', consoleConfig)

winston.level = logConfig.level || 'info'
const transports: winston.transport[] = []

for (const type of Object.getOwnPropertyNames(logConfig)) {
  if (typeof logConfig[type] === 'function' || type === 'level') {
    continue
  }

  switch (type.toLowerCase()) {
    case 'file':
      transports.push(new winston.transports.File(logConfig.file))
      break

    case 'console':
      transports.push(new winston.transports.Console(logConfig.console))
      break

    case 'http':
      transports.push(new winston.transports.Http(logConfig.http))
      break

    case 'custom':
      const CustomLogger = function (options: any) {
        const handler = require(`../../../${options.handler}`)
        this.name = 'custom'
        this.level = options.level || 'info'
        this.log = (
          level: string,
          message: string,
          meta: any,
          callback: any,
        ) => {
          let context: any = {}
          if (meta && meta.context) {
            context = meta.context
            meta.context = undefined
          }

          handler(level, message, meta, context).then(() => {
            callback(null, true)
          })
        }
      }
      transports.push(new CustomLogger(logConfig.custom))
      break

    default:
      const provider = require(type)
      const transport =
        typeof provider.transport === 'function'
          ? provider.transport(logConfig[type])
          : provider.transport
      transports.push(transport)
      break
  }
}

const defaultLogger = winston.createLogger({
  transports: transports,
  exitOnError: false,
})

defaultLogger.stream = {
  write: function (message, encoding) {
    defaultLogger.info(message)
  },
} as any

export default function (loggerName: string) {
  const winstonLogger = winston.createLogger({
    transports: transports,
    exitOnError: false,
  })

  const getMeta = (args: IArguments, context: any) => {
    const params: any[] = Array.from(args)

    let meta: any = {}
    if (params[1]) {
      if (typeof params[1] === 'string') {
        meta.message = params[1]
      } else if (typeof params[1] === 'object') {
        for (const field of Object.getOwnPropertyNames(params[1])) {
          let obj = params[1][field]
          if (typeof obj !== 'function' && field !== 'util') {
            meta[field] = obj
          }
        }
      }
    }

    meta.context = context
    return meta
  }

  const loggerFactory = function (newContext?: any, parentLogger?: any) {
    let context: any = {}

    if (parentLogger && parentLogger.context) {
      for (const key of Object.keys(parentLogger.context)) {
        context[key] = parentLogger.context[key]
      }
    }
    if (newContext) {
      if (typeof newContext === 'string') {
        context.location = context.location
          ? `${context.location}:${newContext}`
          : newContext
      } else {
        for (const key of Object.keys(newContext)) {
          if (key === 'location') {
            context.location = context.location
              ? `${context.location}:${newContext.location}`
              : newContext.location
          } else {
            context[key] = newContext[key]
          }
        }
      }
    }

    let instance: any = {
      context: context,
      parent: parentLogger,
      fatal: function () {
        let meta = getMeta(arguments, context)
        winstonLogger.error(arguments[0], meta)
      },
      error: function () {
        let meta = getMeta(arguments, context)
        winstonLogger.error(arguments[0], meta)
      },
      warn: function () {
        let meta = getMeta(arguments, context)
        winstonLogger.warn(arguments[0], meta)
      },
      info: function () {
        let meta = getMeta(arguments, context)
        winstonLogger.info(arguments[0], meta)
      },
      verbose: function () {
        let meta = getMeta(arguments, context)
        winstonLogger.verbose(arguments[0], meta)
      },
      debug: function () {
        let meta = getMeta(arguments, context)
        winstonLogger.debug(arguments[0], meta)
      },
      silly: function () {
        let meta = getMeta(arguments, context)
        winstonLogger.silly(arguments[0], meta)
      },
      end: function () {
        if (this.startTime) {
          let span = (new Date().getTime() - this.startTime) / 1000
          arguments[0] = arguments[0] || `took: ${span} second(s)`
          arguments[1] = arguments[1] || {}
          arguments[1].took = span
        }
        let meta = getMeta(arguments, context)
        winstonLogger.silly(arguments[0], meta)

        if (instance.parent && instance.parent.context) {
          instance.context = instance.parent.context
        }
      },
    }

    return instance
  }

  const start = function (param: any, parent: any) {
    var newLogger = loggerFactory(param, parent)
    newLogger.startTime = new Date()
    newLogger.start = function (param: any) {
      return start(param, newLogger)
    }

    newLogger.silly('started')

    return newLogger
  }

  const logger = loggerFactory()

  logger.start = function (param: any) {
    return start(param, logger)
  }

  return logger
}
