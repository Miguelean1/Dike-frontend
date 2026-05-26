import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import Messages from '@/pages/Messages'

const mockGetConversations = vi.fn()

vi.mock('@/services/api', () => ({
  getConversations: (...args) => mockGetConversations(...args),
}))

const renderMessages = () => render(<Messages />, { wrapper: MemoryRouter })

describe('Messages', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', () => {
    mockGetConversations.mockImplementation(() => new Promise(() => {}))
    renderMessages()
    expect(screen.getByText(/cargando/i)).toBeInTheDocument()
  })

  it('shows empty state when there are no conversations', async () => {
    mockGetConversations.mockResolvedValueOnce({ data: [] })
    renderMessages()
    await waitFor(() => {
      expect(screen.getByText(/sin conversaciones/i)).toBeInTheDocument()
    })
  })

  it('renders conversations when they exist', async () => {
    const convs = [
      {
        user: { id: 2, username: 'Alice', profile_picture: null },
        last_message: { content: 'Hola!', is_mine: false },
        unread_count: 0,
      },
    ]
    mockGetConversations.mockResolvedValueOnce({ data: convs })
    renderMessages()
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.getByText('Hola!')).toBeInTheDocument()
    })
  })
})
