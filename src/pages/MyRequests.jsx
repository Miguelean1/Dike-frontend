import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getRequests, updateRequest, createRating } from '@/services/api'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Star, X } from 'lucide-react'

const STATUS_STYLES = {
  pending:  'border-amber-400 text-amber-700',
  accepted: 'border-green-500 text-green-700',
  rejected: 'border-red-400 text-red-600',
}

const STATUS_LABELS = {
  pending:  'Pendiente',
  accepted: 'Aceptada',
  rejected: 'Rechazada',
}

function StatusBadge({ status }) {
  return (
    <Badge variant="outline" className={`text-[10px] uppercase tracking-wider rounded-none ${STATUS_STYLES[status] ?? 'border-stone-400 text-stone-500'}`}>
      {STATUS_LABELS[status] ?? status}
    </Badge>
  )
}

function RatingForm({ req, onDone }) {
  const [score, setScore] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (score === 0) { setError('Selecciona una puntuación.'); return }
    setSubmitting(true)
    setError('')
    try {
      await createRating({
        rated_user_id: req.Post.author.id,
        post_id: req.Post.id,
        score,
        comment: comment.trim() || undefined,
      })
      onDone()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar la valoración.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 border border-stone-200 bg-stone-50 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">
          Valorar a {req.Post.author?.username}
        </p>
        <button type="button" onClick={onDone} className="text-stone-400 hover:text-stone-700">
          <X size={14} />
        </button>
      </div>

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setScore(n)}
            className="p-0.5"
          >
            <Star
              size={20}
              className={n <= (hovered || score) ? 'fill-stone-800 text-stone-800' : 'text-stone-300'}
            />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Comentario opcional..."
        rows={2}
        className="w-full bg-white border border-stone-300 text-stone-900 text-xs px-3 py-2 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-500 resize-none"
      />

      {error && <p className="text-xs text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="text-xs uppercase tracking-widest px-4 py-1.5 bg-stone-900 text-stone-100 hover:bg-stone-700 transition-colors disabled:opacity-40"
      >
        {submitting ? 'Enviando...' : 'Enviar valoración'}
      </button>
    </form>
  )
}

function RequestRow({ req, actions, ratingForm }) {
  return (
    <div className="border-b border-stone-200 last:border-0 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Link to={`/anuncio/${req.Post?.id}`} className="text-sm font-bold text-stone-900 hover:underline">
              {req.Post?.title ?? 'Anuncio'}
            </Link>
            <StatusBadge status={req.status} />
          </div>
          {req.message && (
            <p className="text-xs text-stone-500 italic">"{req.message}"</p>
          )}
          <p className="text-[10px] text-stone-400 uppercase tracking-widest">
            {new Date(req.request_date).toLocaleDateString('es-ES')}
            {req.return_date && ` · Devolver: ${new Date(req.return_date).toLocaleDateString('es-ES')}`}
          </p>
          {req.requester && (
            <Link to={`/perfil/${req.requester.id}`} className="text-xs text-stone-500 hover:text-stone-900">
              {req.requester.username}
            </Link>
          )}
        </div>
        {actions && (
          <div className="flex gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>
      {ratingForm}
    </div>
  )
}

export default function MyRequests() {
  const [sent, setSent] = useState([])
  const [received, setReceived] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [ratingOpen, setRatingOpen] = useState(null)
  const [rated, setRated] = useState(new Set())

  useEffect(() => {
    async function load() {
      try {
        const [sentRes, receivedRes] = await Promise.all([
          getRequests('sent'),
          getRequests('received'),
        ])
        setSent(sentRes.data)
        setReceived(receivedRes.data)
      } catch {
        setError('No se pudieron cargar las solicitudes.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleStatus = async (id, status, type) => {
    try {
      await updateRequest(id, status)
      const update = (list) => list.map((r) => r.id === id ? { ...r, status } : r)
      if (type === 'sent') setSent(update)
      else setReceived(update)
    } catch {}
  }

  const handleRated = (reqId) => {
    setRated((prev) => new Set([...prev, reqId]))
    setRatingOpen(null)
  }

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <p className="text-stone-500 text-sm tracking-widest uppercase">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-transparent">
      <div className="max-w-3xl mx-auto px-4 py-8">

        <div className="border-t-4 border-b border-stone-900 pb-4 mb-8">
          <p className="text-stone-500 text-xs tracking-[0.3em] uppercase mb-1">Gestión</p>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Mis solicitudes</h1>
        </div>

        {error && (
          <div className="border border-red-300 bg-red-50 px-4 py-3 text-red-700 text-sm mb-6">{error}</div>
        )}

        <Tabs defaultValue="received">
          <TabsList className="bg-transparent border-b border-stone-300 rounded-none w-full justify-start gap-0 h-auto p-0 mb-6">
            <TabsTrigger
              value="received"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-stone-900 data-[state=active]:text-stone-900 text-stone-500 text-xs uppercase tracking-widest px-4 py-2 bg-transparent shadow-none"
            >
              Recibidas {received.length > 0 && `(${received.length})`}
            </TabsTrigger>
            <TabsTrigger
              value="sent"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-stone-900 data-[state=active]:text-stone-900 text-stone-500 text-xs uppercase tracking-widest px-4 py-2 bg-transparent shadow-none"
            >
              Enviadas {sent.length > 0 && `(${sent.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received">
            <div className="border border-stone-300 bg-white p-6">
              {received.length === 0 ? (
                <p className="text-stone-400 text-xs italic text-center py-4">No has recibido solicitudes.</p>
              ) : (
                received.map((req) => (
                  <RequestRow
                    key={req.id}
                    req={req}
                    actions={req.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatus(req.id, 'accepted', 'received')}
                          className="text-xs uppercase tracking-widest px-3 py-1.5 bg-stone-900 text-stone-100 hover:bg-stone-700 transition-colors"
                        >
                          Aceptar
                        </button>
                        <button
                          onClick={() => handleStatus(req.id, 'rejected', 'received')}
                          className="text-xs uppercase tracking-widest px-3 py-1.5 border border-stone-400 text-stone-600 hover:border-red-400 hover:text-red-600 transition-colors"
                        >
                          Rechazar
                        </button>
                      </>
                    )}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="sent">
            <div className="border border-stone-300 bg-white p-6">
              {sent.length === 0 ? (
                <p className="text-stone-400 text-xs italic text-center py-4">No has enviado solicitudes.</p>
              ) : (
                sent.map((req) => (
                  <RequestRow
                    key={req.id}
                    req={req}
                    actions={
                      req.status === 'pending' ? (
                        <button
                          onClick={() => handleStatus(req.id, 'rejected', 'sent')}
                          className="text-xs uppercase tracking-widest px-3 py-1.5 border border-stone-400 text-stone-600 hover:border-red-400 hover:text-red-600 transition-colors"
                        >
                          Cancelar
                        </button>
                      ) : req.status === 'accepted' && req.Post?.author && !rated.has(req.id) && ratingOpen !== req.id ? (
                        <button
                          onClick={() => setRatingOpen(req.id)}
                          className="flex items-center gap-1.5 text-xs uppercase tracking-widest px-3 py-1.5 border border-stone-400 text-stone-600 hover:border-stone-900 hover:text-stone-900 transition-colors"
                        >
                          <Star size={12} />
                          Valorar
                        </button>
                      ) : null
                    }
                    ratingForm={
                      ratingOpen === req.id && (
                        <RatingForm
                          req={req}
                          onDone={() => handleRated(req.id)}
                        />
                      )
                    }
                  />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  )
}
