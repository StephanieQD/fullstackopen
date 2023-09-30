import { useSelector, useDispatch } from 'react-redux'
import { castVote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const anecdotes = useSelector(state => state)
  const dispatch = useDispatch()
  const vote = (id) => {
    console.log('vote', id)
    dispatch(castVote(id))
  }
 
  return (
    <div>
      {anecdotes.sort((q1, q2) => q2.votes - q1.votes).map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteForm