import React from 'react'
import { useSelector } from 'react-redux'

const NotificationMessage = () => {
  const message = useSelector(state => state.notification ? state.notification.message : null)
  if (message === null) {
    return null
  }

  return (
    <div className="notification">
      {message}
    </div>
  )
}

export default NotificationMessage