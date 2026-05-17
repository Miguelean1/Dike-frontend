import { useEffect, useMemo, useState } from 'react'
import Card from '@/components/Card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { getPosts } from '@/services/api'

const USE_API = false

const MOCK = [
  { id: 1, titulo: 'Sofá tresillo', descripcion: 'Conjunto de sofá de dos plazas y dos sillones. Un sofá pequeño que está un poco reventado pero aún se puede usar. Y además, dos sillones orejeros que están prácticamente nuevos.', imagen: 'https://res.cloudinary.com/dhhxrrgut/image/upload/v1771431205/sofaPrueba_jyirsi.jpg', type: 'donation' },
  { id: 2, titulo: 'Sofá tresillo', descripcion: 'Conjunto de sofá de dos plazas y dos sillones. Se entrega sin desmontar. Zona del Alamillo.', imagen: 'https://res.cloudinary.com/dhhxrrgut/image/upload/v1771431205/sofaPrueba_jyirsi.jpg', type: 'loan' },
  { id: 3, titulo: 'Sofá tresillo', descripcion: 'Conjunto de sofá de dos plazas y dos sillones.', imagen: 'https://res.cloudinary.com/dhhxrrgut/image/upload/v1771431205/sofaPrueba_jyirsi.jpg', type: 'donation' },
  { id: 4, titulo: 'Sofá tresillo', descripcion: 'Como nuevo. Ideal para salón.', imagen: 'https://res.cloudinary.com/dhhxrrgut/image/upload/v1771431205/sofaPrueba_jyirsi.jpg', type: 'exchange' },
  { id: 5, titulo: 'Sofá tresillo', descripcion: 'Buen estado general. Recogida en mano.', imagen: 'https://res.cloudinary.com/dhhxrrgut/image/upload/v1771431205/sofaPrueba_jyirsi.jpg', type: 'loan' },
  { id: 6, titulo: 'Sofá tresillo', descripcion: 'Disponible esta semana.', imagen: 'https://res.cloudinary.com/dhhxrrgut/image/upload/v1771431205/sofaPrueba_jyirsi.jpg', type: 'donation' },
]

export default function Feed() {
  const [query, setQuery] = useState('')
  const [items, setItems] = useState([])
  const [status, setStatus] = useState({ loading: true, error: '' })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setStatus({ loading: true, error: '' })
        if (USE_API) {
          const { data } = await getPosts()
          if (!cancelled) setItems(Array.isArray(data) ? data : [])
          return
        }
        if (!cancelled) setItems(MOCK)
      } catch (e) {
        if (!cancelled) setStatus({ loading: false, error: e.message ?? 'Error desconocido' })
        return
      } finally {
        if (!cancelled) setStatus((s) => ({ ...s, loading: false }))
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((a) =>
      (a.titulo ?? '').toLowerCase().includes(q) ||
      (a.descripcion ?? '').toLowerCase().includes(q)
    )
  }, [items, query])

  return (
    <div className="min-h-full bg-paper">
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
            No hay resultados para "{query}".
          </div>
        )}

        {!status.loading && !status.error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((anuncio) => (
              <Card key={anuncio.id} anuncio={anuncio} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
