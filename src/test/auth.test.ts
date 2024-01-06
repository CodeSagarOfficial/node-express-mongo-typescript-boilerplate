// user.test.ts
import setupTestDB from './setupTestDB'
import request from 'supertest'
import app from '../app'
import { faker } from '@faker-js/faker'
const email: string = faker.internet.email()

setupTestDB()

describe('Auth API Tests', () => {
  test('POST /api/auths signup user', async () => {
    // Arrange
    const newUser = {
      email,
      password: 'Qwerty@123',
      authMethod: 'email',
    }

    // Act
    const response = await request(app).post('/api/auths/signup').send(newUser)
    // Assert
    expect(response.body.isSuccess).toBe(true)
  })
})
