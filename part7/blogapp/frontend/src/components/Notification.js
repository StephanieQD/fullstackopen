import { useNotificationValue } from './NotificationContext'
import Alert from '@mui/material/Alert'

const Notification = () => {
  const notifValues = useNotificationValue()
  if (!notifValues.message) {
    return
  }

  return (
    <Alert sx={{ margin: 1 }} severity={notifValues.type}>
      {notifValues.message}
    </Alert>
  )
}

export default Notification
