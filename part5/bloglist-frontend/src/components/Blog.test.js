import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Test blog component', () => {
  const blog = {
    title: 'I wish my dad was still alive',
    author: 'Mourning Stephie',
    likes: 100,
    url: 'https://fullstackopen.com/en/part5/testing_react_apps',
    user: {
      name: 'Marceline'
    }
  }

  const mockFunc = jest.fn()

  /*--------------------------------------------------
   # Test initial render
   --------------------------------------------------*/
  test('Initial render', () => {
    const { container } = render(
      <Blog
        blog={blog}
        updateFunc={mockFunc}
        removeFunc={mockFunc}
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
  /*--------------------------------------------------
   # Ensure URL and likes are visible after click
   --------------------------------------------------*/
  test('Ensure URL and likes are visible after click', async () => {
    const { container } = render(
      <Blog
        blog={blog}
        updateFunc={mockFunc}
        removeFunc={mockFunc}
        loggedUser="Some Guy"
      />
    )

    const user = userEvent.setup()
    const button = container.querySelector('.vistoggle')
    await user.click(button)

    const updatedDiv = container.querySelector('.bloglisting')

    expect(updatedDiv).toHaveTextContent(
      'Likes: 100'
    )
    expect(updatedDiv).toHaveTextContent(
      'https://fullstackopen.com/en/part5/testing_react_apps'
    )
  })
})