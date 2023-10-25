import { useNotificationValue } from './NotificationContext'

const Notification = () => {
  const notifValues = useNotificationValue()
  if (!notifValues.message) {
    return
  }

  const style = {
    color: notifValues.type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return <div style={style}>{notifValues.message}</div>
}

export default Notification
