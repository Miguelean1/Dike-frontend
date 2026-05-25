import { useState } from 'react'
import { Link } from 'react-router-dom'
import { register as apiRegister } from '@/services/api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Logo from '@/components/Logo'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    try {
      await apiRegister({ email, password, username })
      setDone(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="border-t-4 border-b border-stone-900 pb-4">
            <Link to="/" className="flex justify-center">
              <Logo className="h-12" />
            </Link>
          </div>
          <div className="border border-stone-300 bg-stone-50 px-5 py-5 space-y-2">
            <p className="text-stone-800 text-sm font-bold uppercase tracking-widest">Revisa tu correo</p>
            <p className="text-stone-500 text-xs leading-relaxed">
              Hemos enviado un enlace de verificación a <span className="font-bold text-stone-700">{email}</span>. Haz clic en él para activar tu cuenta.
            </p>
          </div>
          <div className="text-center">
            <Link to="/login" className="text-xs uppercase tracking-widest text-stone-600 hover:text-stone-900 underline">
              Ya lo tengo, ir al acceso
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
      <div className="w-full max-w-sm">

        <div className="border-t-4 border-b border-stone-900 pb-4 mb-8">
          <Link to="/" className="flex justify-center">
            <Logo className="h-12" />
          </Link>
          <p className="text-center text-stone-500 text-xs tracking-[0.25em] uppercase mt-2">
            Nueva cuenta
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label className="text-stone-700 text-xs tracking-widest uppercase">
              Nombre de usuario
            </Label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="tu_nombre"
              required
              className="bg-white border-stone-300 text-stone-900 placeholder:text-stone-400 focus-visible:ring-stone-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-stone-700 text-xs tracking-widest uppercase">
              Correo electrónico
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="bg-white border-stone-300 text-stone-900 placeholder:text-stone-400 focus-visible:ring-stone-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-stone-700 text-xs tracking-widest uppercase">
              Contraseña
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
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-stone-300 pt-6">
          <p className="text-stone-500 text-xs">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-stone-800 hover:text-stone-900 underline">
              Accede
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}
