class ApiError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    stack = '',
  ) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    Object.defineProperty(this, 'message', {
      enumerable: true,
      value: message,
    })

    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export default ApiError
