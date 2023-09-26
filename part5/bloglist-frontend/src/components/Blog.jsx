import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateFunc, removeFunc, loggedUser }) => {
  const [detailsVisibile, setDetailsVisibile] = useState(false)

  let showDelete = false

  if (blog.user && blog.user.name && blog.user.name === loggedUser) {
    showDelete = true
  }
  const incrementLike = () => {
    let updatedBlog = {
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
      id: blog.id
    }

    if (blog.user && blog.user.id) {
      updatedBlog.user = blog.user.id
    }

    updateFunc(updatedBlog)
  }

  const removeBlog = () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      removeFunc(blog)
      console.log(`Removing blog "${blog.title}" by ${blog.author}...`)
    }
  }
  return (
    <div className="bloglisting">
      {blog.title} -- {blog.author}
      <button className="vistoggle" onClick={() => setDetailsVisibile( ! detailsVisibile ) }>
        { detailsVisibile ? 'hide' : 'show' }
      </button>
      {detailsVisibile && <div>
        <a target="_blank" rel="noreferrer" href={blog.url}>{blog.url}</a> <br />
        Likes: {blog.likes}
        <button className="likebtn" onClick={incrementLike} >like</button> <br />
        {(blog.user && blog.user.name ) && blog.user.name }
        {showDelete && <button onClick={removeBlog} className='remove'>Delete Blog</button>}
      </div>}
    </div>
  )
}

Blog.propTypes  = {
  blog: PropTypes.object.isRequired,
  updateFunc: PropTypes.func.isRequired,
  removeFunc: PropTypes.func.isRequired,
  loggedUser: PropTypes.string.isRequired
}

export default Blog