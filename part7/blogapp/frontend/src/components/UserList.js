import usersService from '../services/users'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

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
      <Typography variant="h4">Users</Typography>
      <TableContainer sx={{ marginTop: 1, marginBottom: 1 }} component={Paper}>
        <Table stickyHeader aria-label="blog table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Username</TableCell>
              <TableCell align="right">Blog Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <tr key={user.id}>
                <TableCell component="th" scope="row">
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </TableCell>
                <TableCell align="right">{user.username}</TableCell>
                <TableCell align="right">{user.blogs.length}</TableCell>
              </tr>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default UserList
