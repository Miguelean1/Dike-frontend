import { createBrowserRouter } from 'react-router-dom';
import Landing from '../features/auth/Landing';
import Login from '../features/auth/Login';
import Feed from '../pages/Feed';
import DetailCard from '../pages/DetailCard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/feed',
    element: <Feed />,
  },
  {
    path: '/anuncio/:id',
    element: <DetailCard />,
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-gray-600 mb-6">Página no encontrada</p>
          <a href="/" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Volver al inicio
          </a>
        </div>
      </div>
    ),
  },
]);
