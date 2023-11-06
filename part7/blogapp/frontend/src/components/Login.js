import { useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material-next/Button'
import Box from '@mui/material/Box'
import LoginIcon from '@mui/icons-material/Login'

const LoginForm = ({ login }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    await login(username, password)
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <div>
        <TextField
          sx={{ margin: 1 }}
          id="username"
          label="username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        <TextField
          sx={{ margin: 1 }}
          id="password"
          type="password"
          label="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <Button variant="filledTonal" id="login-button" type="submit">
        login <LoginIcon sx={{ marginLeft: 1 }} />
      </Button>
    </Box>
  )
}

export default LoginForm
