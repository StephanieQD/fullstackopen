import { createSlice } from '@reduxjs/toolkit'


const getId = () => (100000 * Math.random()).toFixed(0)

const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState: [], 
  reducers: {
    createAnecdote(state, action) {
      const content = action.payload
      state.push({
        content,
        id: getId(),
        votes: 0
      })
    },
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

export const { createAnecdote, increaseVote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export default anecdoteSlice.reducer;