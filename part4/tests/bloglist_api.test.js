const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')
const logger = require('../utils/logger')

beforeEach(async () => {
  await Blog.deleteMany({})

  logger.info('Deleting all...')

  await Blog.insertMany(helper.initialBlogs)
})

describe('Verifying initial blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body.map(r => r.title)

    expect(contents).toContain(
      'async function - JavaScript | MDN'
    )
  })
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
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(n => n.title)
    expect(contents).toContain(
      'My daddy\'s dead :('
    )
  })
})

describe('addition of a new blog without a likes property', () => {
  test('succeeds with valid data and likes unset', async () => {
    const newBlog = {
      title: 'Example Blog',
      author: 'Sample Person',
      url: 'https://fullstackopen.com/en/part4/testing_the_backend#exercises-4-8-4-12',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    logger.info('!!! Blogs !!!')
    logger.info(blogsAtEnd)
  })
})

describe('Should fail if things (title, URL) are not set', () => {
  test('should return a 400 error', async () => {
    await api
      .post('/api/blogs')
      .send({ author: 'Stephanie Q' })
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

/*--------------------------------------------------
 # Deletion test
 --------------------------------------------------*/
describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const contents = blogsAtEnd.map(r => r.title)

    expect(contents).not.toContain(blogToDelete.title)
  })
})

/*--------------------------------------------------
 # Update test
 --------------------------------------------------*/
describe('updating of a blog', () => {
  test('succeeds if ID is valid', async () => {
    const updatedProps = {
      likes: 222
    }
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedProps)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(updatedBlog.body.likes).toBe(updatedProps.likes)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})