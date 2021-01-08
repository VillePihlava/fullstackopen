const errorReducer = (state = null, action) => {
  switch (action.type) {
  case 'SET_ERROR':
    if (state !== null) {
      clearTimeout(state.timeoutId)
    }
    return action.data
  case 'REMOVE_ERROR':
    return null
  default:
    return state
  }
}

export const setError = (message, timeInSeconds) => {
  return async dispatch => {
    const timeoutId = setTimeout(() => { dispatch(clearError()) }, timeInSeconds * 1000)
    dispatch({
      type: 'SET_ERROR',
      data: {
        message,
        timeoutId
      }
    })
  }
}

const clearError = () => {
  return {
    type: 'REMOVE_ERROR'
  }
}

export default errorReducer