const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})


/*--------------------------------------------------
 # Create a new blog
 --------------------------------------------------*/
blogsRouter.post('/', async (request, response, next) => {
  const { title, author, url, likes } = request.body

  const user = request.user

  if ( ! user || ! user._id ) {
    return response.status(401).json({ error: 'Unauthorized: User not found' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id
  })

  try {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch(exception) {
    next(exception)
  }

})

/*--------------------------------------------------
 # Delete a blog by ID
 --------------------------------------------------*/
blogsRouter.delete('/:id', async (request, response, next) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if ( ! blog.user || blog.user.toString() !== user.id.toString() ) {
    return response.status(401).json({ error: 'blog must be created by same user for deletion' })
  }

  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch(exception) {
    next(exception)
  }
})

/*--------------------------------------------------
 # Update by ID
 --------------------------------------------------*/
blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  let blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  if (body.user) {
    blog.user = body.user
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog.toJSON())
    console.log(updatedBlog.toJSON())
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter