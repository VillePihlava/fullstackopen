import React from 'react'
import { useSelector } from 'react-redux'

const ErrorMessage = () => {
  const message = useSelector(state => state.error ? state.error.message : null)
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

export default ErrorMessage