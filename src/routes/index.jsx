import { createBrowserRouter } from 'react-router-dom'
import Landing from '@/features/auth/Landing'
import Login from '@/features/auth/Login'
import Register from '@/features/auth/Register'
import MainLayout from '@/layouts/MainLayout'
import Feed from '@/pages/Feed'
import DetailCard from '@/pages/DetailCard'
import CreatePost from '@/pages/CreatePost'
import ProtectedRoute from '@/components/ProtectedRoute'
import UserProfile from '@/pages/UserProfile'

export const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  {
    element: <MainLayout />,
    children: [
      { path: '/feed', element: <Feed /> },
      { path: '/anuncio/:id', element: <DetailCard /> },
      { path: '/perfil/:id', element: <UserProfile /> },
      {
        path: '/publicar',
        element: <ProtectedRoute><CreatePost /></ProtectedRoute>,
      },
    ],
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="text-center">
          <h1 className="text-6xl font-black text-stone-100 mb-4">404</h1>
          <p className="text-stone-400 mb-6 tracking-wide">Página no encontrada</p>
          <a
            href="/"
            className="text-xs uppercase tracking-widest bg-stone-100 text-neutral-950 px-6 py-3 font-bold hover:bg-white transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    ),
  },
])
