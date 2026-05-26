import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import DetailCard from '@/pages/DetailCard'

const mockGetPost = vi.fn()
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ id: '3' }),
    useNavigate: () => mockNavigate,
  }
})

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 1 } }),
}))

vi.mock('@/services/api', () => ({
  getPost: (...args) => mockGetPost(...args),
  createRequest: vi.fn(),
  updatePostStatus: vi.fn(),
}))

const mockPost = {
  id: 3,
  title: 'Sofá en buen estado',
  description: 'Descripción del sofá',
  category: 'Muebles',
  image: null,
  type: 'donation',
  status: 'available',
  creation_date: '2025-01-01',
  user_id: 2,
  author: { id: 2, username: 'Propietario', profile_picture: null },
  tags: [],
}

const renderPage = () => render(<DetailCard />, { wrapper: MemoryRouter })

describe('DetailCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', () => {
    mockGetPost.mockImplementation(() => new Promise(() => {}))
    renderPage()
    expect(screen.getByText(/cargando/i)).toBeInTheDocument()
  })

  it('shows error message when post fails to load', async () => {
    mockGetPost.mockRejectedValueOnce(new Error('fail'))
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/no se pudo cargar el anuncio/i)).toBeInTheDocument()
    })
  })

  it('renders post title after loading', async () => {
    mockGetPost.mockResolvedValueOnce({ data: mockPost })
    renderPage()
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Sofá en buen estado' })).toBeInTheDocument()
    })
  })

  it('shows "Sin imagen" placeholder when post has no image', async () => {
    mockGetPost.mockResolvedValueOnce({ data: mockPost })
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Sin imagen')).toBeInTheDocument()
    })
  })

  it('shows request button for non-owner authenticated user', async () => {
    mockGetPost.mockResolvedValueOnce({ data: mockPost })
    renderPage()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /solicitar/i })).toBeInTheDocument()
    })
  })

  it('shows request form after clicking Solicitar', async () => {
    mockGetPost.mockResolvedValueOnce({ data: mockPost })
    renderPage()

    await waitFor(() => expect(screen.getByRole('button', { name: /solicitar/i })).toBeInTheDocument())
    await userEvent.click(screen.getByRole('button', { name: /solicitar/i }))

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/mensaje para el dueño/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /confirmar/i })).toBeInTheDocument()
    })
  })

  it('shows owner status controls when viewing own post', async () => {
    const ownPost = { ...mockPost, author: { id: 1, username: 'yo', profile_picture: null } }
    mockGetPost.mockResolvedValueOnce({ data: ownPost })
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/cambiar estado/i)).toBeInTheDocument()
    })
  })
})
