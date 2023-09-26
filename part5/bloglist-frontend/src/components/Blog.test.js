import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'


test('Initial render', () => {
  const blog = {
    title: 'I wish my dad was still alive',
    author: 'Mourning Stephie',
    likes: 100,
    url: 'https://fullstackopen.com/en/part5/testing_react_apps',
    user: {
      name: 'Marceline'
    }
  }

  let mockUpdateBlog = jest.fn()
  let mockDeleteBlog = jest.fn()

  const { container } = render(
    <Blog
      blog={blog}
      updateFunc={mockUpdateBlog}
      removeFunc={mockDeleteBlog}
      loggedUser="Some Guy"
    />
  )

  const div = container.querySelector('.bloglisting')
  expect(div).toHaveTextContent(
    'I wish my dad was still alive -- Mourning Stephie'
  )

  expect(div).not.toHaveTextContent(
    'Likes: 100'
  )
  expect(div).not.toHaveTextContent(
    'https://fullstackopen.com/en/part5/testing_react_apps'
  )
})