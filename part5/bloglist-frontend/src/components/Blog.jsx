import { useState } from 'react'
const Blog = ({ blog, updateFunc }) => {
  const [detailsVisibile, setDetailsVisibile] = useState(false)

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
      </div>}
    </div>  
  )
}

export default Blog