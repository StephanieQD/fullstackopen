import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { NotificationContextProvider } from './components/NotificationContext'
import { UserContextProvider } from './components/UserContext'

// Begin 7.10 - React Query Ver.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const queryClient = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <QueryClientProvider client={queryClient}>
    <UserContextProvider>
      <NotificationContextProvider>
        <App />
      </NotificationContextProvider>
    </UserContextProvider>
  </QueryClientProvider>
)
