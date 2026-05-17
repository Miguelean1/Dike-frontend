import { Link } from 'react-router-dom'
import Logo from '@/components/Logo'

export default function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
      <div className="w-full max-w-lg">

        <div className="border-t-4 border-b-4 border-stone-900 py-6 mb-8 text-center">
          <p className="text-stone-500 text-xs tracking-[0.3em] uppercase mb-4">
            Est. 2026 · Tu plataforma para compartir
          </p>
          <div className="flex justify-center mb-4">
            <Logo className="h-24" />
          </div>
          <p className="text-stone-500 text-xs tracking-[0.3em] uppercase mt-2">
            Comparte · Presta · Dona
          </p>
        </div>

        <div className="border border-stone-400 p-8 mb-8">
          <p className="text-stone-700 text-center text-sm leading-relaxed">
            Encuentra objetos que necesitas o dale una segunda vida a los tuyos.
            Sin dinero de por medio — solo personas y comunidad.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/login"
            className="py-3 bg-stone-900 text-stone-100 text-center text-sm font-bold tracking-widest uppercase hover:bg-stone-800 transition-colors"
          >
            Acceder
          </Link>
          <Link
            to="/register"
            className="py-3 border border-stone-600 text-stone-700 text-center text-sm font-bold tracking-widest uppercase hover:border-stone-900 hover:text-stone-900 transition-colors"
          >
            Registrarse
          </Link>
        </div>

        <div className="mt-8 text-center border-t border-stone-300 pt-4">
          <Link
            to="/feed"
            className="text-stone-400 text-xs tracking-widest uppercase hover:text-stone-700 transition-colors"
          >
            Explorar sin cuenta →
          </Link>
        </div>

      </div>
    </div>
  )
}
