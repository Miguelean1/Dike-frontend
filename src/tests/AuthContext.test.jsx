import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { AuthProvider, useAuth } from '@/context/AuthContext'

const mockApiLogin = vi.fn()
const mockGetUser = vi.fn()

vi.mock('@/services/api', () => ({
  login: (...args) => mockApiLogin(...args),
  getUser: (...args) => mockGetUser(...args),
  register: vi.fn(),
}))

function Consumer() {
  const { user, loading, login, logout } = useAuth()
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user?.username ?? 'none'}</span>
      <button onClick={() => login('test@test.com', 'pass')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('starts loading then resolves to false', async () => {
    render(<AuthProvider><Consumer /></AuthProvider>)
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })
  })

  it('restores user from localStorage on mount', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 1, username: 'stored', role: 'user' }))
    render(<AuthProvider><Consumer /></AuthProvider>)
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('stored')
    })
  })

  it('login sets user after fetching profile', async () => {
    const fakeToken = `h.${btoa(JSON.stringify({ id: 1, role: 'user' }))}.s`
    mockApiLogin.mockResolvedValueOnce({ data: { token: fakeToken } })
    mockGetUser.mockResolvedValueOnce({ data: { username: 'fetchedUser', profile_picture: null } })

    render(<AuthProvider><Consumer /></AuthProvider>)
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'))

    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('fetchedUser')
    })
    expect(localStorage.getItem('token')).toBe(fakeToken)
  })

  it('logout clears user and localStorage', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 1, username: 'stored', role: 'user' }))
    render(<AuthProvider><Consumer /></AuthProvider>)
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('stored'))

    await userEvent.click(screen.getByRole('button', { name: 'Logout' }))

    expect(screen.getByTestId('user').textContent).toBe('none')
    expect(localStorage.getItem('user')).toBeNull()
  })

  it('useAuth throws when used outside AuthProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Consumer />)).toThrow('useAuth must be used inside AuthProvider')
    spy.mockRestore()
  })
})
