// user.test.ts
import setupTestDB from './setupTestDB'
import request from 'supertest'
import app from '../app'
import { faker } from '@faker-js/faker'
const email: string = faker.internet.email()

setupTestDB()

describe('User API Tests', () => {
  test('POST /api/users creates a new user', async () => {
    const newUser = {
      name: faker.person.fullName(),
      email: email,
      password: 'Qwerty@123',
      authMethod: 'email',
    }

    const response = await request(app).post('/api/users').send(newUser)
    expect(response.body.isSuccess)
  })
})
