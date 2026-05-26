import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect } from 'vitest'
import Card from '@/components/Card'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => vi.fn() }
})

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 99 } }),
}))

const author = { id: 1, username: 'OtherUser' }
const renderCard = (anuncio) => render(<Card anuncio={anuncio} />, { wrapper: MemoryRouter })

describe('Card', () => {
  it('renders the post title', () => {
    renderCard({ id: 1, title: 'Mi bicicleta', description: 'En buen estado', type: 'loan', status: 'available', author })
    expect(screen.getByText('Mi bicicleta')).toBeInTheDocument()
  })

  it('shows "Sin imagen" when no image is provided', () => {
    renderCard({ id: 1, title: 'Test', description: '', type: 'donation', status: 'available', author })
    expect(screen.getByText('Sin imagen')).toBeInTheDocument()
  })

  it('renders an img element when image is provided', () => {
    renderCard({ id: 1, title: 'Test', image: 'http://example.com/img.jpg', type: 'exchange', status: 'available', author })
    expect(screen.getByRole('img', { name: 'Test' })).toBeInTheDocument()
  })

  it('shows "Ver" and "Contactar" action buttons', () => {
    renderCard({ id: 1, title: 'Test', description: '', type: 'loan', status: 'available', author })
    expect(screen.getByRole('link', { name: /ver/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /contactar/i })).toBeInTheDocument()
  })
})
