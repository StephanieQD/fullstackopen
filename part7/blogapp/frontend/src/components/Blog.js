import blogService from '../services/blogs'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useMatch } from 'react-router-dom'
import { useNotify } from './NotificationContext'
import { useUserValue } from './UserContext'
import { useNavigate } from 'react-router-dom'

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
      <h2>
        &quot;{blog.title}&quot; by {blog.author}
      </h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        {blog.likes} likes <button onClick={() => addLike(blog)}>like</button>
      </div>
      <div>{blog.user && 'Added by ' + blog.user.name}</div>
      {canRemove && <button onClick={() => remove(blog)}>delete</button>}
      <h3>Comments</h3>
      {blog.comments.length === 0 && (
        <i>No comments yet, be the first to share your thoughts!</i>
      )}
      <form onSubmit={addComment}>
        <input name="comment" />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments.map((comment, i) => (
          <li key={`comment-${i}`}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}

export default Blog
