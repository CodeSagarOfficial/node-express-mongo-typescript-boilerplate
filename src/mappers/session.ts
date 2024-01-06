'use strict'

import { ISession } from 'interfaces/session'

const toModel = (entity: ISession): any => {
  const model = {
    accessToken: entity.accessToken,
    refreshToken: entity.refreshToken,
  }
  return model
}

export default toModel
