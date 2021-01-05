import React, { useState } from 'react'
const Blog = ({ blog, addLike, removeBlog, user }) => {
  const [showAll, setShowAll] = useState(false)

  const handleLike = () => {
    const blogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      user: blog.user.id,
      likes: blog.likes + 1
    }
    addLike(blog.id, blogObject)
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlog(blog.id)
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleShowAll = () => {
    setShowAll(!showAll)
  }

  const buttonText = showAll ? 'hide' : 'view'

  return (
    <div style={blogStyle} className="blog">
      <div>{blog.title} {blog.author} <button onClick={toggleShowAll}>{buttonText}</button></div>
      {showAll ?
        <div>
          <div>{blog.url}</div>
          <div>likes {blog.likes}<button onClick={handleLike}>like</button></div>
          <div>{blog.user.name}</div>
          {blog.user.username === user.username ?
            <div><button onClick={handleRemove}>remove</button></div>
            : null}
        </div>
        : null}
    </div>
  )
}

export default Blog
