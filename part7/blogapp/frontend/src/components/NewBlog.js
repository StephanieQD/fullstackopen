import { useState } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material-next/Button'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    await createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <Typography variant="h4" component="h4">
        Create a new blog
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          sx={{ margin: 1 }}
          id="title"
          label="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
        <TextField
          sx={{ margin: 1 }}
          id="author"
          label="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
        <TextField
          sx={{ margin: 1 }}
          id="url"
          label="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />{' '}
        <br />
        <Button sx={{ margin: '5px 0' }} type="submit" variant="filledTonal">
          create
        </Button>
      </Box>
    </div>
  )
}

export default BlogForm
