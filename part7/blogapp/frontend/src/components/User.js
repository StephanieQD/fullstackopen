import usersService from '../services/users'
import { useQuery } from '@tanstack/react-query'
import { useMatch } from 'react-router-dom'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import BookIcon from '@mui/icons-material/Book'
import ListItemButton from '@mui/material/ListItemButton'
import { Link } from 'react-router-dom'
import Typography from '@mui/material/Typography'

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
      <Typography variant="h4">
        {user.name} ({user.username})
      </Typography>
      <Typography variant="h5">Added Blogs</Typography>
      <List>
        {user.blogs.map((blog) => (
          <ListItem key={blog.id}>
            <ListItemButton component={Link} to={`/blogs/${blog.id}`}>
              <ListItemAvatar>
                <Avatar>
                  <BookIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={`"${blog.title}"`} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default User
