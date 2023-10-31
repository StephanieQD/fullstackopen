import { useEffect } from 'react'
import loginService from './services/login'
import storageService from './services/storage'

import LoginForm from './components/Login'
import Notification from './components/Notification'
import BlogList from './components/BlogList'
import UserList from './components/UserList'
import { useNotify } from './components/NotificationContext'
import { useUserValue, useUserDispatch } from './components/UserContext'

import { Routes, Route, Link } from 'react-router-dom'

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
      notifyWith('welcome!')
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
      <div>
        <h2>log in to application</h2>
        <Notification />
        <LoginForm login={login} />
      </div>
    )
  }

  return (
    <div>
      <div>
        <Link style={{ padding: 5 }} to="/">
          home
        </Link>
        <Link style={{ padding: 5 }} to="/users">
          users
        </Link>
      </div>
      <h2>blogs</h2>
      <Notification />
      <div>
        {user.name} logged in <br />
        <button onClick={logout}>logout</button>
      </div>
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/users" element={<UserList />} />
      </Routes>
    </div>
  )
}

export default App
