import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Begin 7.10
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import notificationReducer from './reducers/notificationReducer'

const store = createStore(notificationReducer)

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <Provider store={store}>
    <App />
  </Provider>
)
