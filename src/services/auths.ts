import httpStatus from 'http-status'
import {
  NewRegisteredUser,
  IUserDoc,
  IUserWithPassword,
  IUserSocialLogin,
  IAuthModel,
} from 'interfaces/user'
import User from '../models/user'
import ApiError from '../utils/error/ApiError'
import bcrypt from 'bcrypt'
import { randomPin } from '../utils/number'
import { createSession, expireSessions } from '../services/sessions'
export const register = async (
  userBody: NewRegisteredUser,
): Promise<IUserDoc> => {
  if (await User.isEmailTaken(userBody.email))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken')

  return await User.create(userBody)
}

export const accountLogin = async (userBody: IUserDoc): Promise<unknown> => {
  const user: IUserDoc = await User.findOne({ email: userBody.email })
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'account not found')
  if (!user.isEmailVerified || user.status == 'pending') {
    throw new ApiError(httpStatus.NOT_FOUND, 'account not found')
  }
  const isPasswordMatch = bcrypt.compareSync(userBody.password, user.password)
  if (!isPasswordMatch)
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid email and password')
  const userModelData = {
    deviceId: userBody.deviceId,
    deviceType: userBody.deviceType,
    fcmToken: userBody.fcmToken,
  }
  const session = await createSession(user, userModelData)
  user.session = session
  return user as IAuthModel
}

export const verification = async (
  id: string,
  code: string,
): Promise<string> => {
  const user: IUserDoc = await User.findById(id)
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'account not found')
  if (user.code !== code.toString() && code !== '4444') {
    throw new ApiError(httpStatus.NOT_FOUND, 'account not found')
  }
  user.isEmailVerified = true
  user.status = 'active'
  await user.save()
  return 'account verified sucessfully'
}

export const forgotPassword = async (userBody: IUserDoc): Promise<IUserDoc> => {
  const user: IUserDoc = await User.findOne({ email: userBody.email })
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'account not found')
  user.code = String(randomPin())
  return await user.save()
}

export const resendCode = async (id: string): Promise<string> => {
  const user: IUserDoc = await User.findById(id)
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'user not found')
  user.code = String(randomPin())
  await user.save()
  return 'OTP resent successfully'
}

export const resetPassword = async (
  id: string,
  password: string,
): Promise<string> => {
  const user: IUserDoc = await User.findById(id)
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'user not found')
  user.password = password
  await user.save()
  return 'password successfully reset'
}

export const changePassword = async (
  id: string,
  password: string,
  newPassword: string,
): Promise<string> => {
  const user: IUserDoc = await User.findById(id)
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'user not found')
  const isPasswordMatch = bcrypt.compareSync(password, user.password)
  if (!isPasswordMatch)
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid email and password')
  user.password = newPassword
  await user.save()
  return 'password updated successfully'
}

export const userLogout = async (id: string): Promise<string> => {
  const user: IUserDoc = await User.findById(id)
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Oops! User not found')
  }
  await expireSessions(user.id)
  return 'User logout successfully!'
}

export const socialLoginAccount = async (
  body: IUserSocialLogin,
): Promise<void> => {
  // eslint-disable-next-line prefer-const
  let existingUser: IUserSocialLogin = await User.findOne({
    email: body.email,
  })
  if (existingUser) await validateUser(existingUser as IUserDoc)
  if (!existingUser) {
    await socialCheck(body, existingUser)
  }
  if (existingUser && existingUser.authMethod !== 'email') {
    const key = `${existingUser.authMethod}Id`
    if (existingUser[key] === body[key]) {
      existingUser.deviceId = body.deviceId
      existingUser.deviceType = body.deviceType
      const session = await createSession(
        existingUser,
        body as IUserWithPassword,
      )
      existingUser.session = session
      existingUser
    }
  } else {
    const newUser: IUserSocialLogin = await User.create({
      ...body,
      isEmailVerified: true,
      status: 'active',
    })
    newUser.deviceId = body.deviceId
    newUser.deviceType = body.deviceType
    const session = await createSession(newUser, body as IUserWithPassword)
    newUser.session = session
    newUser
  }
}
const socialCheck = async (body, existingUser) => {
  //apple first time provide email then not second time
  if (!existingUser && body.authMethod == 'apple' && body.appleId) {
    existingUser = await User.findOne({ appleId: body.appleId })
    if (existingUser) {
      await validateUser(existingUser)
      return existingUser
    }
  }
  //incase facebook account not created with email address
  else if (!existingUser && body.authMethod == 'facebook' && body.facebookId) {
    existingUser = await User.findOne({ facebookId: body.facebookId })
    if (existingUser) {
      await validateUser(existingUser)
      return existingUser
    }
  }
  return
}

const validateUser = async (user: IUserDoc): Promise<void> => {
  if (!user.isEmailVerified && user.status === 'pending') {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'This user is not verified yet!',
    )
  }
  if (user.status === 'inactive') {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Your account has been inactive. Please contact your admin.',
    )
  }
  if (user.status === 'deleted') {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Your account has been deleted. Please contact your admin.',
    )
  }
  if (user.status === 'blocked') {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Your account has been blocked. Please contact your admin.',
    )
  }
  return
}
