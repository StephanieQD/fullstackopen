import axios from 'axios'
import storageService from '../services/storage'
const baseUrl = '/api/blogs'

const headers = {
  Authorization: storageService.loadUser()
    ? `Bearer ${storageService.loadUser().token}`
    : null,
}

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const getBlogById = async (id) => {
  const request = await axios.get(`${baseUrl}/${id}`)
  return request.data
}

const addComment = async ({ id, comment }) => {
  console.log('adding comment', comment, id)
  const request = await axios.post(`${baseUrl}/${id}/comments`, { comment })
  return request.data
}

const create = async (object) => {
  const request = await axios.post(baseUrl, object, { headers })
  return request.data
}

const update = async (object) => {
  const request = await axios.put(`${baseUrl}/${object.id}`, object, {
    headers,
  })
  return request.data
}

const remove = async (blog) => {
  await axios.delete(`${baseUrl}/${blog.id}`, { headers })
  return blog
}

export default { getAll, create, update, remove, getBlogById, addComment }
