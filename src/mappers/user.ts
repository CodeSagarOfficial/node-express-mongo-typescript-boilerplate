import { IAuthModel, toUserModel } from './../interfaces/user'
import _ from 'underscore'
import SessionM from './session'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toModel = (entity: toUserModel): any => {
  const model = {
    id: entity._id,
    name: entity.name,
    imgUrl: entity.imgUrl,
    email: entity.email,
    isEmailVerified: entity.isEmailVerified,
    status: entity.status,
    language: entity.language,
    role: entity.role,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  }
  return model
}
export const toSearchModel = entities => {
  return _.map(entities, toModel)
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toAuthModel = (entity: IAuthModel): any => {
  const model = toModel(entity as toUserModel)
  if (entity.session) {
    model.session = SessionM(entity.session)
  }
  return model
}
