import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [type, setType] = useState('good')
  const [title, setTitle] = useState('') 
  const [author, setAuthor] = useState('') 
  const [url, setUrl] = useState('')
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = () => {
    console.log(`Signing out ${user.name}...`)
    setUser(null)
    window.localStorage.removeItem('loggedBlogUser')
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setType('bad')
      setNotification('Wrong credentials')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleBlogSubmission = async (event) => {
    event.preventDefault()

    if ( ! author || ! url || ! title ) {
      setType('bad')
      setNotification('Please finish filling out blog form...')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      return
    }
    
    try {
      const newBlog = await blogService.create({
        title, author, url
      })
      blogFormRef.current.toggleVisibility()
      setType('good')
      setNotification(`New blog "${newBlog.title}" by ${newBlog.author} added`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      setBlogs(blogs.concat(newBlog))
      // Clear the form out
      setAuthor('')
      setTitle('')
      setUrl('')
    } catch (exception) {
      console.log(exception)
      setType('bad')
      setNotification('Something went wrong...')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const newBlogForm = () => (
    <form onSubmit={handleBlogSubmission}>
      <div>
        <label>
          Title
          <input
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Author
          <input
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          URL
          <input
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </label>
      </div>
      <button type="submit">create new blog</button>
    </form>      
  )

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const blogList = () => (
    <div>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  return (
    <main>
      {notification !== null && <Notification message={notification} type={type} />}
      {user === null && loginForm()}
      {user && <div>
        <p>{user.name} logged in <button onClick={handleLogout}>Logout</button> </p>
        <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
          {newBlogForm()}
        </Togglable>
        {blogList()}
      </div>}
    </main>
  )
}

export default App