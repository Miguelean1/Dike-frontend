import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { Badge } from '@/components/ui/badge'

const TYPE_LABELS = {
  donation: 'Donación',
  loan: 'Préstamo',
  exchange: 'Intercambio',
}

export default function Card({ anuncio }) {
  const navigate = useNavigate()

  const { id, title = 'Sin título', description = '', image, type } = anuncio ?? {}

  return (
    <article className="bg-white border border-stone-300 hover:border-stone-500 transition-colors overflow-hidden group">

      <button
        type="button"
        onClick={() => navigate(`/anuncio/${id}`)}
        className="block w-full text-left"
        aria-label={`Ver ${title}`}
      >
        <div className="w-full h-48 bg-stone-100 overflow-hidden">
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
          <button
            type="button"
            onClick={() => Swal.fire({ title: 'Próximamente', text: 'La función de contacto está en construcción.', icon: 'info', confirmButtonColor: '#1c1917' })}
            className="flex-1 text-center text-xs uppercase tracking-widest font-bold border border-stone-400 text-stone-600 py-2 hover:border-stone-900 hover:text-stone-900 transition-colors"
          >
            Contactar
          </button>
        </div>
      </div>
    </article>
  )
}
