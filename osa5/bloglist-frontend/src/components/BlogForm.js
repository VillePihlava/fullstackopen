import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleNewTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleNewAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleNewUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }
    createBlog(blogObject)
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    < form onSubmit={addBlog} >
      <div>title:<input id='title' value={newTitle} onChange={handleNewTitleChange} /></div>
      <div>author:<input id='author' value={newAuthor} onChange={handleNewAuthorChange} /></div>
      <div>url:<input id='url' value={newUrl} onChange={handleNewUrlChange} /></div>
      <button id='create-blog-button' type="submit">create</button>
    </form >
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm