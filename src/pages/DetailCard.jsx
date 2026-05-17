import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getPost } from '@/services/api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const TYPE_LABELS = {
  donation: 'Donación',
  loan: 'Préstamo',
  exchange: 'Intercambio',
}

export default function DetailCard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const { data } = await getPost(id)
        if (!cancelled) setPost(data)
      } catch {
        if (!cancelled) setError('No se pudo cargar el anuncio.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-full bg-transparent flex items-center justify-center">
        <p className="text-stone-500 text-sm tracking-widest uppercase">Cargando...</p>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-full bg-transparent flex flex-col items-center justify-center gap-4 p-8">
        <p className="text-stone-700 text-sm">{error || 'Anuncio no encontrado.'}</p>
        <button
          onClick={() => navigate('/feed')}
          className="text-xs uppercase tracking-widest bg-stone-900 text-stone-100 px-6 py-2 hover:bg-stone-800 transition-colors"
        >
          Volver al tablón
        </button>
      </div>
    )
  }

  const { title, description, category, image, type, status, creation_date, author, tags = [] } = post

  return (
    <div className="min-h-full bg-transparent">
      <div className="max-w-5xl mx-auto px-4 py-8">

        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6 uppercase tracking-widest">
          <Link to="/feed" className="hover:text-stone-900 transition-colors">Tablón</Link>
          <span>/</span>
          <span className="text-stone-900 truncate">{title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <div className="border border-stone-300 overflow-hidden bg-white">
            <div className="relative w-full aspect-[4/3] bg-stone-100">
              {image ? (
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs uppercase tracking-widest">
                  Sin imagen
                </div>
              )}
              {type && (
                <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest bg-white border border-stone-300 text-stone-600 px-2 py-1">
                  {TYPE_LABELS[type] ?? type}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">

            <div className="border border-stone-300 bg-white p-6">
              <h1 className="text-2xl font-black text-stone-900 mb-3">{title}</h1>

              {category && (
                <p className="text-xs uppercase tracking-widest text-stone-500 mb-4">{category}</p>
              )}

              <p className="text-stone-700 text-sm leading-relaxed mb-6">{description}</p>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className="text-[10px] uppercase tracking-wider border-stone-400 text-stone-500 rounded-none"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="border-t border-stone-200 pt-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500 uppercase tracking-widest">Estado</span>
                  <span className="text-stone-900 font-medium capitalize">{status}</span>
                </div>
                {creation_date && (
                  <div className="flex justify-between">
                    <span className="text-stone-500 uppercase tracking-widest">Publicado</span>
                    <span className="text-stone-900">{new Date(creation_date).toLocaleDateString('es-ES')}</span>
                  </div>
                )}
              </div>

              <button className="w-full mt-6 py-3 bg-stone-900 text-stone-100 text-xs uppercase tracking-widest font-bold hover:bg-stone-800 transition-colors">
                Contactar
              </button>
            </div>

            {author && (
              <div className="border border-stone-300 bg-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-stone-300">
                    <AvatarImage src={author.profile_picture} />
                    <AvatarFallback className="bg-stone-100 text-stone-600 text-xs">
                      {author.username?.[0]?.toUpperCase() ?? 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-stone-900 font-bold text-sm">{author.username}</span>
                </div>
                <Link
                  to={`/perfil/${author.id}`}
                  className="text-xs uppercase tracking-widest border border-stone-400 text-stone-600 px-3 py-1.5 hover:border-stone-900 hover:text-stone-900 transition-colors"
                >
                  Ver perfil
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
