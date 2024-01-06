import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import paginate from '../helpers/paginate'
import toJSON from '../helpers/toJSON'
import { IUserDoc, IUserModel } from './../interfaces/user'

const userSchema = new mongoose.Schema<IUserDoc, IUserModel>(
  {
    authMethod: String,
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    language: String,
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    code: String,
    status: {
      type: String,
      enum: ['active', 'blocked', 'inactive', 'pending', 'deleted'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
)

// add plugin that converts mongoose to json
userSchema.plugin(toJSON)
userSchema.plugin(paginate)

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.static(
  'isEmailTaken',
  async function (
    email: string,
    excludeUserId: mongoose.ObjectId,
  ): Promise<boolean> {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } })
    return !!user
  },
)

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.method(
  'isPasswordMatch',
  async function (password: string): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this
    return bcrypt.compare(password, user.password)
  },
)

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10)
  }
  next()
})

const User = mongoose.model<IUserDoc, IUserModel>('User', userSchema)

export default User
