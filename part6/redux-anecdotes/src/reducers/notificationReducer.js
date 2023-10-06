import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null, 
  reducers: {
    setMessage(state, action) {
      return action.payload
    },
    clearMessage(state) {
      return null
    }
  }
})

export const { setMessage, clearMessage } = notificationSlice.actions

export const setNotification = (message, duration) => {
  return dispatch => {
    dispatch(setMessage(message))
    setTimeout(() => {
      dispatch(clearMessage())
    }, (duration * 1000))
  }
}

export default notificationSlice.reducer