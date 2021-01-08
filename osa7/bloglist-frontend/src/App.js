import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import NotificationMessage from './components/NotificationMessage'
import ErrorMessage from './components/ErrorMessage'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { setError } from './reducers/errorReducer'
import { createBlog, initializeBlogs, createLike, deleteBlog } from './reducers/blogReducer'
import { initializeUser, login, logout } from './reducers/userReducer'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch])

  const blogs = useSelector(state => state.blog)
  const user = useSelector(state => state.user)
  const blogFormRef = useRef()

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const returnedBlog = dispatch(createBlog(blogObject))
      dispatch(setNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, 5))
    } catch (exception) {
      dispatch(setError('blog creation failed', 5))
    }
  }

  const addLike = async (id, blogObject) => {
    try {
      const returnedBlog = dispatch(createLike(id, blogObject))
      dispatch(setNotification(`added a like to ${returnedBlog.title} by ${returnedBlog.author}`, 5))
    } catch (exception) {
      dispatch(setError('blog liking failed', 5))
    }
  }

  const removeBlog = async (id) => {
    try {
      dispatch(deleteBlog(id))
      dispatch(setNotification('blog deletion succeeded', 5))
    } catch (exception) {
      dispatch(setError('blog deletion failed', 5))
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      dispatch(login({ username, password }))

      setUsername('')
      setPassword('')
      dispatch(setNotification('login succesful', 5))
    } catch (exception) {
      dispatch(setError('wrong username or password', 5))
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    dispatch(logout())
  }

  const loginForm = () => (
    <div>
      <h1>log in to application</h1>
      <NotificationMessage />
      <ErrorMessage />
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id='username'
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id='password'
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id='login-button' type="submit">login</button>
      </form>
    </div>
  )

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  if (user === null) {
    return (loginForm())
  } else {
    return (
      <div>
        <h2>blogs</h2>
        <NotificationMessage />
        <ErrorMessage />
        <p>{user.name} logged in<button onClick={handleLogout}>logout</button></p>
        <h2>create new</h2>
        {blogForm()}
        {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
          <Blog key={blog.id} blog={blog} addLike={addLike} removeBlog={removeBlog} user={user} />
        )}
      </div>
    )
  }
}

export default App