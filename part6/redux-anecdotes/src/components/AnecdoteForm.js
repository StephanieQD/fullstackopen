import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()
  const createNew = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = '' // clear out the form field
    dispatch(createAnecdote(content))
    dispatch(setNotification(`New anecdote added "${content}"`))
    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }
 
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={createNew}>
        <div><input name="anecdote" /></div>
        <button>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm