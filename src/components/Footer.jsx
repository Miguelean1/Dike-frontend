import { Link } from 'react-router-dom'
import Logo from '@/components/Logo'

export default function Footer() {
  return (
    <footer className="bg-neutral-950 border-t border-stone-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <Logo className="h-6" />
        <p className="text-stone-600 text-xs tracking-wide">
          Plataforma de préstamos y donaciones · {new Date().getFullYear()}
        </p>
        <nav className="flex items-center gap-4">
          <Link to="/feed" className="text-stone-500 hover:text-stone-300 text-xs uppercase tracking-widest transition-colors">
            Explorar
          </Link>
          <Link to="/register" className="text-stone-500 hover:text-stone-300 text-xs uppercase tracking-widest transition-colors">
            Registrarse
          </Link>
        </nav>
      </div>
    </footer>
  )
}
