import axios from 'axios'

const devMode = true
const baseUrl = devMode ? 'http://localhost:3001/api/persons' : '/api/persons' 

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then(response => response.data);
}

const deletePerson = id => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request
}


const service = { getAll, create, update, deletePerson } // Assigning so ESLint doesn't yell at me...

export default service; 