import { useState } from 'react'
const Blog = ({ blog }) => {
  const [detailsVisibile, setDetailsVisibile] = useState(false)
  return (
    <div className="bloglisting">
      {blog.title} -- {blog.author}
      <button onClick={() => setDetailsVisibile( ! detailsVisibile ) }> 
        { detailsVisibile ? 'hide' : 'show' }
      </button>
      {detailsVisibile && <div>
        <a target="_blank" href={blog.url}>{blog.url}</a> <br />
        Likes: {blog.likes} <button>like</button> <br />
        {(blog.user && blog.user.name ) && blog.user.name }
      </div>}
    </div>  
  )
}

export default Blog