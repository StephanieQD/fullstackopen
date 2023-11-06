import blogService from '../services/blogs'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useMatch } from 'react-router-dom'
import { useNotify } from './NotificationContext'
import { useUserValue } from './UserContext'
import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material-next/Button'
import ChatIcon from '@mui/icons-material/Chat'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import DeleteIcon from '@mui/icons-material/Delete'

const Blog = () => {
  const navigate = useNavigate()
  const user = useUserValue()
  const queryClient = useQueryClient()

  const match = useMatch('/blogs/:id')

  const fetchByMatch = async () => {
    const foundBlog = await blogService.getBlogById(match.params.id)
    return foundBlog
  }

  const singleBlogQuery = useQuery({
    queryKey: ['blog'],
    queryFn: fetchByMatch,
    refetchOnWindowFocus: false,
    retry: 1,
  })

  const setNotif = useNotify()
  const notifyWith = (message, type = 'info') => {
    setNotif({
      message,
      type,
    })
  }

  const addCommentMutation = useMutation({
    mutationFn: blogService.addComment,
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(['blog'], updatedBlog)
      notifyWith('Your comment was added')
    },
    onError: (error) => {
      console.log('ERROR', error)
      notifyWith('Something went wrong, unable to add comment...')
    },
  })

  const removeMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (removedBlog) => {
      notifyWith(
        `The blog "${removedBlog.title}" by ${removedBlog.author} has been removed`
      )
      navigate('/')
    },
    onError: (error) => {
      console.log('ERROR', error)
      notifyWith('Something went wrong, unable to delete blog...')
    },
  })

  const addLikeMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: (updatedBlog) => {
      notifyWith(
        `Added like for the blog '${updatedBlog.title}' by ${updatedBlog.author}`
      )
      queryClient.setQueryData(['blog'], updatedBlog)
    },
  })

  if (singleBlogQuery.isLoading) {
    return <div>Loading blog info...</div>
  }

  if (singleBlogQuery.isError) {
    return <div>Something went wrong, please try again later...</div>
  }

  const blog = singleBlogQuery.data

  const addLike = (blog) => {
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

  if (!blog) {
    return null
  }

  const addComment = (event) => {
    event.preventDefault()
    const comment = event.target.comment.value
    event.target.comment.value = ''
    addCommentMutation.mutate({ id: blog.id, comment })
  }

  const canRemove = user && blog.user && blog.user.username === user.username

  return (
    <div>
      <Typography variant="h5">
        &quot;{blog.title}&quot; by {blog.author}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        <a href={blog.url}>{blog.url}</a>
      </Typography>
      <div>
        <Typography variant="subtitle1" gutterBottom>
          {blog.likes} likes{' '}
          <Button
            sx={{ margin: 1 }}
            variant="filledTonal"
            onClick={() => addLike(blog)}
          >
            <ThumbUpIcon />
          </Button>
        </Typography>
      </div>
      <Typography variant="body2" gutterBottom>
        {blog.user && 'Added by ' + blog.user.name}
      </Typography>
      {canRemove && (
        <Button
          sx={{ margin: 1 }}
          color="tertiary"
          variant="filled"
          onClick={() => remove(blog)}
        >
          <DeleteIcon sx={{ marginRight: 1 }} />
          delete this blog
        </Button>
      )}
      <Typography variant="h6" gutterBottom>
        Comments ({blog.comments.length})
      </Typography>
      {blog.comments.length === 0 && (
        <Typography variant="caption" gutterBottom>
          No comments yet, be the first to share your thoughts!
        </Typography>
      )}
      <form onSubmit={addComment}>
        <TextField label="comment" name="comment" />
        <br />
        <Button sx={{ margin: 1 }} variant="filledTonal" type="submit">
          <ChatIcon sx={{ marginRight: 1 }} />
          add comment
        </Button>
      </form>
      <List>
        {blog.comments.map(
          (comment, i) =>
            comment !== null &&
            comment.length > 0 && (
              <>
                <ListItem key={`comment-${i}`}>
                  <ListItemAvatar>
                    <Avatar>
                      <ChatIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={`"${comment}"`} />
                </ListItem>
                <Divider variant="inset" component="li" />
              </>
            )
        )}
      </List>
    </div>
  )
}

export default Blog
