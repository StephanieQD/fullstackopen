import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const blogFunc = jest.fn()

  render(<BlogForm createBlog={blogFunc} />)

  const titleInput = screen.getByPlaceholderText('blog title')
  const urlInput = screen.getByPlaceholderText('blog URL')
  const authorInput = screen.getByPlaceholderText('blog author')
  const createButton = screen.getByText('create new blog')

  await userEvent.type(titleInput, 'testing a form...')
  await userEvent.type(urlInput, 'https://www.google.com/maps')
  await userEvent.type(authorInput, 'Google')
  await userEvent.click(createButton)

  expect(blogFunc.mock.calls).toHaveLength(1)
  expect(blogFunc.mock.calls[0][0].title).toBe('testing a form...')
  expect(blogFunc.mock.calls[0][0].url).toBe('https://www.google.com/maps')
  expect(blogFunc.mock.calls[0][0].author).toBe('Google')
})