import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import ForgotPassword from '@/features/auth/ForgotPassword'

const mockForgotPassword = vi.fn()

vi.mock('@/services/api', () => ({
  forgotPassword: (...args) => mockForgotPassword(...args),
}))

const renderForgotPassword = () => render(<ForgotPassword />, { wrapper: MemoryRouter })

describe('ForgotPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders email input and submit button', () => {
    renderForgotPassword()
    expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /enviar enlace/i })).toBeInTheDocument()
  })

  it('shows success message after submitting', async () => {
    mockForgotPassword.mockResolvedValueOnce({ data: { message: 'ok' } })
    renderForgotPassword()

    await userEvent.type(screen.getByPlaceholderText('tu@email.com'), 'user@test.com')
    await userEvent.click(screen.getByRole('button', { name: /enviar enlace/i }))

    await waitFor(() => {
      expect(screen.getByText(/si existe una cuenta/i)).toBeInTheDocument()
    })
  })

  it('hides the form after successful submission', async () => {
    mockForgotPassword.mockResolvedValueOnce({ data: { message: 'ok' } })
    renderForgotPassword()

    await userEvent.type(screen.getByPlaceholderText('tu@email.com'), 'user@test.com')
    await userEvent.click(screen.getByRole('button', { name: /enviar enlace/i }))

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /enviar enlace/i })).not.toBeInTheDocument()
    })
  })

  it('shows error message when API fails', async () => {
    mockForgotPassword.mockRejectedValueOnce(new Error('Network error'))
    renderForgotPassword()

    await userEvent.type(screen.getByPlaceholderText('tu@email.com'), 'user@test.com')
    await userEvent.click(screen.getByRole('button', { name: /enviar enlace/i }))

    await waitFor(() => {
      expect(screen.getByText(/error al procesar/i)).toBeInTheDocument()
    })
  })

  it('shows loading state during submission', async () => {
    mockForgotPassword.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 200)))
    renderForgotPassword()

    await userEvent.type(screen.getByPlaceholderText('tu@email.com'), 'user@test.com')
    await userEvent.click(screen.getByRole('button', { name: /enviar enlace/i }))

    const btn = screen.getByRole('button', { name: /enviando/i })
    expect(btn).toBeInTheDocument()
    expect(btn).toBeDisabled()
  })

  it('has a link back to the login page', () => {
    renderForgotPassword()
    expect(screen.getByRole('link', { name: /volver al acceso/i })).toBeInTheDocument()
  })
})
