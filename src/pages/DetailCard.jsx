import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getPost, createRequest, updatePostStatus } from '@/services/api'
import { useAuth } from '@/context/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

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

export default function DetailCard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [requestError, setRequestError] = useState('')
  const [requestSent, setRequestSent] = useState(false)

  const [statusUpdating, setStatusUpdating] = useState(false)

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

  const handleRequest = async (e) => {
    e.preventDefault()
    setRequestError('')
    setSubmitting(true)
    try {
      const body = { post_id: Number(id), message }
      if (post.type === 'loan' && returnDate) body.return_date = returnDate
      await createRequest(body)
      setRequestSent(true)
      setShowForm(false)
    } catch (err) {
      setRequestError(err.response?.data?.error || 'Error al enviar la solicitud.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusChange = async (newStatus) => {
    setStatusUpdating(true)
    try {
      await updatePostStatus(post.id, newStatus)
      setPost((p) => ({ ...p, status: newStatus }))
    } finally {
      setStatusUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <p className="text-stone-500 text-sm tracking-widest uppercase">Cargando...</p>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center gap-4 p-8">
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
  const isOwn = user?.id === author?.id
  const statusCfg = STATUS_CONFIG[status]

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
                <img src={image} alt={title} className="w-full h-full object-cover" />
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
                    <Badge key={tag.id} variant="outline" className="text-[10px] uppercase tracking-wider border-stone-400 text-stone-500 rounded-none">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="border-t border-stone-200 pt-4 space-y-2 text-xs mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 uppercase tracking-widest">Estado</span>
                  {statusCfg && (
                    <span className={`text-[10px] uppercase tracking-wider border px-2 py-0.5 font-medium ${statusCfg.className}`}>
                      {statusCfg.label}
                    </span>
                  )}
                </div>
                {creation_date && (
                  <div className="flex justify-between">
                    <span className="text-stone-500 uppercase tracking-widest">Publicado</span>
                    <span className="text-stone-900">{new Date(creation_date).toLocaleDateString('es-ES')}</span>
                  </div>
                )}
              </div>

              {/* Owner status controls */}
              {isOwn && (
                <div className="border border-stone-200 p-3 mb-4 space-y-2">
                  <p className="text-xs uppercase tracking-widest text-stone-500">Cambiar estado</p>
                  <div className="flex gap-2 flex-wrap">
                    {(['available', 'borrowed', 'reserved']).map((s) => (
                      <button
                        key={s}
                        disabled={status === s || statusUpdating}
                        onClick={() => handleStatusChange(s)}
                        className={`text-[10px] uppercase tracking-wider border px-3 py-1.5 transition-colors disabled:opacity-40 disabled:cursor-default ${
                          status === s
                            ? `${STATUS_CONFIG[s].className} cursor-default`
                            : 'border-stone-300 text-stone-500 hover:border-stone-700 hover:text-stone-900'
                        }`}
                      >
                        {STATUS_CONFIG[s].label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {requestSent && (
                <div className="border border-stone-300 bg-stone-50 px-4 py-3 text-stone-700 text-xs text-center mb-4">
                  Solicitud enviada correctamente.
                </div>
              )}

              {!isOwn && !requestSent && status === 'available' && (
                !user ? (
                  <Link
                    to="/login"
                    className="block w-full text-center text-xs uppercase tracking-widest font-bold bg-stone-900 text-stone-100 py-3 hover:bg-stone-800 transition-colors"
                  >
                    Accede para solicitar
                  </Link>
                ) : !showForm ? (
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-full py-3 bg-stone-900 text-stone-100 text-xs uppercase tracking-widest font-bold hover:bg-stone-800 transition-colors"
                  >
                    Solicitar
                  </button>
                ) : (
                  <form onSubmit={handleRequest} className="space-y-3 border-t border-stone-200 pt-4">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Mensaje para el dueño (opcional)"
                      rows={3}
                      className="w-full bg-white border border-stone-300 text-stone-900 text-xs px-3 py-2 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-500 resize-none"
                    />
                    {type === 'loan' && (
                      <div className="space-y-1">
                        <label className="text-stone-600 text-xs uppercase tracking-widest">Fecha de devolución</label>
                        <input
                          type="date"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          required
                          className="w-full bg-white border border-stone-300 text-stone-900 text-xs px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500"
                        />
                      </div>
                    )}
                    {requestError && (
                      <p className="text-xs text-red-700 border border-red-300 bg-red-50 px-3 py-2">{requestError}</p>
                    )}
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 py-2 bg-stone-900 text-stone-100 text-xs uppercase tracking-widest font-bold hover:bg-stone-800 transition-colors disabled:opacity-50"
                      >
                        {submitting ? 'Enviando...' : 'Confirmar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="px-4 text-xs uppercase tracking-widest border border-stone-400 text-stone-600 hover:border-stone-900 hover:text-stone-900 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                )
              )}

              {!isOwn && !requestSent && status !== 'available' && (
                <div className={`text-xs text-center px-4 py-3 border font-medium uppercase tracking-widest ${statusCfg?.className}`}>
                  Este anuncio no está disponible
                </div>
              )}
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
