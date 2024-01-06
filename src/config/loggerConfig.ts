// loggerConfig.ts
class FileTransportConfig {
  filename: string
  level: string

  constructor(filename: string, level: string) {
    this.filename = filename
    this.level = level
  }
}

class ConsoleTransportConfig {
  level: string

  constructor(level: string) {
    this.level = level
  }
}

class HttpTransportConfig {
  level: string

  constructor(level: string) {
    this.level = level
  }
}

class CustomTransportConfig {
  handler: string
  level: string

  constructor(handler: string, level: string) {
    this.handler = handler
    this.level = level
  }
}

class LoggerConfig {
  level: string
  file?: FileTransportConfig
  console?: ConsoleTransportConfig
  http?: HttpTransportConfig
  custom?: CustomTransportConfig

  constructor(level: string, console?: ConsoleTransportConfig) {
    this.level = level
    this.console = console
  }
}

export {
  LoggerConfig,
  FileTransportConfig,
  ConsoleTransportConfig,
  HttpTransportConfig,
  CustomTransportConfig,
}
