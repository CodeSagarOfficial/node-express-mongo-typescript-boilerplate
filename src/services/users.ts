import httpStatus from 'http-status'
import User from '../models/user'
import ApiError from '../utils/error/ApiError'
import { NewCreatedUser, IUserDoc, UpdateUserBody } from '../interfaces/user'
import { IOptions, QueryResult } from '../helpers/paginate'

const set = <T>(model: T, entity: T): T => {
  Object.assign(entity, model)
  return entity
}

/**
 * Create a user
 * @param {NewCreatedUser} userBody
 * @returns {Promise<IUserDoc>}
 */
export const createUser = async (
  userBody: NewCreatedUser,
): Promise<IUserDoc> => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken')
  }
  return await User.create(userBody)
}

/**
 *
 * @param id
 * @param model
 * @returns
 */
export const updateUser = async (
  id: string,
  model: UpdateUserBody,
): Promise<IUserDoc> => {
  const entity: IUserDoc | null = await User.findById(id)

  if (entity) {
    set(model, entity)
    await entity.save()
  }
  return entity
}

export const getById = async (id: string): Promise<IUserDoc | null> => {
  return await User.findById(id)
}

export const getByCondition = async (condition: {
  email?: string
}): Promise<IUserDoc | null> => {
  return await User.findOne(condition)
}

export const get = async (
  query: string | { id?: string; email?: string },
): Promise<IUserDoc | null> => {
  if (typeof query === 'string') {
    return getById(query as string)
  }

  if (query.id) {
    return getById((query as { id?: string }).id)
  }

  if (query.email) {
    return getByCondition({
      email: (query as { email?: string }).email,
    })
  }

  return null
}

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const search = async (
  filter: Record<string, any>,
  options: IOptions,
): Promise<QueryResult> => {
  const users = await User.paginate(filter, options)
  return users
}

export const deleteOne = async (id: string): Promise<string | null> => {
  const user: IUserDoc | null = await getById(id)

  if (!user) {
    return 'User not found'
  }

  await user.deleteOne()
  return 'User deleted successfully'
}
