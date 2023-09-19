const Notification = ({ message, type = 'good' }) => (
  <div className={`notification ${type}`}>
    {message}
  </div>  
)

export default Notification