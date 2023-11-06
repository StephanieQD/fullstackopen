import { useEffect } from 'react'
import loginService from './services/login'
import storageService from './services/storage'

import LoginForm from './components/Login'
import Notification from './components/Notification'
import BlogList from './components/BlogList'
import UserList from './components/UserList'
import User from './components/User'
import Blog from './components/Blog'
import Navigation from './components/Navigation'
import { useNotify } from './components/NotificationContext'
import { useUserValue, useUserDispatch } from './components/UserContext'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import './main.css'

import { Routes, Route } from 'react-router-dom'

const App = () => {
  const user = useUserValue()
  const setUser = useUserDispatch()
  const setNotif = useNotify()

  useEffect(() => {
    const loggedUser = storageService.loadUser()
    setUser({ type: 'SET', payload: loggedUser })
  }, [])

  const notifyWith = (message, type = 'info') => {
    setNotif({
      message,
      type,
    })
  }

  const login = async (username, password) => {
    try {
      const loggedUser = await loginService.login({ username, password })
      setUser({ type: 'SET', payload: loggedUser })
      console.log('user', user)
      storageService.saveUser(loggedUser)
      notifyWith('Login successful, welcome back!', 'success')
    } catch (e) {
      console.log('This is the error', e)
      notifyWith('wrong username or password', 'error')
    }
  }

  const logout = async () => {
    setUser({ type: 'CLEAR' })
    storageService.removeUser()
    notifyWith('logged out')
  }

  if (!user) {
    return (
      <Container>
        <Typography sx={{ marginBottom: 1 }} variant="h5">
          log in to application
        </Typography>
        <Notification />
        <LoginForm login={login} />
      </Container>
    )
  }

  return (
    <div>
      <Navigation logout={logout} />
      <Container>
        <Notification />
        <Routes>
          <Route path="/blogs/:id" element={<Blog />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/" element={<BlogList />} />
          <Route path="/users" element={<UserList />} />
        </Routes>
      </Container>
    </div>
  )
}

export default App
