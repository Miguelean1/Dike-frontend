import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getMessages, sendMessage, markMessageRead, getUser } from '@/services/api'
import { useAuth } from '@/context/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send } from 'lucide-react'

function saveConversation(userId) {
  try {
    const stored = JSON.parse(localStorage.getItem('dike_conversations') ?? '[]')
    const updated = [Number(userId), ...stored.filter((id) => id !== Number(userId))].slice(0, 20)
    localStorage.setItem('dike_conversations', JSON.stringify(updated))
  } catch {}
}

export default function Chat() {
  const { userId } = useParams()
  const { user: authUser } = useAuth()

  const [other, setOther] = useState(null)
  const [messages, setMessages] = useState([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)
  const pollRef = useRef(null)

  const loadMessages = async () => {
    try {
      const { data } = await getMessages(userId)
      setMessages(data)
      data.filter((m) => !m.read_status && m.sender_id !== authUser.id)
          .forEach((m) => markMessageRead(m.id).catch(() => {}))
    } catch {}
  }

  useEffect(() => {
    async function init() {
      try {
        const [userRes] = await Promise.all([getUser(userId), loadMessages()])
        setOther(userRes.data)
        saveConversation(userId)
      } catch {}
      finally { setLoading(false) }
    }
    init()

    pollRef.current = setInterval(loadMessages, 5000)
    return () => clearInterval(pollRef.current)
  }, [userId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    setSending(true)
    try {
      const { data } = await sendMessage({ receiver_id: Number(userId), content: content.trim() })
      setMessages((prev) => [...prev, data])
      setContent('')
    } catch {}
    finally { setSending(false) }
  }

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <p className="text-stone-500 text-sm tracking-widest uppercase">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-transparent flex flex-col">
      <div className="max-w-2xl w-full mx-auto px-4 py-8 flex flex-col flex-1">

        <div className="border-t-4 border-b border-stone-900 pb-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-stone-300">
              <AvatarImage src={other?.profile_picture} />
              <AvatarFallback className="bg-stone-100 text-stone-600 text-xs">
                {other?.username?.[0]?.toUpperCase() ?? 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-black text-stone-900 text-sm">{other?.username ?? 'Usuario'}</p>
              <p className="text-stone-500 text-[10px] uppercase tracking-widest">Conversación</p>
            </div>
          </div>
          {other && (
            <Link
              to={`/perfil/${userId}`}
              className="text-xs uppercase tracking-widest border border-stone-400 text-stone-600 px-3 py-1.5 hover:border-stone-900 hover:text-stone-900 transition-colors"
            >
              Ver perfil
            </Link>
          )}
        </div>

        <div className="flex-1 border border-stone-300 bg-white p-4 overflow-y-auto space-y-3 min-h-[400px] max-h-[500px]">
          {messages.length === 0 ? (
            <p className="text-stone-400 text-xs italic text-center pt-8">
              Aún no hay mensajes. ¡Empieza la conversación!
            </p>
          ) : (
            messages.map((msg) => {
              const isMine = msg.sender_id === authUser.id
              return (
                <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] px-3 py-2 text-sm ${
                    isMine
                      ? 'bg-stone-900 text-stone-100'
                      : 'bg-stone-100 text-stone-900 border border-stone-200'
                  }`}>
                    <p className="leading-relaxed">{msg.content}</p>
                    <p className={`text-[10px] mt-1 ${isMine ? 'text-stone-400' : 'text-stone-400'}`}>
                      {new Date(msg.sent_date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )
            })
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} className="flex gap-2 mt-4">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-white border border-stone-300 text-stone-900 text-sm px-3 py-2 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-500"
          />
          <button
            type="submit"
            disabled={sending || !content.trim()}
            className="px-4 bg-stone-900 text-stone-100 hover:bg-stone-800 transition-colors disabled:opacity-40"
          >
            <Send size={16} />
          </button>
        </form>

      </div>
    </div>
  )
}
