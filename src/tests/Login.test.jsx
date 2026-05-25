import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import Login from '@/features/auth/Login'

const mockNavigate = vi.fn()
const mockLogin = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}))

const renderLogin = () => render(<Login />, { wrapper: MemoryRouter })

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders email and password inputs', () => {
    renderLogin()
    expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
  })

  it('renders the submit button', () => {
    renderLogin()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('navigates to /feed on successful login', async () => {
    mockLogin.mockResolvedValueOnce({})
    renderLogin()

    await userEvent.type(screen.getByPlaceholderText('tu@email.com'), 'user@test.com')
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/feed')
    })
  })

  it('shows API error message when login fails', async () => {
    mockLogin.mockRejectedValueOnce({ response: { data: { error: 'Credenciales incorrectas' } } })
    renderLogin()

    await userEvent.type(screen.getByPlaceholderText('tu@email.com'), 'bad@test.com')
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'wrongpass')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(screen.getByText('Credenciales incorrectas')).toBeInTheDocument()
    })
  })

  it('shows fallback error when API returns no message', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Network error'))
    renderLogin()

    await userEvent.type(screen.getByPlaceholderText('tu@email.com'), 'user@test.com')
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'pass123')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(screen.getByText('Credenciales incorrectas')).toBeInTheDocument()
    })
  })

  it('disables button and shows loading text during submission', async () => {
    mockLogin.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 200)))
    renderLogin()

    await userEvent.type(screen.getByPlaceholderText('tu@email.com'), 'user@test.com')
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'pass123')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))

    const btn = screen.getByRole('button', { name: /entrando/i })
    expect(btn).toBeInTheDocument()
    expect(btn).toBeDisabled()
  })

  it('has a link to the register page', () => {
    renderLogin()
    expect(screen.getByRole('link', { name: /regístrate/i })).toBeInTheDocument()
  })

  it('has a link to the forgot password page', () => {
    renderLogin()
    expect(screen.getByRole('link', { name: /olvidaste/i })).toBeInTheDocument()
  })
})
