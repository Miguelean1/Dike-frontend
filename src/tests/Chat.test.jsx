import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import Chat from '@/pages/Chat'

Element.prototype.scrollIntoView = vi.fn()

const mockGetMessages = vi.fn()
const mockGetUser = vi.fn()
const mockSendMessage = vi.fn()
const mockMarkMessageRead = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useParams: () => ({ userId: '5' }) }
})

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 1 } }),
}))

vi.mock('@/services/api', () => ({
  getMessages: (...args) => mockGetMessages(...args),
  sendMessage: (...args) => mockSendMessage(...args),
  markMessageRead: (...args) => mockMarkMessageRead(...args),
  getUser: (...args) => mockGetUser(...args),
}))

const mockOther = { id: 5, username: 'Alice', profile_picture: null }

const renderChat = () => render(<Chat />, { wrapper: MemoryRouter })

describe('Chat', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    mockGetMessages.mockResolvedValue({ data: [] })
    mockGetUser.mockResolvedValue({ data: mockOther })
    mockMarkMessageRead.mockResolvedValue({})
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  it('shows loading state initially', () => {
    mockGetUser.mockImplementation(() => new Promise(() => {}))
    mockGetMessages.mockImplementation(() => new Promise(() => {}))
    renderChat()
    expect(screen.getByText(/cargando/i)).toBeInTheDocument()
  })

  it('shows other user name after loading', async () => {
    renderChat()
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument()
    })
  })

  it('shows empty conversation message when no messages', async () => {
    renderChat()
    await waitFor(() => {
      expect(screen.getByText(/empieza la conversación/i)).toBeInTheDocument()
    })
  })

  it('renders messages from the conversation', async () => {
    mockGetMessages.mockResolvedValueOnce({
      data: [
        { id: 1, sender_id: 1, content: 'Hola!', read_status: true, sent_date: new Date().toISOString() },
      ],
    })
    renderChat()
    await waitFor(() => {
      expect(screen.getByText('Hola!')).toBeInTheDocument()
    })
  })

  it('renders the message input field', async () => {
    renderChat()
    await waitFor(() => expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument())
    expect(screen.getByPlaceholderText(/escribe un mensaje/i)).toBeInTheDocument()
  })
})
