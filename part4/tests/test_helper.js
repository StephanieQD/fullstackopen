const Blog = require('../models/blog')
const User = require('../models/user')


const initialBlogs = [
  {
    title: 'JS Mastery',
    author: 'Adrian Hajdin',
    url: 'https://www.jsmastery.pro/full-stack-web-development-bootcamp',
    likes: 7
  },
  {
    title: 'async function - JavaScript | MDN',
    author: 'Mozilla',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function',
    likes: 5
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb, usersInDb
}