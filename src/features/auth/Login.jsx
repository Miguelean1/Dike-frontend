import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/feed')
    } catch (err) {
      setError(err.response?.data?.error || 'Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm">

        {/* Cabecera */}
        <div className="border-t-4 border-b border-stone-100 pb-4 mb-8">
          <Link to="/" className="block text-center">
            <span className="text-4xl font-black text-stone-100 tracking-tight">DIKË</span>
          </Link>
          <p className="text-center text-stone-400 text-xs tracking-[0.25em] uppercase mt-1">
            Acceso a la plataforma
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label className="text-stone-300 text-xs tracking-widest uppercase">
              Correo electrónico
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="bg-neutral-900 border-stone-700 text-stone-100 placeholder:text-stone-600 focus-visible:ring-stone-400"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-stone-300 text-xs tracking-widest uppercase">
              Contraseña
            </Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-neutral-900 border-stone-700 text-stone-100 placeholder:text-stone-600 focus-visible:ring-stone-400"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 border border-red-900 bg-red-950/40 px-3 py-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-100 text-neutral-950 hover:bg-white font-bold tracking-widest uppercase text-xs rounded-none cursor-pointer"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-stone-800 pt-6 space-y-2">
          <p className="text-stone-500 text-xs">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-stone-300 hover:text-stone-100 underline">
              Regístrate
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}
