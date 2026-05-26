import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import MyRequests from '@/pages/MyRequests'

const mockGetRequests = vi.fn()

vi.mock('@/services/api', () => ({
  getRequests: (...args) => mockGetRequests(...args),
  updateRequest: vi.fn(),
  createRating: vi.fn(),
}))

const renderPage = () => render(<MyRequests />, { wrapper: MemoryRouter })

describe('MyRequests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', () => {
    mockGetRequests.mockImplementation(() => new Promise(() => {}))
    renderPage()
    expect(screen.getByText(/cargando/i)).toBeInTheDocument()
  })

  it('renders Recibidas and Enviadas tabs after loading', async () => {
    mockGetRequests.mockResolvedValue({ data: [] })
    renderPage()
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /recibidas/i })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /enviadas/i })).toBeInTheDocument()
    })
  })

  it('shows error when API fails', async () => {
    mockGetRequests.mockRejectedValue(new Error('fail'))
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/no se pudieron cargar las solicitudes/i)).toBeInTheDocument()
    })
  })

  it('shows empty received state message', async () => {
    mockGetRequests.mockResolvedValue({ data: [] })
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/no has recibido solicitudes/i)).toBeInTheDocument()
    })
  })
})
