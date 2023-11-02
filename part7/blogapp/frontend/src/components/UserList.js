import usersService from '../services/users'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

const UserList = () => {
  const userQuery = useQuery({
    queryKey: ['users'],
    queryFn: usersService.getAll,
    refetchOnWindowFocus: false,
    retry: 1,
  })

  if (userQuery.isLoading) {
    return <div>loading data...</div>
  }

  if (userQuery.isError) {
    return <div>Something went wrong, please try again later...</div>
  }

  const users = userQuery.data
  console.log('users', users)

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th># of blogs</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.username}</td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserList
