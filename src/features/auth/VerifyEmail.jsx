import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { verifyEmail } from '@/services/api'
import { useAuth } from '@/context/AuthContext'
import Logo from '@/components/Logo'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const navigate = useNavigate()
  const { login } = useAuth()

  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setError('Token no encontrado. El enlace puede ser inválido.')
      return
    }

    let cancelled = false

    async function verify() {
      try {
        const { data } = await verifyEmail(token)
        if (cancelled) return

        localStorage.setItem('token', data.token)
        const payload = JSON.parse(atob(data.token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
        const { default: api } = await import('@/services/api')
        const { data: profile } = await api.get(`/users/${payload.id}`)
        const userData = { id: payload.id, role: payload.role, username: profile.username, profile_picture: profile.profile_picture }
        localStorage.setItem('user', JSON.stringify(userData))

        setStatus('success')
        setTimeout(() => navigate('/feed'), 2000)
      } catch (err) {
        if (!cancelled) {
          setStatus('error')
          setError(err.response?.data?.error || 'Token inválido o expirado.')
        }
      }
    }

    verify()
    return () => { cancelled = true }
  }, [token, navigate, login])

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
      <div className="w-full max-w-sm text-center space-y-6">

        <Link to="/" className="flex justify-center">
          <Logo className="h-16" />
        </Link>

        {status === 'loading' && (
          <p className="text-stone-500 text-xs tracking-widest uppercase">Verificando correo...</p>
        )}

        {status === 'success' && (
          <div className="border border-stone-300 bg-stone-50 px-4 py-4 space-y-3">
            <p className="text-stone-700 text-sm font-bold uppercase tracking-widest">¡Correo verificado!</p>
            <p className="text-stone-500 text-xs">Redirigiendo al tablón de anuncios...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="border border-red-300 bg-red-50 px-4 py-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <Link
              to="/login"
              className="inline-block text-xs uppercase tracking-widest text-stone-600 border border-stone-400 px-4 py-2 hover:border-stone-900 hover:text-stone-900 transition-colors"
            >
              Ir al acceso
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}
