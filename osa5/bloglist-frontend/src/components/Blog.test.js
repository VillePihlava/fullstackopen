import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let component
  let blog
  let user
  let mockAddLike
  let mockRemoveBlog

  beforeEach(() => {
    mockAddLike = jest.fn()
    mockRemoveBlog = jest.fn()
    blog = {
      title: 'newTitle',
      author: 'newAuthor',
      url: 'newUrl',
      likes: 1,
      user: {
        username: 'root',
        name: 'Superuser',
        id: 'userid'
      },
      id: 'blogid'
    }
    user = {
      username: 'root',
      name: 'Superuser',
      id: 'userid'
    }

    component = render(
      <Blog blog={blog} addLike={mockAddLike} removeBlog={mockRemoveBlog} user={user} />
    )
  })

  test('by default renders title and author but not url and likes', () => {
    expect(component.container).toHaveTextContent(`${blog.title} ${blog.author}`)
    expect(component.container).not.toHaveTextContent(`${blog.url}`)
    expect(component.container).not.toHaveTextContent(`likes ${blog.likes}`)
  })

  test('renders title, author, url and likes when view button is pressed', () => {
    const button = component.getByText('view')
    fireEvent.click(button)
    expect(component.container).toHaveTextContent(`${blog.title} ${blog.author}`)
    expect(component.container).toHaveTextContent(`${blog.url}`)
    expect(component.container).toHaveTextContent(`likes ${blog.likes}`)
  })

  test('handles like button being pressed 2 times', () => {
    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)
    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)
    expect(mockAddLike.mock.calls).toHaveLength(2)
  })
})