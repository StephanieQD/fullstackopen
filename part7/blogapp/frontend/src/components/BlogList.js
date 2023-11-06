import { useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotify } from './NotificationContext'
import blogService from '../services/blogs'
import Togglable from './Togglable'
import NewBlog from './NewBlog'
import { Link } from 'react-router-dom'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'

const TableRowsLoader = ({ rowsNum }) => {
  return [...Array(rowsNum)].map((row, index) => (
    <TableRow key={index}>
      <TableCell component="th" scope="row">
        <Skeleton animation="wave" variant="text" />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" variant="text" />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" variant="text" />
      </TableCell>
    </TableRow>
  ))
}

const BlogList = () => {
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
      <TableContainer sx={{ marginTop: 1, marginBottom: 1 }} component={Paper}>
        <Table stickyHeader aria-label="blog table">
          <TableHead>
            <TableRow>
              <TableCell>Blog Title</TableCell>
              <TableCell align="right">Likes</TableCell>
              <TableCell align="right">Author</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result.isLoading ? (
              <TableRowsLoader rowsNum={20} />
            ) : (
              queryBlogs.sort(byLikes).map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell component="th" scope="row">
                    <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                  </TableCell>
                  <TableCell align="right">{blog.likes}</TableCell>
                  <TableCell align="right">{blog.author}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default BlogList
