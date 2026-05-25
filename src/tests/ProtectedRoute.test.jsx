import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { vi, describe, it, expect } from 'vitest'
import ProtectedRoute from '@/components/ProtectedRoute'

const mockUseAuth = vi.fn()

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}))

describe('ProtectedRoute', () => {
  it('renders nothing while loading', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true })
    const { container } = render(
      <MemoryRouter>
        <ProtectedRoute><div>protected</div></ProtectedRoute>
      </MemoryRouter>
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('redirects to /login when unauthenticated', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false })
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<ProtectedRoute><div>protected</div></ProtectedRoute>} />
          <Route path="/login" element={<div>login page</div>} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('login page')).toBeInTheDocument()
    expect(screen.queryByText('protected')).not.toBeInTheDocument()
  })

  it('renders children when authenticated', () => {
    mockUseAuth.mockReturnValue({ user: { id: 1 }, loading: false })
    render(
      <MemoryRouter>
        <ProtectedRoute><div>protected content</div></ProtectedRoute>
      </MemoryRouter>
    )
    expect(screen.getByText('protected content')).toBeInTheDocument()
  })
})
