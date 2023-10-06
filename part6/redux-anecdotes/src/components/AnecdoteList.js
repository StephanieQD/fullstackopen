import { useSelector, useDispatch } from 'react-redux'
import { incrementVote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(({filter, anecdotes}) => {
    if ( filter === null || filter === '' ) {
      return anecdotes
    }
    const regex = new RegExp( filter, 'i' )
    return anecdotes.filter(anecdote => anecdote.content.match(regex))
  })

  const dispatch = useDispatch()
  const vote = (anecdote) => {
    console.log('vote', anecdote.id)
    dispatch(incrementVote(anecdote))
    dispatch(setNotification(`You voted for "${anecdote.content}"`))
    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }
 
  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes} votes
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList