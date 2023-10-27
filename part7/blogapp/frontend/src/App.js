import { useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import storageService from './services/storage'

import LoginForm from './components/Login'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { useNotify } from './components/NotificationContext'
import { useUserValue, useUserDispatch } from './components/UserContext'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const App = () => {
  const user = useUserValue()
  const setUser = useUserDispatch()

  const queryClient = useQueryClient()
  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
    retry: 1,
  })

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      notifyWith(`A new blog '${newBlog.title}' by '${newBlog.author}' added`)
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
    },
  })

  const addLikeMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: (updatedBlog) => {
      notifyWith(
        `Added like for the blog '${updatedBlog.title}' by '${updatedBlog.author}'`
      )
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b))
      )
    },
  })

  const removeMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (removedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs.filter((b) => b.id !== removedBlog.id)
      )
      notifyWith(
        `The blog "${removedBlog.title}" by ${removedBlog.author} has been removed`
      )
    },
  })

  const blogFormRef = useRef()

  const setNotif = useNotify()

  useEffect(() => {
    const loggedUser = storageService.loadUser()
    setUser({ type: 'SET_USER', payload: loggedUser })
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
      setUser({ type: 'SET_USER', payload: loggedUser })
      storageService.saveUser(user)
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

  const createBlog = (newBlog) => {
    newBlogMutation.mutate(newBlog)
    blogFormRef.current.toggleVisibility()
  }

  const like = (blog) => {
    const blogToUpdate = { ...blog, likes: blog.likes + 1, user: blog.user.id }
    addLikeMutation.mutate(blogToUpdate)
  }

  const remove = (blog) => {
    const ok = window.confirm(
      `Sure you want to remove '${blog.title}' by ${blog.author}`
    )
    if (ok) {
      removeMutation.mutate(blog)
    }
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

  const byLikes = (b1, b2) => b2.likes - b1.likes

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>Something went wrong, please try again later...</div>
  }

  const queryBlogs = result.data
  console.log('queryBlogs', queryBlogs)

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <div>
        {user.name} logged in
        <button onClick={logout}>logout</button>
      </div>
      <Togglable buttonLabel="new note" ref={blogFormRef}>
        <NewBlog createBlog={createBlog} />
      </Togglable>
      <div>
        {queryBlogs.sort(byLikes).map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            like={() => like(blog)}
            canRemove={
              user && blog.user && blog.user.username === user.username
            }
            remove={() => remove(blog)}
          />
        ))}
      </div>
    </div>
  )
}

export default App
