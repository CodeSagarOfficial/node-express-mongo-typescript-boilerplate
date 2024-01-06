import Joi from 'joi'
import { password, objectId } from './custom.validation'
import { NewCreatedUser } from '../interfaces/user'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createUserBody: Record<keyof NewCreatedUser, any> = {
  code: Joi.string(),
  status: Joi.string().default('pending'),
  email: Joi.string().required().email().lowercase(),
  password: Joi.string().required().custom(password),
  authMethod: Joi.string()
    .required()
    .valid('google', 'facebook', 'apple', 'email'),
  name: Joi.string().required().lowercase(),
  role: Joi.string().valid('user', 'admin', 'guest'),
  language: Joi.string().default('english'),
}

export const createUser = {
  body: Joi.object().keys(createUserBody),
}

export const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
}

export const getUser = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}

export const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
}

export const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
}

export const login = {
  body: Joi.object().keys({
    email: Joi.string().lowercase(),
    password: Joi.string(),
    deviceId: Joi.string(),
    deviceType: Joi.string().default('ios'),
    fcmToken: Joi.string(),
  }),
}
export const verify = {
  body: Joi.object().keys({
    userId: Joi.string().lowercase(),
    code: Joi.string(),
  }),
}

export const forgot = {
  body: Joi.object().keys({
    email: Joi.string().lowercase(),
  }),
}

export const resendOtp = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}

export const reset = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    password: Joi.string().required(),
  }),
}
export const updatePassword = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    password: Joi.string().required(),
    newPassword: Joi.string().required(),
  }),
}

export const socialLogin = {
  body: Joi.object().keys({
    authMethod: Joi.string()
      .required()
      .valid('email', 'google', 'facebook', 'apple', 'twitter'),
    name: Joi.string(),
    email: Joi.string().required().email().lowercase(),
    deviceId: Joi.string().optional(),
    googleId: Joi.string().optional(),
    facebookId: Joi.string().optional(),
    appleId: Joi.string().optional(),
    imgUrl: Joi.string(),
    status: Joi.string(),
    deviceType: Joi.string().optional().valid('web', 'android', 'ios'),
    role: Joi.string().default('user'),
  }),
}
