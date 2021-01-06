const notificationReducer = (state = null, action) => {
    switch (action.type) {
        case 'SET_NOTIFICATION':
            if (state !== null) {
                clearTimeout(state.timeoutId)
            }
            return action.data
        case 'REMOVE_NOTIFICATION':
            return null
        default:
            return state
    }
}

export const setNotification = (message, timeInSeconds) => {
    return async dispatch => {
        const timeoutId = setTimeout(() => { dispatch(clearNotification()) }, timeInSeconds * 1000)
        dispatch({
            type: 'SET_NOTIFICATION',
            data: {
                message,
                timeoutId
            }
        })
    }
}

const clearNotification = () => {
    return {
        type: 'REMOVE_NOTIFICATION'
    }
}

export default notificationReducer