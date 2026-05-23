import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, LogOut, Plus, MessageSquare, ClipboardList, ShieldCheck } from 'lucide-react'
import Logo from '@/components/Logo'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-200 border-b border-neutral-300">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        <Link to="/feed" className="shrink-0">
          <Logo className="h-14" />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/feed"
            className="text-stone-500 hover:text-stone-900 text-xs tracking-widest uppercase transition-colors"
          >
            Explorar
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/publicar"
                className="hidden sm:flex items-center gap-1.5 text-xs tracking-widest uppercase text-stone-500 hover:text-stone-900 transition-colors"
              >
                <Plus size={14} />
                Publicar
              </Link>

              <Link
                to="/mensajes"
                className="text-stone-500 hover:text-stone-900 transition-colors"
                aria-label="Mensajes"
              >
                <MessageSquare size={18} />
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none">
                    <Avatar className="h-8 w-8 border border-stone-300 cursor-pointer hover:border-stone-600 transition-colors">
                      <AvatarImage src={user.profile_picture} />
                      <AvatarFallback className="bg-neutral-300 text-stone-700 text-xs">
                        {user.username?.[0]?.toUpperCase() ?? 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-neutral-900 border-stone-700 text-stone-200 min-w-40"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      to={`/perfil/${user.id}`}
                      className="flex items-center gap-2 cursor-pointer focus:bg-neutral-800 focus:text-stone-100"
                    >
                      <User size={14} />
                      Mi perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/mis-solicitudes"
                      className="flex items-center gap-2 cursor-pointer focus:bg-neutral-800 focus:text-stone-100"
                    >
                      <ClipboardList size={14} />
                      Mis solicitudes
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator className="bg-stone-800" />
                      <DropdownMenuItem asChild>
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 cursor-pointer focus:bg-neutral-800 focus:text-stone-100"
                        >
                          <ShieldCheck size={14} />
                          Panel admin
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-stone-800" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 cursor-pointer text-red-400 focus:bg-neutral-800 focus:text-red-300"
                  >
                    <LogOut size={14} />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-xs tracking-widest uppercase text-stone-600 hover:text-stone-900 transition-colors"
              >
                Acceder
              </Link>
              <Link
                to="/register"
                className="text-xs tracking-widest uppercase bg-neutral-800 text-stone-100 px-3 py-1.5 hover:bg-neutral-700 transition-colors font-bold"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
