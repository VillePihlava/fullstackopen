import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  switch (action.type) {
  case 'REMOVE_BLOG':
    return state.filter(blog => blog.id !== action.data.id)
  case 'ADD_LIKE':
    return state.map(blog => blog.id !== action.data.id ? blog : action.data)
  case 'CREATE_BLOG':
    return [...state, action.data]
  case 'INIT_BLOGS':
    return action.data
  default:
    return state
  }
}

export const createBlog = (newObject) => {
  return async dispatch => {
    const newBlog = await blogService.create(newObject)
    dispatch({
      type: 'CREATE_BLOG',
      data: newBlog
    })
  }
}

export const createLike = (id, blogObject) => {
  return async dispatch => {
    const newBlog = await blogService.update(id, blogObject)
    dispatch({
      type: 'ADD_LIKE',
      data: newBlog
    })
  }
}

export const deleteBlog = (id) => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch({
      type: 'REMOVE_BLOG',
      data: { id }
    })
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export default blogReducer