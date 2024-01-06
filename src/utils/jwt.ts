import { setGlobalEnvironment } from '../global'
import * as jwt from 'jsonwebtoken'
import Environment from '../environments/environment'
import { IUserDoc } from 'interfaces/user'
const env: Environment = new Environment()
setGlobalEnvironment(env)

interface User {
  id: string
}

interface Session {
  id: string
}

interface Claims {
  session: string
  user: string
}

export const getAccessToken = (user: User, session: Session): string => {
  const claims: Claims = {
    session: session.id,
    user: user.id,
  }
  return jwt.sign(claims, global.environment.auth.secretKey, {
    expiresIn: `${global.environment.auth.secretPeriod}m`,
  })
}

export const getRefreshToken = (user: User): string => {
  const claims: Claims = {
    user: user.id,
    session: '',
  }
  return jwt.sign(claims, env.auth.refreshKey, {
    expiresIn: `${global.environment.auth.refreshPeriod}d`,
  })
}

export const verifyAccessToken = (token: string): unknown => {
  return jwt.verify(token, global.environment.auth.secretKey)
}

export const verifyRefreshToken = (token: string): IUserDoc['id'] => {
  return jwt.verify(token, global.environment.auth.refreshKey)
}
