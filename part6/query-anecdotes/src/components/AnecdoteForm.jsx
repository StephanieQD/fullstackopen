import PropTypes from 'prop-types';

const AnecdoteForm = ({creationFunc}) => {

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    console.log('new anecdote', content)
    creationFunc(content)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

AnecdoteForm.propTypes = {
  creationFunc: PropTypes.func
}

export default AnecdoteForm
