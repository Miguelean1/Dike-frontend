import { useEffect, useMemo, useState } from 'react'
import Card from '@/components/Card'
import { Input } from '@/components/ui/input'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { getPosts } from '@/services/api'

const TYPE_FILTERS = [
  { value: null, label: 'Todos' },
  { value: 'donation', label: 'Donaciones' },
  { value: 'loan', label: 'Préstamos' },
  { value: 'exchange', label: 'Intercambios' },
]

const LIMIT = 12

export default function Feed() {
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState(null)
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState({ loading: true, error: '' })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setStatus({ loading: true, error: '' })
        const params = { status: 'available', page, limit: LIMIT }
        if (typeFilter) params.type = typeFilter
        const { data } = await getPosts(params)
        if (!cancelled) {
          setItems(Array.isArray(data.posts) ? data.posts : [])
          setTotalPages(data.totalPages ?? 1)
          setTotal(data.total ?? 0)
        }
      } catch (e) {
        if (!cancelled) setStatus({ loading: false, error: e.message ?? 'Error al cargar los anuncios' })
        return
      } finally {
        if (!cancelled) setStatus((s) => ({ ...s, loading: false }))
      }
    }

    load()
    return () => { cancelled = true }
  }, [typeFilter, page])

  const handleTypeFilter = (value) => {
    setTypeFilter(value)
    setPage(1)
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((a) =>
      (a.title ?? '').toLowerCase().includes(q) ||
      (a.description ?? '').toLowerCase().includes(q)
    )
  }, [items, query])

  return (
    <div className="min-h-full bg-transparent">
      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="border-b border-stone-400 pb-6 mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-stone-500 text-xs tracking-[0.3em] uppercase mb-1">
                Anuncios · Última edición
              </p>
              <h2 className="text-2xl font-black text-stone-900 tracking-tight">
                Tablón de anuncios
              </h2>
            </div>

            <div className="relative w-full sm:w-72">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar anuncios..."
                className="pl-8 bg-white border-stone-300 text-stone-900 placeholder:text-stone-400 focus-visible:ring-stone-500 rounded-none"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4 flex-wrap">
            {TYPE_FILTERS.map(({ value, label }) => (
              <button
                key={label}
                onClick={() => handleTypeFilter(value)}
                className={`text-xs uppercase tracking-widest px-3 py-1.5 border transition-colors ${
                  typeFilter === value
                    ? 'bg-stone-900 text-stone-100 border-stone-900'
                    : 'bg-transparent text-stone-600 border-stone-400 hover:border-stone-900 hover:text-stone-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {status.loading && (
          <div className="py-16 text-center text-stone-500 text-sm tracking-widest uppercase">
            Cargando...
          </div>
        )}

        {!status.loading && status.error && (
          <div className="border border-red-300 bg-red-50 px-4 py-3 text-red-700 text-sm">
            {status.error}
          </div>
        )}

        {!status.loading && !status.error && filtered.length === 0 && (
          <div className="py-16 text-center text-stone-500 text-sm">
            {query ? `No hay resultados para "${query}".` : 'No hay anuncios disponibles.'}
          </div>
        )}

        {!status.loading && !status.error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((anuncio) => (
              <Card key={anuncio.id} anuncio={anuncio} />
            ))}
          </div>
        )}

        {!status.loading && !status.error && totalPages > 1 && (
          <div className="flex items-center justify-between mt-10 border-t border-stone-300 pt-6">
            <p className="text-xs text-stone-500 uppercase tracking-widest">
              {total} anuncios · página {page} de {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 text-xs uppercase tracking-widest px-3 py-1.5 border border-stone-400 text-stone-600 hover:border-stone-900 hover:text-stone-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={13} />
                Anterior
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 text-xs uppercase tracking-widest px-3 py-1.5 border border-stone-400 text-stone-600 hover:border-stone-900 hover:text-stone-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Siguiente
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
