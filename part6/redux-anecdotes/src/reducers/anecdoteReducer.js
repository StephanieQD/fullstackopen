import { createSlice } from '@reduxjs/toolkit'

import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState: [], 
  reducers: {
    increaseVote(state, action) {
      const id = action.payload
      const quoteToChange = state.find(n => n.id === id)
      const changedQuote = {
        ...quoteToChange,
        votes: quoteToChange.votes + 1
      }
      let newState = state.map(quote =>
        quote.id !== id ? quote : changedQuote
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
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export default anecdoteSlice.reducer;