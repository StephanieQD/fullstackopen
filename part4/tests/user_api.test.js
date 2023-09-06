const mongoose = require('mongoose')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const User = require('../models/user')
const logger = require('../utils/logger')

beforeEach(async () => {
  await User.deleteMany({})

  logger.info('Deleting users...')

  const passwordHash = await bcrypt.hash('imsad', 10)
  const user = new User({
    username: 'stephie',
    name: 'Broken Stephie',
    passwordHash: passwordHash
  })
  await user.save()
})

// Write a test to confirm the success of a new user addition when valid.
describe('addition of a new user', () => {
  test('succeeds with valid data', async () => {
    const newUser = {
      username: 'jeffy',
      name: 'Beautiful Hubby',
      password: 'goodboy'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(2)

    const contents = usersAtEnd.map(n => n.username)
    expect(contents).toContain(
      'jeffy'
    )
  })

  test('fails with duplicate data', async () => {
    // Write a test to confirm the failure of a test when duplicating the existing user.
    const existingUser = {
      username: 'stephie',
      name: 'Broken Stephie',
      password: 'imsad'
    }
    const result = await api
      .post('/api/users')
      .send(existingUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    logger.info('Checking failure...')
    logger.info(result.body.error)

    expect(result.body.error).toContain('`username` to be unique')
  })

  // Write a test to confirm the failure of a test when user name or password is missing.
  test('fails with incomplete data', async () => {
    const testUser = {
      name: 'New Person',
      password: 'fail'
    }
    const result = await api
      .post('/api/users')
      .send(testUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    logger.info('Checking failure...')
    logger.info(result.body.error)

    expect(result.body.error).toContain('Username missing')
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})