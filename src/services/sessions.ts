import { ISession, ISessionModel } from './../interfaces/session'
import * as jwt from '../utils/jwt'
import moment from 'moment'
import { IUserDoc } from '../interfaces/user'
import Session from '../models/session'

interface userModel {
  deviceId: string
  deviceType: string
  fcmToken: string
}

export const createSession = async (
  user: IUserDoc['id'],
  body: userModel,
): Promise<ISession> => {
  const model: ISessionModel = {
    user: user.id,
    fcmToken: body.fcmToken || body.deviceId,
    deviceId: body.deviceId,
    deviceType: body.deviceType,
  }

  if (global.environment.auth.refreshPeriod == 'single') {
    await expireSessions(user.id)
  }
  const entity = await Session.create(model)
  entity.accessToken = jwt.getAccessToken(user, entity as ISession)
  entity.refreshToken = jwt.getRefreshToken(user)

  entity.accessTokenExpires = `${moment().add(
    global.environment.auth.secretKey,
    'minutes',
  )}`
  entity.refreshTokenExpires = `${moment().add(
    global.environment.auth.refreshPeriod,
    'days',
  )}`

  return (await entity.save()) as ISession
}

export const expireSessions = async (userId: IUserDoc['_id']) => {
  await Session.updateMany({ user: userId }, { status: 'expired' })
}

export const get = async (id: string) => {
  return await Session.findById(id)
}
