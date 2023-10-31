import { useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotify } from './NotificationContext'
import { useUserValue } from './UserContext'
import blogService from '../services/blogs'
import Togglable from './Togglable'
import NewBlog from './NewBlog'
import Blog from './Blog'

const BlogList = () => {
  const user = useUserValue()
  const queryClient = useQueryClient()
  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
    retry: 1,
  })

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      notifyWith(`A new blog '${newBlog.title}' by '${newBlog.author}' added`)
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
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
    },
    onError: (error) => {
      console.log('ERROR', error)
      notifyWith('Something went wrong, unable to delete blog...')
    },
  })

  const blogFormRef = useRef()

  const setNotif = useNotify()
  const notifyWith = (message, type = 'info') => {
    setNotif({
      message,
      type,
    })
  }

  const createBlog = (newBlog) => {
    newBlogMutation.mutate(newBlog)
    blogFormRef.current.toggleVisibility()
  }

  const like = (blog) => {
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

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>Something went wrong, please try again later...</div>
  }

  const queryBlogs = result.data

  const byLikes = (b1, b2) => b2.likes - b1.likes
  return (
    <>
      <Togglable buttonLabel="new note" ref={blogFormRef}>
        <NewBlog createBlog={createBlog} />
      </Togglable>
      <div>
        {queryBlogs.sort(byLikes).map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            like={() => like(blog)}
            canRemove={
              user && blog.user && blog.user.username === user.username
            }
            remove={() => remove(blog)}
          />
        ))}
      </div>
    </>
  )
}

export default BlogList
