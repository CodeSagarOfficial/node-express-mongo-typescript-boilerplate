import mongoose from 'mongoose'

/**
 * @param {string} MONGO_URI
 */
const connectToDatabase = async (MONGO_URI): Promise<void> => {
  try {
    mongoose.connect(MONGO_URI)

    const db = mongoose.connection

    db.on('error', console.error.bind(console, 'MongoDB connection error:'))
    db.once('open', () => {
      console.log('Connected to MongoDB')
    })
  } catch (error) {
    console.error('MongoDB connection error:', error)
  }
}

export default connectToDatabase
