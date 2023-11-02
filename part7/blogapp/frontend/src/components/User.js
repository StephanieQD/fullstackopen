import usersService from '../services/users'
import { useQuery } from '@tanstack/react-query'
import { useMatch } from 'react-router-dom'

const User = () => {
  const match = useMatch('/users/:id')
  const userQuery = useQuery({
    queryKey: ['users'],
    queryFn: usersService.getAll,
    refetchOnWindowFocus: false,
    retry: 1,
  })

  if (userQuery.isLoading) {
    return <div>Loading user info...</div>
  }

  if (userQuery.isError) {
    return <div>Something went wrong, please try again later...</div>
  }
  const users = userQuery.data

  const user = match ? users.find((user) => user.id === match.params.id) : null

  if (!user) {
    return null
  }

  return (
    <div>
      <h2>
        {user.name} ({user.username})
      </h2>
      <p>
        <b>Added Blogs</b>
      </p>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
