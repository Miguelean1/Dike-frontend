import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import Navbar from '@/components/Navbar'

const mockUseAuth = vi.fn()
const mockNavigate = vi.fn()

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('@/components/Logo', () => ({ default: () => <span>Logo</span> }))

const renderNavbar = () => render(<Navbar />, { wrapper: MemoryRouter })

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows login and register links when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({ user: null, logout: vi.fn() })
    renderNavbar()
    expect(screen.getByRole('link', { name: /acceder/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /registrarse/i })).toBeInTheDocument()
  })

  it('shows Publicar link when user is authenticated', () => {
    mockUseAuth.mockReturnValue({ user: { id: 1, username: 'mike', role: 'user' }, logout: vi.fn() })
    renderNavbar()
    expect(screen.getByRole('link', { name: /publicar/i })).toBeInTheDocument()
  })

  it('shows messages link when user is authenticated', () => {
    mockUseAuth.mockReturnValue({ user: { id: 1, username: 'mike', role: 'user' }, logout: vi.fn() })
    renderNavbar()
    expect(screen.getByRole('link', { name: /mensajes/i })).toBeInTheDocument()
  })
})
