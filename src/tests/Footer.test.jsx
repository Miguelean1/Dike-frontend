import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import Footer from '@/components/Footer'

vi.mock('@/components/Logo', () => ({ default: () => <span>Logo</span> }))

global.fetch = vi.fn()

const renderFooter = () => render(<Footer />, { wrapper: MemoryRouter })

describe('Footer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch.mockResolvedValue({ ok: true })
  })

  it('renders social media links', () => {
    renderFooter()
    expect(screen.getByRole('link', { name: /instagram/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /facebook/i })).toBeInTheDocument()
  })

  it('renders newsletter subscription form', () => {
    renderFooter()
    expect(screen.getByPlaceholderText('tu@correo.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /suscribirme/i })).toBeInTheDocument()
  })

  it('shows confirmation message after subscribing', async () => {
    renderFooter()
    await userEvent.type(screen.getByPlaceholderText('tu@correo.com'), 'test@test.com')
    await userEvent.click(screen.getByRole('button', { name: /suscribirme/i }))

    await waitFor(() => {
      expect(screen.getByText(/te escribiremos pronto/i)).toBeInTheDocument()
    })
  })
})
