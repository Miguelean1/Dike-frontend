import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import ResetPassword from '@/features/auth/ResetPassword'

const mockNavigate = vi.fn()
const mockResetPassword = vi.fn()
const mockSearchParams = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => mockSearchParams(),
  }
})

vi.mock('@/services/api', () => ({
  resetPassword: (...args) => mockResetPassword(...args),
}))

vi.mock('@/components/Logo', () => ({ default: () => <span>Logo</span> }))

const withToken = () => mockSearchParams.mockReturnValue([new URLSearchParams('token=abc123'), vi.fn()])
const withoutToken = () => mockSearchParams.mockReturnValue([new URLSearchParams(''), vi.fn()])

const renderPage = () => render(<ResetPassword />, { wrapper: MemoryRouter })

const fillForm = async (password = 'newpass1', confirm = 'newpass1') => {
  await userEvent.type(screen.getByPlaceholderText('Mínimo 6 caracteres'), password)
  await userEvent.type(screen.getByPlaceholderText('Repite la contraseña'), confirm)
}

describe('ResetPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    withToken()
  })

  it('renders password inputs and submit button', () => {
    renderPage()
    expect(screen.getByPlaceholderText('Mínimo 6 caracteres')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Repite la contraseña')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /guardar nueva contraseña/i })).toBeInTheDocument()
  })

  it('shows error when passwords do not match', async () => {
    renderPage()
    await fillForm('password1', 'different')
    await userEvent.click(screen.getByRole('button', { name: /guardar nueva contraseña/i }))
    expect(screen.getByText('Las contraseñas no coinciden.')).toBeInTheDocument()
    expect(mockResetPassword).not.toHaveBeenCalled()
  })

  it('shows error when password is too short', async () => {
    renderPage()
    await fillForm('abc', 'abc')
    await userEvent.click(screen.getByRole('button', { name: /guardar nueva contraseña/i }))
    expect(screen.getByText('La contraseña debe tener al menos 6 caracteres.')).toBeInTheDocument()
    expect(mockResetPassword).not.toHaveBeenCalled()
  })

  it('shows error when token is missing', async () => {
    withoutToken()
    renderPage()
    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: /guardar nueva contraseña/i }))
    expect(screen.getByText(/token inválido/i)).toBeInTheDocument()
    expect(mockResetPassword).not.toHaveBeenCalled()
  })

  it('shows success message after password is updated', async () => {
    mockResetPassword.mockResolvedValueOnce({})
    renderPage()
    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: /guardar nueva contraseña/i }))
    await waitFor(() => {
      expect(screen.getByText(/contraseña actualizada correctamente/i)).toBeInTheDocument()
    })
  })

  it('shows API error message on failure', async () => {
    mockResetPassword.mockRejectedValueOnce({ response: { data: { error: 'Token expirado' } } })
    renderPage()
    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: /guardar nueva contraseña/i }))
    await waitFor(() => {
      expect(screen.getByText('Token expirado')).toBeInTheDocument()
    })
  })
})
