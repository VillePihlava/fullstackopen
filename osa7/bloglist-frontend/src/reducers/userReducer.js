import loginService from '../services/login'
import blogService from '../services/blogs'

const userReducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_USER':
    return action.data
  case 'LOGIN':
    return action.data
  case 'LOGOUT':
    return null
  default:
    return state
  }
}

export const login = (credentials) => {
  return async dispatch => {
    const user = await loginService.login(credentials)
    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
    blogService.setToken(user.token)
    dispatch({
      type: 'LOGIN',
      data: user
    })
  }
}

export const logout = () => {
  window.localStorage.removeItem('loggedBlogappUser')
  blogService.setToken(null)
  return {
    type: 'LOGOUT'
  }
}

export const initializeUser = () => {
  const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON)
    blogService.setToken(user.token)
    return async dispatch => {
      dispatch({
        type: 'INIT_USER',
        data: user
      })
    }
  } else {
    return async dispatch => {
      dispatch({
        type: 'INIT_USER',
        data: { user: null }
      })
    }
  }
}

export default userReducer