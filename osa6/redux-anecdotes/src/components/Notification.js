import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification ? state.notification.message : null)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  if (notification) {
    return (
      <div style={style}>
        {notification}
      </div>
    )
  } else {
    return null
  }
}

export default Notification