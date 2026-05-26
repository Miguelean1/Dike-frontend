import { Link, useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/context/AuthContext'

const TYPE_LABELS = {
  donation: 'Donación',
  loan: 'Préstamo',
  exchange: 'Intercambio',
}

const STATUS_CONFIG = {
  available: { label: 'Disponible', className: 'border-emerald-500 text-emerald-700 bg-emerald-50' },
  borrowed:  { label: 'Prestado',   className: 'border-orange-400 text-orange-700 bg-orange-50' },
  reserved:  { label: 'Reservado',  className: 'border-amber-400 text-amber-700 bg-amber-50' },
}

export default function Card({ anuncio }) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const { id, title = 'Sin título', description = '', image, type, status, author } = anuncio ?? {}
  const statusCfg = STATUS_CONFIG[status]

  return (
    <article className="bg-white border-2 border-stone-300 hover:border-red-600 transition-colors overflow-hidden group rounded-lg">

      <button
        type="button"
        onClick={() => navigate(`/anuncio/${id}`)}
        className="block w-full text-left"
        aria-label={`Ver ${title}`}
      >
        <div className="w-full h-48 bg-stone-100 overflow-hidden relative">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs uppercase tracking-widest">
              Sin imagen
            </div>
          )}
          {statusCfg && status !== 'available' && (
            <span className={`absolute top-2 right-2 text-[10px] uppercase tracking-wider border px-2 py-0.5 font-medium ${statusCfg.className}`}>
              {statusCfg.label}
            </span>
          )}
        </div>
      </button>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-stone-900 font-bold text-sm leading-snug line-clamp-1">
            {title}
          </h3>
          {type && (
            <Badge
              variant="outline"
              className="shrink-0 text-[10px] uppercase tracking-wider border-stone-400 text-stone-500 rounded-none"
            >
              {TYPE_LABELS[type] ?? type}
            </Badge>
          )}
        </div>

        {description ? (
          <p className="text-stone-500 text-xs leading-relaxed line-clamp-3">
            {description}
          </p>
        ) : (
          <p className="text-stone-400 text-xs italic">Sin descripción.</p>
        )}

        <div className="mt-4 flex gap-2 border-t border-stone-200 pt-4">
          <Link
            to={`/anuncio/${id}`}
            className="flex-1 text-center text-xs uppercase tracking-widest font-bold bg-stone-900 text-stone-100 py-2 hover:bg-stone-800 transition-colors"
          >
            Ver
          </Link>
          {author && user?.id !== author.id && (
            <button
              type="button"
              onClick={() => user ? navigate(`/mensajes/${author.id}`) : navigate('/login')}
              className="flex-1 text-center text-xs uppercase tracking-widest font-bold border border-stone-400 text-stone-600 py-2 hover:border-stone-900 hover:text-stone-900 transition-colors"
            >
              Contactar
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
