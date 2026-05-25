import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import Feed from '@/pages/Feed'

const mockGetPosts = vi.fn()

vi.mock('@/services/api', () => ({
  getPosts: (...args) => mockGetPosts(...args),
}))

vi.mock('@/components/Card', () => ({
  default: ({ anuncio }) => <div data-testid="card">{anuncio.title}</div>,
}))

const makePosts = (n) =>
  Array.from({ length: n }, (_, i) => ({ id: i + 1, title: `Post ${i + 1}`, description: `Desc ${i + 1}` }))

const renderFeed = () => render(<Feed />, { wrapper: MemoryRouter })

describe('Feed', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', () => {
    mockGetPosts.mockImplementation(() => new Promise(() => {}))
    renderFeed()
    expect(screen.getByText(/cargando/i)).toBeInTheDocument()
  })

  it('renders posts after loading', async () => {
    mockGetPosts.mockResolvedValueOnce({ data: { posts: makePosts(3), total: 3, page: 1, totalPages: 1 } })
    renderFeed()
    await waitFor(() => {
      expect(screen.getAllByTestId('card')).toHaveLength(3)
    })
  })

  it('shows empty state when no posts exist', async () => {
    mockGetPosts.mockResolvedValueOnce({ data: { posts: [], total: 0, page: 1, totalPages: 1 } })
    renderFeed()
    await waitFor(() => {
      expect(screen.getByText('No hay anuncios disponibles.')).toBeInTheDocument()
    })
  })

  it('shows error message when API fails', async () => {
    mockGetPosts.mockRejectedValueOnce(new Error('Network error'))
    renderFeed()
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })
  })

  it('renders the four type filter buttons', () => {
    mockGetPosts.mockImplementation(() => new Promise(() => {}))
    renderFeed()
    expect(screen.getByRole('button', { name: /todos/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /donaciones/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /préstamos/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /intercambios/i })).toBeInTheDocument()
  })

  it('filters posts client-side by search query', async () => {
    const posts = [
      { id: 1, title: 'Bicicleta vieja', description: '' },
      { id: 2, title: 'Libro de cocina', description: '' },
    ]
    mockGetPosts.mockResolvedValueOnce({ data: { posts, total: 2, page: 1, totalPages: 1 } })
    renderFeed()

    await waitFor(() => expect(screen.getAllByTestId('card')).toHaveLength(2))

    await userEvent.type(screen.getByPlaceholderText('Buscar anuncios...'), 'bicicleta')

    expect(screen.getAllByTestId('card')).toHaveLength(1)
    expect(screen.getByText('Bicicleta vieja')).toBeInTheDocument()
  })

  it('shows "no results" message when search has no matches', async () => {
    mockGetPosts.mockResolvedValueOnce({ data: { posts: makePosts(2), total: 2, page: 1, totalPages: 1 } })
    renderFeed()

    await waitFor(() => expect(screen.getAllByTestId('card')).toHaveLength(2))

    await userEvent.type(screen.getByPlaceholderText('Buscar anuncios...'), 'xyz')

    expect(screen.getByText(/no hay resultados para/i)).toBeInTheDocument()
  })

  it('hides pagination when totalPages is 1', async () => {
    mockGetPosts.mockResolvedValueOnce({ data: { posts: makePosts(3), total: 3, page: 1, totalPages: 1 } })
    renderFeed()
    await waitFor(() => expect(screen.getAllByTestId('card')).toHaveLength(3))

    expect(screen.queryByRole('button', { name: /anterior/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /siguiente/i })).not.toBeInTheDocument()
  })

  it('shows pagination controls when totalPages is greater than 1', async () => {
    mockGetPosts.mockResolvedValue({ data: { posts: makePosts(12), total: 24, page: 1, totalPages: 2 } })
    renderFeed()
    await waitFor(() => expect(screen.getByRole('button', { name: /anterior/i })).toBeInTheDocument())

    expect(screen.getByRole('button', { name: /siguiente/i })).toBeInTheDocument()
  })

  it('disables Anterior on page 1 and Siguiente on last page', async () => {
    mockGetPosts.mockResolvedValue({ data: { posts: makePosts(12), total: 24, page: 1, totalPages: 2 } })
    renderFeed()
    await waitFor(() => expect(screen.getByRole('button', { name: /anterior/i })).toBeInTheDocument())

    expect(screen.getByRole('button', { name: /anterior/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /siguiente/i })).not.toBeDisabled()
  })
})
