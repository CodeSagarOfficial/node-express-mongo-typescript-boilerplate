import { IUserModel, IUserDoc } from './user'
import moment from 'moment'
export interface ISession {
  id: string
  deviceId: string
  deviceType: string
  accessToken: string
  refreshToken: string
  fcmToken: string
  status: string
  accessTokenExpires: string
  refreshTokenExpires: string
  user: IUserModel
}

export interface ISessionModel {
  user: IUserDoc['id']
  fcmToken: string
  deviceType: string
  deviceId: string
  accessToken?: string
  refreshToken?: string
  accessTokenExpires?: moment.Moment
  refreshTokenExpires?: moment.Moment
}

export interface ISessionDoc extends ISessionModel {
  id: string
}
