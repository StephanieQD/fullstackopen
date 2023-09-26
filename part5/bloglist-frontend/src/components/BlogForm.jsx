import { useState } from 'react'
const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const submitBlog = (event) => {
    event.preventDefault()
    createBlog({ author, url, title })
    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return (
    <form onSubmit={submitBlog}>
      <div>
        <label>
          Title
          <input
            placeholder="blog title"
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
            placeholder="blog author"
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
            placeholder="blog URL"
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
}

export default BlogForm