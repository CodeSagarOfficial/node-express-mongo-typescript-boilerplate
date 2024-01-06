import Joi from 'joi'
import { password } from './custom.validation'
import { IAuthUser } from '../interfaces/user'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createUserBody: Record<keyof IAuthUser, any> = {
  code: Joi.string(),
  status: Joi.string().default('pending'),
  email: Joi.string().required().email().lowercase(),
  password: Joi.string().required().custom(password),
  authMethod: Joi.string()
    .required()
    .valid('google', 'facebook', 'apple', 'email'),
  role: Joi.string().valid('user', 'admin', 'guest').default('user'),
  language: Joi.string().default('english'),
}

export const createUser = {
  body: Joi.object().keys(createUserBody),
}
