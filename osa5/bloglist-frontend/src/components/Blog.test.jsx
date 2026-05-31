import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom'
import Blog from './Blog'

describe('Blog component', () => {
  it('renders title and author by default', () => {
    const blog = {
      id: '1',
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'https://example.com',
      likes: 5,
      user: {
        id: 'user1',
        name: 'John Doe',
      },
    }

    const user = {
      id: 'user2',
      name: 'Current User',
    }

    const mockOnUpdate = () => {}
    const mockOnRemove = () => {}
    render(
      <Blog blog={blog} user={user} onUpdate={mockOnUpdate} onRemove={mockOnRemove} />
    )

    // Check that title and author are rendered
    expect(screen.getByText(/Test Blog Title/)).toBeInTheDocument()
    expect(screen.getByText(/Test Author/)).toBeInTheDocument()
  })

  it('does not render url and likes by default', () => {
    const blog = {
      id: '1',
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'https://example.com',
      likes: 5,
      user: {
        id: 'user1',
        name: 'John Doe',
      },
    }

    const user = {
      id: 'user2',
      name: 'Current User',
    }

    const mockOnUpdate = () => {}
    const mockOnRemove = () => {}
    render(
      <Blog blog={blog} user={user} onUpdate={mockOnUpdate} onRemove={mockOnRemove} />
    )

    // Check that url is not rendered
    expect(screen.queryByText(/https:\/\/example.com/)).not.toBeInTheDocument()
    
    // Check that likes count is not rendered
    expect(screen.queryByText(/likes:/)).not.toBeInTheDocument()
  })

  it('renders url, likes, and user when view button is clicked', async () => {
    const blog = {
      id: '1',
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'https://example.com',
      likes: 5,
      user: {
        id: 'user1',
        name: 'John Doe',
      },
    }

    const user = {
      id: 'user2',
      name: 'Current User',
    }

    const mockOnUpdate = () => {}
    const mockOnRemove = () => {}
    render(
      <Blog blog={blog} user={user} onUpdate={mockOnUpdate} onRemove={mockOnRemove} />
    )

    // Find and click the view button
    const viewButton = screen.getByRole('button', { name: /view/ })
    await userEvent.click(viewButton)

    // Check that url is now rendered
    expect(screen.getByText(/https:\/\/example.com/)).toBeInTheDocument()

    // Check that likes count is now rendered
    expect(screen.getByText(/likes: 5/)).toBeInTheDocument()

    // Check that user name is now rendered
    expect(screen.getByText('added by John Doe')).toBeInTheDocument()
  })
})
