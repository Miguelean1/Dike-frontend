import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const DetailCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [anuncio, setAnuncio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch en back
    const loadData = async () => {
      try {
        
        await new Promise(resolve => setTimeout(resolve, 800));

        const data = {
          id: id,
          titulo: 'Sofá tresillo',
          subtitulo: 'Conjunto de sofa de dos plazas y dos sillones',
          descripcion: 'Un sofa pequeño que está un poco reventado pero aún se puede usar. Y además, dos sillones orejeros que están practicamente nuevos.',
          estado: 'Como nuevo',
          entrega: 'Se entrega sin desmontar',
          zona: 'Zona del Alamillo',
          imagen: 'https://via.placeholder.com/800x600?text=Sofa+Tresillo', // Cambia esto por una imagen real si tienes
          usuario: {
            id: 123,
            nombre: 'Carmen Sandiego',
            avatar: 'https://ui-avatars.com/api/?name=Carmen+Sandiego&background=3498db&color=fff',
            verificado: true
          },
          createdAt: '2026-02-10T10:30:00Z'
        };
        
        setAnuncio(data);
      } catch (error) {
        console.error("Error cargando anuncio:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Cargando anuncio...</p>
        </div>
      </div>
    );
  }

  if (!anuncio) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Anuncio no encontrado</h2>
          <p className="text-gray-600 mb-6">El anuncio que buscas no existe o ha sido eliminado.</p>
          <button
            onClick={() => navigate('/feed')}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
          >
            Volver al Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
       
        <nav className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/feed" className="hover:text-blue-600 transition-colors">
            Feed
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium truncate">{anuncio.titulo}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="aspect-w-4 aspect-h-3 bg-gray-200 relative">
              <img
                src={anuncio.imagen}
                alt={anuncio.titulo}
                className="w-full h-full object-cover absolute inset-0"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
                {anuncio.estado}
              </div>
            </div>
          </div>

          
          <div className="space-y-6">
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {anuncio.titulo}
              </h1>

              {anuncio.subtitulo && (
                <p className="text-lg text-gray-600 mb-6 font-medium">
                  {anuncio.subtitulo}
                </p>
              )}

              <div className="prose prose-blue text-gray-600 mb-8 leading-relaxed">
                {anuncio.descripcion}
              </div>

             
              <div className="bg-gray-50 rounded-xl p-5 mb-8 space-y-3">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                  <span className="font-semibold text-gray-700">Estado</span>
                  <span className="text-gray-900">{anuncio.estado}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                  <span className="font-semibold text-gray-700">Entrega</span>
                  <span className="text-gray-900">{anuncio.entrega}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                  <span className="font-semibold text-gray-700">Zona</span>
                  <span className="text-gray-900">{anuncio.entrega}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                   <span className="font-semibold text-gray-700">Publicado</span>
                   <span className="text-gray-900">
                    {new Date(anuncio.createdAt).toLocaleDateString()}
                   </span>
                </div>
              </div>

              
              <button className="w-full py-3.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-bold text-lg shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2">
                <span>💬</span> Contactar ahora
              </button>
            </div>

           
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={anuncio.usuario.avatar}
                  alt={anuncio.usuario.nombre}
                  className="w-14 h-14 rounded-full border-2 border-gray-100"
                />
                <div>
                  <p className="font-bold text-gray-900 text-lg">{anuncio.usuario.nombre}</p>
                  {anuncio.usuario.verificado && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                      Usuario Verificado
                    </span>
                  )}
                </div>
              </div>
              <Link
                to={`/perfil/${anuncio.usuario.id}`}
                className="px-5 py-2.5 border-2 border-gray-200 text-gray-700 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors font-semibold text-sm"
              >
                Ver Perfil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailCard;
