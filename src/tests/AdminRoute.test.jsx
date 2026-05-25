import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { vi, describe, it, expect } from 'vitest'
import AdminRoute from '@/components/AdminRoute'

const mockUseAuth = vi.fn()

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}))

describe('AdminRoute', () => {
  it('renders nothing while loading', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true })
    const { container } = render(
      <MemoryRouter>
        <AdminRoute><div>admin</div></AdminRoute>
      </MemoryRouter>
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('redirects to /login when unauthenticated', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false })
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<AdminRoute><div>admin</div></AdminRoute>} />
          <Route path="/login" element={<div>login page</div>} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('login page')).toBeInTheDocument()
    expect(screen.queryByText('admin')).not.toBeInTheDocument()
  })

  it('redirects to /feed when user is not admin', () => {
    mockUseAuth.mockReturnValue({ user: { id: 1, role: 'user' }, loading: false })
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<AdminRoute><div>admin content</div></AdminRoute>} />
          <Route path="/feed" element={<div>feed page</div>} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('feed page')).toBeInTheDocument()
    expect(screen.queryByText('admin content')).not.toBeInTheDocument()
  })

  it('renders children when user is admin', () => {
    mockUseAuth.mockReturnValue({ user: { id: 1, role: 'admin' }, loading: false })
    render(
      <MemoryRouter>
        <AdminRoute><div>admin content</div></AdminRoute>
      </MemoryRouter>
    )
    expect(screen.getByText('admin content')).toBeInTheDocument()
  })
})
