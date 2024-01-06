'use strict'
import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { verifyAccessToken, verifyRefreshToken } from '../utils/jwt'
import { get } from '../services/sessions'
import ApiError from '../utils/error/ApiError'
import User from '../models/user'
import { ISession } from 'interfaces/session'
import { IUserDoc } from 'interfaces/user'

interface Claims {
  session: string
  user: string
}

const tokenValidator = async (token: string): Promise<Claims> => {
  try {
    return verifyAccessToken(token) as Claims
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Token Expired')
    }
    throw new ApiError(httpStatus.UNAUTHORIZED, err)
  }
}

const sessionValidator = async (sessionId: string) => {
  const session = await get(sessionId)
  if (!session) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Session not found')
  }
  if (session.status === 'expired') {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Session expired')
  }
  return session
}

const userValidator = async (userId: string) => {
  const user = await User.findById(userId)
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found')
  }
  if (user.status === 'inactive') {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User status is inactive.')
  }
  if (user.status === 'deleted') {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User status is deleted')
  }
  if (user.status === 'blocked') {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User status is blocked.')
  }
  return user
}
interface ReqModel extends Request {
  sessionId: string
  userId: string
  session: ISession
  user: IUserDoc
}

export const validateToken = async (
  req: ReqModel,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers['x-access-token']
    if (!token) throw new ApiError(httpStatus.UNAUTHORIZED, 'token Required')

    const claims = await tokenValidator(token)
    req.sessionId = claims.session
    req.userId = claims.user

    const session = await sessionValidator(req.sessionId)
    req.session = session

    const user = await userValidator(req.userId)
    req.user = user

    // TODO permission validate pending

    next()
  } catch (err) {
    res.send({ isSuccess: false, ...err })
  }
}

export const validateTokenOptional = (
  req: ReqModel,
  res: Response,
  next: NextFunction,
) => {
  const token =
    req.body.token || req.query.token || req.headers['x-access-token']
  if (!token) return validateToken(req, res, next)

  req.sessionId = null
  req.userId = null
  req.session = null
  req.user = null
  next()
}

export const validateRefreshToken = async (
  req: ReqModel,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = req.cookies.refreshToken || req.headers['refreshToken']

  if (!refreshToken) {
    return res.status(403).send({
      success: false,
      message: 'refreshToken is required.',
    })
  }

  const claims = verifyRefreshToken(refreshToken) as Claims
  const user = await User.findById(claims.user)
  req.user = user
  next()
}
