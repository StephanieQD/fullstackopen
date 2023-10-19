const notificationReducer = (state = { message: null }, action) => {
  switch (action.type) {
    case 'MESSAGE':
      return action.payload
    case 'CLEAR':
      return {
        message: null,
      }
    default:
      return state
  }
}

export const sendNotification = (message, type) => {
  return {
    type: 'MESSAGE',
    payload: {
      message,
      type,
    },
  }
}

export default notificationReducer
