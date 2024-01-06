import { setGlobalEnvironment } from '../global'
import Environment from '../environments/environment'

import mongoose from 'mongoose'

const env = new Environment()
setGlobalEnvironment(env)

const setupTestDB = () => {
  beforeAll(async () => {
    await mongoose.connect(env.mongodb.url)
  })

  beforeEach(async () => {
    await Promise.all(
      Object.values(mongoose.connection.collections).map(async collection =>
        collection.deleteMany({}),
      ),
    )
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })
}

export default setupTestDB
