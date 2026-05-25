import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import Register from '@/features/auth/Register'

const mockRegister = vi.fn()

vi.mock('@/services/api', () => ({
  register: (...args) => mockRegister(...args),
}))

const renderRegister = () => render(<Register />, { wrapper: MemoryRouter })

const fillForm = async ({ username = 'usuario', email = 'user@test.com', password = 'password123', confirm = 'password123' } = {}) => {
  await userEvent.type(screen.getByPlaceholderText('tu_nombre'), username)
  await userEvent.type(screen.getByPlaceholderText('tu@email.com'), email)
  await userEvent.type(screen.getByPlaceholderText('Mínimo 6 caracteres'), password)
  await userEvent.type(screen.getByPlaceholderText('Repite la contraseña'), confirm)
}

describe('Register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all form fields', () => {
    renderRegister()
    expect(screen.getByPlaceholderText('tu_nombre')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Mínimo 6 caracteres')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Repite la contraseña')).toBeInTheDocument()
  })

  it('renders the submit button', () => {
    renderRegister()
    expect(screen.getByRole('button', { name: /crear cuenta/i })).toBeInTheDocument()
  })

  it('shows error when passwords do not match', async () => {
    renderRegister()
    await fillForm({ password: 'password123', confirm: 'different' })
    await userEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))

    expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument()
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('shows error when password is shorter than 6 characters', async () => {
    renderRegister()
    await fillForm({ password: '123', confirm: '123' })
    await userEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))

    expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument()
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('shows "check email" message after successful registration', async () => {
    mockRegister.mockResolvedValueOnce({ data: { message: 'ok' } })
    renderRegister()
    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))

    await waitFor(() => {
      expect(screen.getByText(/revisa tu correo/i)).toBeInTheDocument()
    })
  })

  it('shows the registered email in the success message', async () => {
    mockRegister.mockResolvedValueOnce({ data: { message: 'ok' } })
    renderRegister()
    await fillForm({ email: 'myemail@test.com' })
    await userEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))

    await waitFor(() => {
      expect(screen.getByText('myemail@test.com')).toBeInTheDocument()
    })
  })

  it('shows API error message on failed registration', async () => {
    mockRegister.mockRejectedValueOnce({ response: { data: { error: 'Email already in use' } } })
    renderRegister()
    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))

    await waitFor(() => {
      expect(screen.getByText('Email already in use')).toBeInTheDocument()
    })
  })

  it('does not call API if client-side validation fails', async () => {
    renderRegister()
    await fillForm({ password: 'abc', confirm: 'abc' })
    await userEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))

    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('has a link to the login page', () => {
    renderRegister()
    expect(screen.getByRole('link', { name: /accede/i })).toBeInTheDocument()
  })
})
