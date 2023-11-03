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
  const blogsQuery = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
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

  const removeMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (removedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs.filter((b) => b.id !== removedBlog.id)
      )
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
        `Added like for the blog '${updatedBlog.title}' by '${updatedBlog.author}'`
      )
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b))
      )
    },
  })

  if (blogsQuery.isLoading) {
    return <div>Loading blog info...</div>
  }

  if (blogsQuery.isError) {
    return <div>Something went wrong, please try again later...</div>
  }
  const blogs = blogsQuery.data

  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null

  const addLike = (blog) => {
    const blogToUpdate = { ...blog, likes: blog.likes + 1, user: blog.user.id }
    addLikeMutation.mutate(blogToUpdate)
  }

  const remove = (blog) => {
    console.log('deleting...')
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
    </div>
  )
}

export default Blog
