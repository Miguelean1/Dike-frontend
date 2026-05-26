import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import AdminPanel from '@/pages/AdminPanel'

const mockAdminGetUsers = vi.fn()
const mockAdminGetPosts = vi.fn()

vi.mock('@/services/api', () => ({
  adminGetUsers: (...args) => mockAdminGetUsers(...args),
  adminGetPosts: (...args) => mockAdminGetPosts(...args),
  adminUpdateUser: vi.fn(),
  adminDeleteUser: vi.fn(),
  adminUpdatePost: vi.fn(),
  adminDeletePost: vi.fn(),
}))

vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn().mockResolvedValue({ isConfirmed: false }) },
}))

const renderAdmin = () => render(<AdminPanel />, { wrapper: MemoryRouter })

describe('AdminPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAdminGetUsers.mockResolvedValue({ data: [] })
    mockAdminGetPosts.mockResolvedValue({ data: [] })
  })

  it('renders the Users and Posts tab triggers', async () => {
    renderAdmin()
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /usuarios/i })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /anuncios/i })).toBeInTheDocument()
    })
  })

  it('shows user rows when users are loaded', async () => {
    mockAdminGetUsers.mockResolvedValueOnce({
      data: [{ id: 1, username: 'admin_user', email: 'a@test.com', role: 'user', email_verified: true }],
    })
    renderAdmin()
    await waitFor(() => {
      expect(screen.getByText('admin_user')).toBeInTheDocument()
    })
  })

  it('renders posts tab content when Anuncios tab is clicked', async () => {
    mockAdminGetPosts.mockResolvedValueOnce({
      data: [{ id: 1, title: 'Mi anuncio', type: 'loan', status: 'available', author: { username: 'owner' } }],
    })
    renderAdmin()

    await waitFor(() => expect(screen.getByRole('tab', { name: /anuncios/i })).toBeInTheDocument())
    await userEvent.click(screen.getByRole('tab', { name: /anuncios/i }))

    await waitFor(() => {
      expect(screen.getByText('Mi anuncio')).toBeInTheDocument()
    })
  })

  it('shows user email in the users table', async () => {
    mockAdminGetUsers.mockResolvedValueOnce({
      data: [{ id: 1, username: 'edit_user', email: 'user@test.com', role: 'admin', email_verified: true }],
    })
    renderAdmin()

    await waitFor(() => expect(screen.getByText('edit_user')).toBeInTheDocument())
    expect(screen.getByText('user@test.com')).toBeInTheDocument()
    expect(screen.getByText('admin')).toBeInTheDocument()
  })
})
