import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getConversations } from '@/services/api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageSquare } from 'lucide-react'

export default function Messages() {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await getConversations()
        setConversations(data)
      } catch {}
      finally { setLoading(false) }
    }
    load()
  }, [])

  return (
    <div className="min-h-full bg-transparent">
      <div className="max-w-2xl mx-auto px-4 py-8">

        <div className="border-t-4 border-b border-stone-900 pb-4 mb-8">
          <p className="text-stone-500 text-xs tracking-[0.3em] uppercase mb-1">Bandeja</p>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Mensajes</h1>
        </div>

        {loading ? (
          <p className="text-stone-500 text-sm tracking-widest uppercase text-center py-8">Cargando...</p>
        ) : conversations.length === 0 ? (
          <div className="border border-stone-300 bg-white p-10 text-center flex flex-col items-center gap-4">
            <MessageSquare size={32} className="text-stone-300" />
            <div>
              <p className="text-stone-700 text-sm font-bold mb-1">Sin conversaciones</p>
              <p className="text-stone-400 text-xs leading-relaxed">
                Inicia una conversación desde el perfil de un usuario o desde un anuncio.
              </p>
            </div>
            <Link
              to="/feed"
              className="text-xs uppercase tracking-widest border border-stone-400 text-stone-600 px-4 py-2 hover:border-stone-900 hover:text-stone-900 transition-colors mt-2"
            >
              Explorar anuncios
            </Link>
          </div>
        ) : (
          <div className="border border-stone-300 bg-white divide-y divide-stone-100">
            {conversations.map(({ user, last_message, unread_count }) => (
              <Link
                key={user.id}
                to={`/mensajes/${user.id}`}
                className="flex items-center gap-4 p-4 hover:bg-stone-50 transition-colors"
              >
                <Avatar className="h-10 w-10 border border-stone-200 shrink-0">
                  <AvatarImage src={user.profile_picture} />
                  <AvatarFallback className="bg-stone-100 text-stone-600 text-xs">
                    {user.username?.[0]?.toUpperCase() ?? 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-stone-900 font-bold text-sm">{user.username}</p>
                    {unread_count > 0 && (
                      <span className="bg-stone-900 text-stone-100 text-[10px] font-bold px-1.5 py-0.5 min-w-[18px] text-center">
                        {unread_count}
                      </span>
                    )}
                  </div>
                  <p className="text-stone-400 text-xs truncate">
                    {last_message.is_mine ? 'Tú: ' : ''}{last_message.content}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
