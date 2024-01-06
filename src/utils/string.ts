import { Types } from 'mongoose'
import validator from 'validator'

declare global {
  interface String {
    toObjectId(): Types.ObjectId
    isObjectId(): boolean
    isEmail(): boolean
    isPhone(): boolean
    isMobile(): boolean
    randomString(length?: number): string
  }
}

String.prototype.toObjectId = function (this: string): Types.ObjectId {
  const ObjectId = Types.ObjectId
  return new ObjectId(this.toString())
}

String.prototype.isObjectId = function (this: string): boolean {
  return validator.isMongoId(this)
}

String.prototype.isEmail = function (this: string): boolean {
  return validator.isEmail(this)
}

String.prototype.randomString = function (this: string, length = 5): string {
  let result = this
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
