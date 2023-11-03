import { Link } from 'react-router-dom'
import { useUserValue } from './UserContext'

const Navigation = ({ logout }) => {
  const user = useUserValue()

  const style = {
    padding: 5,
    background: '#ddd',
  }

  return (
    <div style={style}>
      <Link style={{ padding: 5 }} to="/">
        home
      </Link>
      <Link style={{ padding: 5 }} to="/users">
        users
      </Link>
      {user.name} logged in
      <button onClick={logout}>logout</button>
    </div>
  )
}

export default Navigation
