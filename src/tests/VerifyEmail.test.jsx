import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import VerifyEmail from '@/features/auth/VerifyEmail'

const mockNavigate = vi.fn()
const mockLogin = vi.fn()
const mockVerifyEmail = vi.fn()
const mockApiGet = vi.fn()
const mockSearchParams = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => mockSearchParams(),
  }
})

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}))

vi.mock('@/services/api', () => ({
  verifyEmail: (...args) => mockVerifyEmail(...args),
  default: { get: (...args) => mockApiGet(...args) },
}))

vi.mock('@/components/Logo', () => ({ default: () => <span>Logo</span> }))

const withToken = () => mockSearchParams.mockReturnValue([new URLSearchParams('token=abc'), vi.fn()])
const withoutToken = () => mockSearchParams.mockReturnValue([new URLSearchParams(''), vi.fn()])

const renderPage = () => render(<VerifyEmail />, { wrapper: MemoryRouter })

describe('VerifyEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('shows error immediately when token is missing', () => {
    withoutToken()
    renderPage()
    expect(screen.getByText(/token no encontrado/i)).toBeInTheDocument()
  })

  it('shows loading state while verifying', () => {
    withToken()
    mockVerifyEmail.mockImplementation(() => new Promise(() => {}))
    renderPage()
    expect(screen.getByText(/verificando correo/i)).toBeInTheDocument()
  })

  it('shows success message after valid token verification', async () => {
    withToken()
    const fakeToken = `h.${btoa(JSON.stringify({ id: 1, role: 'user' }))}.s`
    mockVerifyEmail.mockResolvedValueOnce({ data: { token: fakeToken } })
    mockApiGet.mockResolvedValueOnce({ data: { username: 'testuser', profile_picture: null } })

    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/correo verificado/i)).toBeInTheDocument()
    })
  })

  it('shows error when API rejects', async () => {
    withToken()
    mockVerifyEmail.mockRejectedValueOnce({ response: { data: { error: 'Token expirado' } } })

    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Token expirado')).toBeInTheDocument()
    })
  })
})
