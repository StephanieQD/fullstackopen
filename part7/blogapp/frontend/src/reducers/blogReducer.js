// For previous version (Redux) - Unused
import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_BLOG':
      return [...state, action.payload]
    case 'INIT_BLOGS':
      return action.payload
    default:
      return state
  }
}

export const setBlogs = (blogs) => {
  return {
    type: 'INIT_BLOGS',
    payload: blogs,
  }
}

export const addBlog = (blog) => {
  return {
    type: 'NEW_BLOG',
    payload: blog,
  }
}

export const createABlog = (object) => {
  return async (dispatch) => {
    const blog = await blogService.create(object)
    dispatch(addBlog(blog))
  }
}

export const initBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export default blogReducer
