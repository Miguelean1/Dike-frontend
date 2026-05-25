import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { resetPassword } from '@/services/api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Logo from '@/components/Logo'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirm) return setError('Las contraseñas no coinciden.')
    if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.')
    if (!token) return setError('Token inválido. Solicita un nuevo enlace.')

    setLoading(true)
    try {
      await resetPassword(token, password)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Token inválido o expirado. Solicita un nuevo enlace.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
        <div className="w-full max-w-sm text-center space-y-4">
          <div className="border border-stone-300 bg-stone-50 px-4 py-4">
            <p className="text-stone-700 text-sm leading-relaxed">
              Contraseña actualizada correctamente. Redirigiendo al acceso...
            </p>
          </div>
          <Link to="/login" className="text-xs uppercase tracking-widest text-stone-600 hover:text-stone-900 underline">
            Ir al acceso
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
      <div className="w-full max-w-sm">

        <div className="border-t-4 border-b border-stone-900 pb-4 mb-8">
          <Link to="/" className="flex justify-center">
            <Logo className="h-16" />
          </Link>
          <p className="text-center text-stone-500 text-xs tracking-[0.25em] uppercase mt-2">
            Nueva contraseña
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label className="text-stone-700 text-xs tracking-widest uppercase">
              Nueva contraseña
            </Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              className="bg-white border-stone-300 text-stone-900 placeholder:text-stone-400 focus-visible:ring-stone-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-stone-700 text-xs tracking-widest uppercase">
              Confirmar contraseña
            </Label>
            <Input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repite la contraseña"
              required
              className="bg-white border-stone-300 text-stone-900 placeholder:text-stone-400 focus-visible:ring-stone-500"
            />
          </div>

          {error && (
            <p className="text-xs text-red-700 border border-red-300 bg-red-50 px-3 py-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 text-stone-100 hover:bg-stone-800 font-bold tracking-widest uppercase text-xs rounded-none cursor-pointer"
          >
            {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
          </Button>
        </form>

      </div>
    </div>
  )
}
