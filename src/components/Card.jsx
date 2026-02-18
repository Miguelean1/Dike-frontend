import { Link, useNavigate } from "react-router-dom";

export default function Card({ anuncio }) {
  const navigate = useNavigate();

  const {
    id,
    titulo = "Sofa tresillo",
    descripcion = "",
    imagen = "https://via.placeholder.com/600x400?text=Sin+imagen",
  } = anuncio ?? {};

  const handleContactar = () => {

    alert("Función de contacto en construcción.");
  };

  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">

      <button
        type="button"
        onClick={() => navigate(`/anuncio/${id}`)}
        className="block w-full text-left"
        aria-label={`Ver anuncio: ${titulo}`}
      >
        <div className="w-full h-48 bg-gray-200 overflow-hidden">
          <img
            src={imagen}
            alt={titulo}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </button>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{titulo}</h3>

        {descripcion ? (
          <p className="mt-2 text-sm text-gray-600 line-clamp-3">
            {descripcion}
          </p>
        ) : (
          <p className="mt-2 text-sm text-gray-500">Sin descripción.</p>
        )}

    
        <div className="mt-4 flex gap-2">
          <Link
            to={`/anuncio/${id}`}
            className="flex-1 text-center rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Ver
          </Link>

          <button
            type="button"
            onClick={handleContactar}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700 transition-colors"
          >
            Contactar
          </button>
        </div>
      </div>
    </article>
  );
}
