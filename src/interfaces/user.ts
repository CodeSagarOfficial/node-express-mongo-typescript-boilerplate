import mongoose, { Model, Document } from 'mongoose'
import { QueryResult } from '../helpers/paginate'
import { ISession } from './session'

export interface IUser {
  name: string
  email: string
  password: string
  role: string
  isEmailVerified: boolean
  authMethod: string
  language: string
  // imgUrl: string
  status: string
  code: string
  // createdAt: Date
  // updatedAt: Date
}

export interface IAuthUser {
  email: string
  password: string
  role: string
  authMethod: string
  language: string
  status: string
  code: string
}
export interface IUserDoc extends IUser, Document {
  fcmToken?: string
  deviceType?: string
  deviceId?: string
  session?: ISession
  isPasswordMatch(password: string): Promise<boolean>
}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(
    email: string,
    excludeUserId?: mongoose.Types.ObjectId,
  ): Promise<boolean>
  paginate(
    filter: Record<string, any>,
    options: Record<string, any>,
  ): Promise<QueryResult>
}

export type UpdateUserBody = Partial<IUser>

export type NewRegisteredUser = Omit<IUser, 'role' | 'isEmailVerified'>

export type NewCreatedUser = Omit<IUser, 'isEmailVerified'>

export interface IUserWithTokens {
  user: IUserDoc
  accessToken: string
}

export interface IUserWithPassword extends IUser {
  password: string
  deviceId: string
  deviceType: string
  fcmToken: string
}

export interface IUserSocialLogin extends IUserDoc {
  deviceId?: string
  deviceType?: string
  fcmToken?: string
  session?: ISession
}

export interface IAuthModel extends IUserDoc {
  session?: ISession
}

export interface toUserModel extends IUserDoc {
  imgUrl: string
  createdAt: Date
  updatedAt: Date
}
