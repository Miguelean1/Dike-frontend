import { useEffect, useMemo, useState } from "react";
import Card from "../components/Card";

const USE_API = false; // TRUE para backend

export default function Feed() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: "" });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setStatus({ loading: true, error: "" });

        // Backend 
        if (USE_API) {
          const res = await fetch("/api/ads");
          if (!res.ok) throw new Error("No se pudieron cargar los anuncios");
          const data = await res.json();
          if (!cancelled) setItems(Array.isArray(data) ? data : []);
          return;
        }

        // Mock (MVP)
        const mock = [
          {
            id: 1,
            titulo: "Sofa tresillo",
            descripcion:
              "Conjunto de sofa de dos plazas y dos sillones. Un sofa pequeño que está un poco reventado pero aún se puede usar. Y además, dos sillones orejeros que están practicamente nuevos.",
            imagen: "https://res.cloudinary.com/dhhxrrgut/image/upload/v1771431205/sofaPrueba_jyirsi.jpg",
          },
          {
            id: 2,
            titulo: "Sofa tresillo",
            descripcion:
              "Conjunto de sofa de dos plazas y dos sillones. Se entrega sin desmontar. Zona del Alamillo.",
            imagen: "https://res.cloudinary.com/dhhxrrgut/image/upload/v1771431205/sofaPrueba_jyirsi.jpg",
          },
          {
            id: 3,
            titulo: "Sofa tresillo",
            descripcion: "Conjunto de sofa de dos plazas y dos sillones.",
            imagen: "https://res.cloudinary.com/dhhxrrgut/image/upload/v1771431205/sofaPrueba_jyirsi.jpg",
          },
          {
            id: 4,
            titulo: "Sofa tresillo",
            descripcion: "Como nuevo. Ideal para salón.",
            imagen: "https://res.cloudinary.com/dhhxrrgut/image/upload/v1771431205/sofaPrueba_jyirsi.jpg",
          },
          {
            id: 5,
            titulo: "Sofa tresillo",
            descripcion: "Buen estado general. Recogida en mano.",
            imagen: "https://res.cloudinary.com/dhhxrrgut/image/upload/v1771431205/sofaPrueba_jyirsi.jpg",
          },
          {
            id: 6,
            titulo: "Sofa tresillo",
            descripcion: "Disponible esta semana.",
            imagen: "https://res.cloudinary.com/dhhxrrgut/image/upload/v1771431205/sofaPrueba_jyirsi.jpg",
          },
        ];

        if (!cancelled) setItems(mock);
      } catch (e) {
        if (!cancelled) {
          setItems([]);
          setStatus({
            loading: false,
            error: e instanceof Error ? e.message : "Error desconocido",
          });
        }
      } finally {
        if (!cancelled) setStatus((s) => ({ ...s, loading: false }));
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    return items.filter((a) => {
      const t = (a.titulo ?? "").toLowerCase();
      const d = (a.descripcion ?? "").toLowerCase();
      return t.includes(q) || d.includes(q);
    });
  }, [items, query]);

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">DIKË</h1>
            <p className="text-gray-600 mt-1">
              Explora anuncios y abre el detalle con “Ver”.
            </p>
          </div>

          <div className="w-full md:w-[420px]">
            <label className="sr-only" htmlFor="search">
              Buscar
            </label>
            <div className="relative">
              <input
                id="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Busca algo..."
                className="w-full rounded-full border border-gray-300 bg-white px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
          </div>
        </div>

        {status.loading && (
          <div className="py-16 text-center text-gray-600">Cargando...</div>
        )}

        {!status.loading && status.error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {status.error}
          </div>
        )}

        {!status.loading && !status.error && filtered.length === 0 && (
          <div className="py-16 text-center text-gray-600">
            No hay resultados para “{query}”.
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
  );
}
