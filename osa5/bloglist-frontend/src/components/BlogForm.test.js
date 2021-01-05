import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  let component
  let mockCreateBlog

  beforeEach(() => {
    mockCreateBlog = jest.fn()

    component = render(
      <BlogForm createBlog={mockCreateBlog} />
    )
  })

  test('should submit right information when create button is pressed', () => {
    const titleField = component.container.querySelector('#title')
    const authorField = component.container.querySelector('#author')
    const urlField = component.container.querySelector('#url')
    const button = component.getByText('create')
    fireEvent.change(titleField, { target: { value: 'new title' } })
    fireEvent.change(authorField, { target: { value: 'new author' } })
    fireEvent.change(urlField, { target: { value: 'new url' } })
    fireEvent.click(button)
    expect(mockCreateBlog.mock.calls[0][0].title).toBe('new title')
    expect(mockCreateBlog.mock.calls[0][0].author).toBe('new author')
    expect(mockCreateBlog.mock.calls[0][0].url).toBe('new url')
  })
})