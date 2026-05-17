import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getRequests, updateRequest } from '@/services/api'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

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

function RequestRow({ req, actions }) {
  return (
    <div className="border-b border-stone-200 last:border-0 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Link to={`/anuncio/${req.post?.id}`} className="text-sm font-bold text-stone-900 hover:underline">
            {req.post?.title ?? 'Anuncio'}
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
  )
}

export default function MyRequests() {
  const [sent, setSent] = useState([])
  const [received, setReceived] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
    } catch {
    }
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
                    actions={req.status === 'pending' && (
                      <button
                        onClick={() => handleStatus(req.id, 'rejected', 'sent')}
                        className="text-xs uppercase tracking-widest px-3 py-1.5 border border-stone-400 text-stone-600 hover:border-red-400 hover:text-red-600 transition-colors"
                      >
                        Cancelar
                      </button>
                    )}
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
