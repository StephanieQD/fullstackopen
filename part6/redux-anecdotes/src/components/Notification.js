import { useSelector } from 'react-redux'

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  const notification = useSelector(({notification}) => notification)
  return (
    <div>
    {
      (notification != null) && <div style={style}>
        {notification}
      </div>
    }
    </div>
  )
}

export default Notification