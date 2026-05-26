import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import CreatePost from '@/pages/CreatePost'

const mockGetCategories = vi.fn()
const mockGetTags = vi.fn()
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('@/services/api', () => ({
  getCategories: (...args) => mockGetCategories(...args),
  getTags: (...args) => mockGetTags(...args),
  createPost: vi.fn(),
}))

vi.mock('@/components/Logo', () => ({ default: () => <span>Logo</span> }))

const renderPage = () => render(<CreatePost />, { wrapper: MemoryRouter })

describe('CreatePost', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetCategories.mockResolvedValue({ data: [{ id: 1, name: 'Electrónica' }] })
    mockGetTags.mockResolvedValue({ data: [{ id: 1, name: 'Urgente' }] })
  })

  it('renders title and description inputs', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/sofá de dos plazas/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/describe el objeto/i)).toBeInTheDocument()
    })
  })

  it('renders the three post type options', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /donación/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /préstamo/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /intercambio/i })).toBeInTheDocument()
    })
  })

  it('shows error when categories fail to load', async () => {
    mockGetCategories.mockRejectedValueOnce(new Error('fail'))
    mockGetTags.mockRejectedValueOnce(new Error('fail'))
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/no se pudieron cargar las opciones/i)).toBeInTheDocument()
    })
  })

  it('shows validation error when submitting without a category', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByPlaceholderText(/sofá de dos plazas/i)).toBeInTheDocument())

    await userEvent.type(screen.getByPlaceholderText(/sofá de dos plazas/i), 'Mi objeto')
    await userEvent.type(screen.getByPlaceholderText(/describe el objeto/i), 'Una descripción')

    await userEvent.click(screen.getByRole('button', { name: /publicar/i }))

    await waitFor(() => {
      expect(screen.getByText(/selecciona una categoría\./i)).toBeInTheDocument()
    })
  })

  it('loads and renders category options in the select', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Electrónica' })).toBeInTheDocument()
    })
  })
})
