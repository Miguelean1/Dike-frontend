import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import UserProfile from '@/pages/UserProfile'

const mockUseAuth = vi.fn()
const mockGetUser = vi.fn()
const mockGetUserRatings = vi.fn()
const mockCreateRating = vi.fn()
const mockGetUserPosts = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useParams: () => ({ id: '2' }) }
})

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}))

vi.mock('@/services/api', () => ({
  getUser: (...args) => mockGetUser(...args),
  getUserRatings: (...args) => mockGetUserRatings(...args),
  createRating: (...args) => mockCreateRating(...args),
  getUserPosts: (...args) => mockGetUserPosts(...args),
  updateUser: vi.fn(),
}))

const mockProfile = { id: 2, username: 'OtherUser', bio: 'Hello', profile_picture: null, registration_date: '2025-01-01' }
const asOtherUser = () => mockUseAuth.mockReturnValue({ user: { id: 1, role: 'user' }, refreshUser: vi.fn() })
const asOwner = () => mockUseAuth.mockReturnValue({ user: { id: 2, role: 'user' }, refreshUser: vi.fn() })
const asGuest = () => mockUseAuth.mockReturnValue({ user: null, refreshUser: vi.fn() })

const renderPage = () => render(<UserProfile />, { wrapper: MemoryRouter })

describe('UserProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    asOtherUser()
    mockGetUser.mockResolvedValue({ data: mockProfile })
    mockGetUserRatings.mockResolvedValue({ data: [] })
    mockGetUserPosts.mockResolvedValue({ data: [] })
  })

  it('shows loading state initially', () => {
    mockGetUser.mockImplementation(() => new Promise(() => {}))
    mockGetUserRatings.mockImplementation(() => new Promise(() => {}))
    mockGetUserPosts.mockImplementation(() => new Promise(() => {}))
    renderPage()
    expect(screen.getByText(/cargando/i)).toBeInTheDocument()
  })

  it('shows error when profile fails to load', async () => {
    mockGetUser.mockRejectedValueOnce(new Error('fail'))
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/no se pudo cargar el perfil/i)).toBeInTheDocument()
    })
  })

  it('renders profile username after loading', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getAllByText('OtherUser').length).toBeGreaterThan(0)
    })
  })

  it('shows Editar button on own profile', async () => {
    asOwner()
    renderPage()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /editar/i })).toBeInTheDocument()
    })
  })

  it('does not show Editar button on another user profile', async () => {
    renderPage()
    await waitFor(() => expect(screen.getAllByText('OtherUser').length).toBeGreaterThan(0))
    expect(screen.queryByRole('button', { name: /editar/i })).not.toBeInTheDocument()
  })

  it('shows rating form when viewing another user while authenticated', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/dejar valoración/i)).toBeInTheDocument()
    })
  })

  it('shows already-rated banner when user has already rated', async () => {
    mockGetUserRatings.mockResolvedValueOnce({ data: [{ id: 1, rating_user_id: 1, score: 4, comment: '' }] })
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/ya has valorado a este usuario/i)).toBeInTheDocument()
    })
  })

  it('hides rating form for guests', async () => {
    asGuest()
    renderPage()
    await waitFor(() => expect(screen.getAllByText('OtherUser').length).toBeGreaterThan(0))
    expect(screen.queryByText(/dejar valoración/i)).not.toBeInTheDocument()
  })

  it('shows success message after submitting a rating', async () => {
    mockCreateRating.mockResolvedValueOnce({})
    mockGetUserRatings.mockResolvedValue({ data: [] })
    renderPage()

    await waitFor(() => expect(screen.getByText(/dejar valoración/i)).toBeInTheDocument())

    const stars = screen.getAllByRole('button', { name: /puntuar con/i })
    await userEvent.click(stars[4])

    await userEvent.click(screen.getByRole('button', { name: /enviar valoración/i }))

    await waitFor(() => {
      expect(screen.getByText(/valoración enviada/i)).toBeInTheDocument()
    })
  })

  it('shows edit form fields when Editar is clicked on own profile', async () => {
    asOwner()
    renderPage()

    await waitFor(() => expect(screen.getByRole('button', { name: /editar/i })).toBeInTheDocument())
    await userEvent.click(screen.getByRole('button', { name: /editar/i }))

    await waitFor(() => {
      expect(screen.getByText(/editar perfil/i)).toBeInTheDocument()
    })
  })
})
