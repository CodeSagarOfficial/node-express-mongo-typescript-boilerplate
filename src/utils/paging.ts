import { Request } from 'express'

interface Model {
  [key: string]: any
}

interface PagingOptions {
  sort: string
  pageNo: number
  limit: number
  skip: number
}

export const query = (req: Request): Model => {
  let query = req.query || {}
  let model: Model = {}

  Object.getOwnPropertyNames(query).forEach(key => {
    const value = query[key]

    if (!value) {
      return
    }

    let parts = key.split('-')
    let index = 0
    let obj = model

    for (const part of parts) {
      if (index === parts.length - 1) {
        obj[part] = value
      } else {
        obj[part] = obj[part] || {}
      }

      obj = obj[part]
      index++
    }
  })

  return model
}

export const extract = (req: Request): PagingOptions | null => {
  let serverPaging: boolean | undefined = Boolean(req.query.serverPaging)

  if (serverPaging === undefined) {
    if (
      req.query.pageNo !== undefined ||
      req.query.pageSize !== undefined ||
      req.query.limit !== undefined
    ) {
      serverPaging = true
    }
  } else {
    serverPaging = serverPaging == true ? true : serverPaging
  }

  if (serverPaging === false || req.query.noPaging) {
    return null
  }

  let limit = 10
  if (req.query.pageSize) {
    limit = Number(req.query.pageSize)
  }
  if (req.query.limit) {
    limit = Number(req.query.limit)
  }

  let offset = 0
  let pageNo = 1
  if (req.query.offset !== undefined) {
    offset = Number(req.query.offset)
    pageNo = Math.floor(offset / limit) + 1
  } else if (req.query.pageNo !== undefined) {
    pageNo = Number(req.query.pageNo)
    offset = limit * (pageNo - 1)
  }

  return {
    sort: String(req.query.sort) || 'createdAt',
    pageNo: pageNo,
    limit: limit,
    skip: offset,
  }
}
