import { useState } from 'react'
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
      <button onClick={() => setDetailsVisibile( ! detailsVisibile ) }> 
        { detailsVisibile ? 'hide' : 'show' }
      </button>
      {detailsVisibile && <div>
        <a target="_blank" href={blog.url}>{blog.url}</a> <br />
        Likes: {blog.likes}
        <button onClick={incrementLike} >like</button> <br />
        {(blog.user && blog.user.name ) && blog.user.name }
        {showDelete && <button onClick={removeBlog} className='remove'>Delete Blog</button>}
      </div>}
    </div>  
  )
}

export default Blog