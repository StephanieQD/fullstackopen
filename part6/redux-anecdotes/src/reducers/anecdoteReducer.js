import { createSlice } from '@reduxjs/toolkit'

import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState: [], 
  reducers: {
    increaseVote(state, action) {
      const updatedAnecdote = action.payload
      let newState = state.map(quote =>
        quote.id !== updatedAnecdote.id ? quote : updatedAnecdote
      )

      return newState.sort((q1, q2) => q2.votes - q1.votes)
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action){
      return action.payload
    }
  }
})

export const { increaseVote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes.sort((q1, q2) => q2.votes - q1.votes)))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const incrementVote = anecdote => {
  return async dispatch => {
    const anecdoteToUpdate = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
    const updatedAnecdote = await anecdoteService.updateEntry(anecdoteToUpdate)
    dispatch(increaseVote(updatedAnecdote))
  }
}

export default anecdoteSlice.reducer;