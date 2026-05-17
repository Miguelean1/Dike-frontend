import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-lg">

        {/* Masthead */}
        <div className="border-t-4 border-b-4 border-stone-100 py-6 mb-8 text-center">
          <p className="text-stone-400 text-xs tracking-[0.3em] uppercase mb-2">
            Est. 2024 · Plataforma de préstamos y donaciones
          </p>
          <h1 className="text-8xl font-black tracking-tight text-stone-100 leading-none">
            DIKË
          </h1>
          <p className="text-stone-400 text-xs tracking-[0.3em] uppercase mt-2">
            Comparte · Presta · Dona
          </p>
        </div>

        {/* Cuerpo */}
        <div className="border border-stone-700 p-8 mb-8">
          <p className="text-stone-300 text-center text-sm leading-relaxed">
            Encuentra objetos que necesitas o dale una segunda vida a los tuyos.
            Sin dinero de por medio — solo personas y comunidad.
          </p>
        </div>

        {/* Acciones */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/login"
            className="py-3 bg-stone-100 text-neutral-950 text-center text-sm font-bold tracking-widest uppercase hover:bg-white transition-colors"
          >
            Acceder
          </Link>
          <Link
            to="/register"
            className="py-3 border border-stone-500 text-stone-300 text-center text-sm font-bold tracking-widest uppercase hover:border-stone-100 hover:text-stone-100 transition-colors"
          >
            Registrarse
          </Link>
        </div>

        {/* Pie */}
        <div className="mt-8 text-center border-t border-stone-800 pt-4">
          <Link
            to="/feed"
            className="text-stone-500 text-xs tracking-widest uppercase hover:text-stone-300 transition-colors"
          >
            Explorar sin cuenta →
          </Link>
        </div>

      </div>
    </div>
  )
}
