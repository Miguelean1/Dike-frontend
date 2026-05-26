import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaInstagram, FaFacebookF, FaYoutube } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import Logo from '@/components/Logo'

const socials = [
  { icon: FaInstagram, label: 'Instagram', href: 'https://www.instagram.com' },
  { icon: FaFacebookF, label: 'Facebook', href: 'https://www.facebook.com' },
  { icon: FaYoutube, label: 'YouTube', href: 'https://www.youtube.com' },
  { icon: FaXTwitter, label: 'Twitter / X', href: 'https://www.x.com' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    try {
      await fetch('http://localhost:3002/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setSent(true)
      setEmail('')
    } catch {
      setSent(true)
    }
  }

  return (
    <footer className="bg-stone-800 border-t border-stone-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

        <div className="flex flex-col gap-3">
          {socials.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-stone-500 hover:text-stone-300 transition-colors w-fit"
            >
              <Icon size={18} />
              <span className="text-xs tracking-wide">{label}</span>
            </a>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center text-center gap-2">
          <Logo className="h-18" />
          <p className="text-stone-600 text-xs tracking-wide">
            Plataforma de préstamos y donaciones · {new Date().getFullYear()}
          </p>
          <nav className="flex items-center gap-4 mt-1">
            <Link to="/feed" className="text-stone-500 hover:text-stone-300 text-xs uppercase tracking-widest transition-colors">
              Explorar
            </Link>
            <Link to="/register" className="text-stone-500 hover:text-stone-300 text-xs uppercase tracking-widest transition-colors">
              Registrarse
            </Link>
          </nav>
        </div>

        <div className="border border-stone-800 p-4 flex flex-col gap-3">
          <p className="text-stone-300 text-xs font-semibold uppercase tracking-widest">
            Recibe recomendaciones
          </p>
          <p className="text-stone-500 text-xs leading-relaxed">
            Déjanos tu correo y te enviaremos consejos para sacarle el máximo partido a la plataforma.
          </p>
          {sent ? (
            <p className="text-stone-400 text-xs">¡Listo! Te escribiremos pronto.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                required
                className="bg-neutral-900 border border-stone-700 text-stone-200 text-xs px-3 py-2 placeholder-stone-600 focus:outline-none focus:border-stone-500 transition-colors"
              />
              <button
                type="submit"
                className="bg-stone-100 text-neutral-950 text-xs font-bold uppercase tracking-widest px-3 py-2 hover:bg-white transition-colors"
              >
                Suscribirme
              </button>
            </form>
          )}
        </div>

      </div>
    </footer>
  )
}
