import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [type, setType] = useState('good')
  const blogFormRef = useRef()

  const getBlogs = async () => {
    const blogs = await blogService.getAll()
    setBlogs(blogs)
  }

  useEffect(() => {
    getBlogs()
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

  const handleBlogSubmission = async (blogToAdd) => {
    let { author, url, title } = blogToAdd

    if ( ! author || ! url || ! title ) {
      setType('bad')
      setNotification('Please finish filling out blog form...')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      return
    }

    try {
      const newBlog = await blogService.create(blogToAdd)
      blogFormRef.current.toggleVisibility()
      setType('good')
      setNotification(`New blog "${newBlog.title}" by ${newBlog.author} added`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      getBlogs()
    } catch (exception) {
      console.log(exception)
      setType('bad')
      setNotification('Something went wrong...')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleBlogDelete = async (BlogToUpdate) => {
    try {
      const deletedBlog = await blogService
        .deleteBlog(BlogToUpdate)
      setNotification(
        `Blog "${BlogToUpdate.title}" was successfully updated`
      )
      // Remove deleted blog from list
      let filtered = blogs.filter(function(el) { return el.id != BlogToUpdate.id }) 
      setBlogs( filtered )
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch(exception) {
      setNotification(
        `Cannot remove blog ${BlogToUpdate.title}`
      )
      console.log(exception)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleBlogUpdate = async (BlogToUpdate) => {
    try {
      const updatedBlog = await blogService
        .update(BlogToUpdate)
      setNotification(
        `Blog ${BlogToUpdate.title} was successfully updated`
      )

      console.log('updatedBlog')
      console.log(updatedBlog)
      getBlogs()
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch(exception) {
      setNotification(
        `Cannot update blog ${BlogToUpdate.title}`
      )
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

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
      {blogs.sort((b1, b2) => b2.likes - b1.likes).map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          updateFunc={ handleBlogUpdate }
          removeFunc={ handleBlogDelete }
          loggedUser={ user.name }
        />
      )}
    </div>
  )

  return (
    <main>
      {notification !== null && <Notification message={notification} type={type} />}
      {user === null && loginForm()}
      {user && <div>
        <p>{user.name} logged in 
          <button  className="grey" onClick={handleLogout}>Logout</button>
        </p>
        <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
          <BlogForm createBlog={ handleBlogSubmission } />
        </Togglable>
        {blogList()}
      </div>}
    </main>
  )
}

export default App