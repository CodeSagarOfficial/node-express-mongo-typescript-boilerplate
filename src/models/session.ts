import mongoose from 'mongoose'
import { ISession } from './../interfaces/session'

const sessionSchema = new mongoose.Schema<ISession>(
  {
    deviceId: String,
    deviceType: {
      type: String,
      default: 'ios',
      enum: ['ios', 'web', 'android'],
    },
    accessToken: String,
    refreshToken: String,
    fcmToken: String,
    accessTokenExpires: String,
    refreshTokenExpires: String,
    status: { type: String, default: 'active', enum: ['active', 'expired'] },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
    },
  },
  {
    timestamps: true,
  },
)

const Session = mongoose.model<ISession>('Session', sessionSchema)

export default Session
