import { Link } from 'react-router-dom'
import { useUserValue } from './UserContext'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'

const Navigation = ({ logout }) => {
  const user = useUserValue()

  return (
    <AppBar
      sx={{ bgcolor: '#3f50b5', marginBottom: 2 }}
      position="sticky"
      component="nav"
    >
      <Container>
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            home
          </Button>
          <Button color="inherit" component={Link} to="/users">
            users
          </Button>
          <Typography> -- {user.name} logged in</Typography>
          <Button
            sx={{ marginLeft: 1 }}
            variant="outlined"
            color="inherit"
            onClick={logout}
          >
            logout
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navigation
