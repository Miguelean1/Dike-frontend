import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '@/services/api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Logo from '@/components/Logo'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await forgotPassword(email)
      setSent(true)
    } catch {
      setError('Error al procesar la solicitud. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
      <div className="w-full max-w-sm">

        <div className="border-t-4 border-b border-stone-900 pb-4 mb-8">
          <Link to="/" className="flex justify-center">
            <Logo className="h-16" />
          </Link>
          <p className="text-center text-stone-500 text-xs tracking-[0.25em] uppercase mt-2">
            Recuperar contraseña
          </p>
        </div>

        {sent ? (
          <div className="space-y-4">
            <div className="border border-stone-300 bg-stone-50 px-4 py-4">
              <p className="text-stone-700 text-sm leading-relaxed">
                Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña. Revisa también la carpeta de spam.
              </p>
            </div>
            <div className="text-center">
              <Link to="/login" className="text-xs uppercase tracking-widest text-stone-600 hover:text-stone-900 underline">
                Volver al acceso
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="text-stone-500 text-xs leading-relaxed mb-6">
              Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                {loading ? 'Enviando...' : 'Enviar enlace'}
              </Button>
            </form>

            <div className="mt-8 text-center border-t border-stone-300 pt-6">
              <Link to="/login" className="text-stone-500 text-xs hover:text-stone-900 underline">
                Volver al acceso
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  )
}
