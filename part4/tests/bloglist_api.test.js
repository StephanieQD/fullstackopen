const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

describe('Verify the ID', () => {
  test('Ensure ID is set', async () => {
    const blogs = await helper.blogsInDb()
    expect(blogs[0].id).toBeDefined()
  })
})

describe('addition of a new blog', () => {
  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'My daddy\'s dead :(',
      author: 'Broken Stephie',
      url: 'https://fullstackopen.com/en/part4/testing_the_backend#exercises-4-8-4-12',
      likes: 17
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(1)

    const contents = blogsAtEnd.map(n => n.title)
    expect(contents).toContain(
      'My daddy\'s dead :('
    )
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})