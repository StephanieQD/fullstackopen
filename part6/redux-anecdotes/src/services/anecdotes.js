import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getId = () => (100000 * Math.random()).toFixed(0)

const createNew = async (content) => {
  const object = {
    content,
    id: getId(),
    votes: 0
  }
  const response = await axios.post(baseUrl, object)
  return response.data
}

const updateEntry = async (newObject) => {
  const response = await axios.put(`${baseUrl}/${newObject.id}`, newObject)
  console.log('Updated entry', response.data)
  return response.data
}

const anecdoteService = { getAll, createNew, updateEntry }

export default anecdoteService