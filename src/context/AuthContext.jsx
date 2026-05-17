import { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin, register as apiRegister, getUser } from '@/services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
    setLoading(false)
  }, [])

  const saveUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const login = async (email, password) => {
    const { data } = await apiLogin({ email, password })
    localStorage.setItem('token', data.token)
    const { id, role } = parseJwt(data.token)
    const { data: profile } = await getUser(id)
    const userData = { id, role, username: profile.username, profile_picture: profile.profile_picture }
    saveUser(userData)
    return userData
  }

  const register = async (email, password, username) => {
    const { data } = await apiRegister({ email, password, username })
    localStorage.setItem('token', data.token)
    const { id, role } = parseJwt(data.token)
    const { data: profile } = await getUser(id)
    const userData = { id, role, username: profile.username, profile_picture: profile.profile_picture }
    saveUser(userData)
    return userData
  }

  const refreshUser = async () => {
    if (!user?.id) return
    const { data: profile } = await getUser(user.id)
    const userData = { ...user, username: profile.username, profile_picture: profile.profile_picture }
    saveUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

function parseJwt(token) {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(atob(base64))
}
