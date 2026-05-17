import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getUser, getUserRatings, updateUser } from '@/services/api'
import { useAuth } from '@/context/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ImagePlus, Star, Pencil, X, MessageSquare } from 'lucide-react'

export default function UserProfile() {
  const { id } = useParams()
  const { user: authUser, refreshUser } = useAuth()
  const isOwn = authUser?.id === Number(id)

  const [profile, setProfile] = useState(null)
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [editing, setEditing] = useState(false)
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const fileRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [userRes, ratingsRes] = await Promise.all([
          getUser(id),
          getUserRatings(id),
        ])
        if (!cancelled) {
          setProfile(userRes.data)
          setRatings(ratingsRes.data)
        }
      } catch {
        if (!cancelled) setError('No se pudo cargar el perfil.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [id])

  const startEdit = () => {
    setUsername(profile.username)
    setBio(profile.bio ?? '')
    setImage(null)
    setPreview(null)
    setSaveError('')
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
    setPreview(null)
  }

  const handleImage = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaveError('')
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('username', username)
      formData.append('bio', bio)
      if (image) formData.append('image', image)
      const { data } = await updateUser(id, formData)
      setProfile(data)
      await refreshUser()
      setEditing(false)
      setPreview(null)
    } catch (err) {
      setSaveError(err.response?.data?.error || 'Error al guardar los cambios.')
    } finally {
      setSaving(false)
    }
  }

  const avgRating = ratings.length
    ? (ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length).toFixed(1)
    : null

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <p className="text-stone-500 text-sm tracking-widest uppercase">Cargando...</p>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <p className="text-stone-700 text-sm">{error || 'Perfil no encontrado.'}</p>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-transparent">
      <div className="max-w-3xl mx-auto px-4 py-8">

        <div className="border-t-4 border-b border-stone-900 pb-4 mb-8 flex items-end justify-between">
          <div>
            <p className="text-stone-500 text-xs tracking-[0.3em] uppercase mb-1">Perfil</p>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">{profile.username}</h1>
          </div>
          <div className="flex items-center gap-2">
            {isOwn && !editing && (
              <button
                onClick={startEdit}
                className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-stone-600 border border-stone-400 px-3 py-1.5 hover:border-stone-900 hover:text-stone-900 transition-colors"
              >
                <Pencil size={12} />
                Editar
              </button>
            )}
            {!isOwn && authUser && (
              <Link
                to={`/mensajes/${id}`}
                className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-stone-600 border border-stone-400 px-3 py-1.5 hover:border-stone-900 hover:text-stone-900 transition-colors"
              >
                <MessageSquare size={12} />
                Mensaje
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="flex flex-col items-center gap-4 border border-stone-300 bg-white p-6">
            <Avatar className="h-24 w-24 border-2 border-stone-300">
              <AvatarImage src={profile.profile_picture} />
              <AvatarFallback className="bg-stone-100 text-stone-600 text-2xl font-black">
                {profile.username?.[0]?.toUpperCase() ?? 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="font-black text-stone-900">{profile.username}</p>
              {avgRating && (
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Star size={12} className="fill-stone-700 text-stone-700" />
                  <span className="text-xs text-stone-700 font-bold">{avgRating}</span>
                  <span className="text-xs text-stone-400">({ratings.length})</span>
                </div>
              )}
            </div>
            {profile.bio && (
              <p className="text-stone-500 text-xs text-center leading-relaxed border-t border-stone-200 pt-4 w-full">
                {profile.bio}
              </p>
            )}
            {profile.registration_date && (
              <p className="text-stone-400 text-[10px] uppercase tracking-widest">
                Desde {new Date(profile.registration_date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}
              </p>
            )}
          </div>

          <div className="md:col-span-2 flex flex-col gap-6">

            {editing && (
              <form onSubmit={handleSave} className="border border-stone-300 bg-white p-6 space-y-5">
                <p className="text-xs uppercase tracking-widest text-stone-500 font-bold border-b border-stone-200 pb-3">
                  Editar perfil
                </p>

                <div className="space-y-1.5">
                  <Label className="text-stone-700 text-xs tracking-widest uppercase">Nombre de usuario</Label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="bg-white border-stone-300 text-stone-900 rounded-none focus-visible:ring-stone-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-stone-700 text-xs tracking-widest uppercase">Biografía</Label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    placeholder="Cuéntanos algo sobre ti..."
                    className="w-full bg-white border border-stone-300 text-stone-900 text-sm px-3 py-2 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-500 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-stone-700 text-xs tracking-widest uppercase">Foto de perfil</Label>
                  {preview ? (
                    <div className="relative w-24 h-24 border border-stone-300 overflow-hidden">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => { setPreview(null); setImage(null) }}
                        className="absolute top-1 right-1 bg-stone-900 text-stone-100 p-0.5 hover:bg-stone-700"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 border border-dashed border-stone-400 px-4 py-2 hover:border-stone-700 hover:text-stone-700 transition-colors"
                    >
                      <ImagePlus size={14} />
                      Cambiar foto
                    </button>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
                </div>

                {saveError && (
                  <p className="text-xs text-red-700 border border-red-300 bg-red-50 px-3 py-2">{saveError}</p>
                )}

                <div className="flex gap-3 pt-1">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-stone-900 text-stone-100 hover:bg-stone-800 font-bold tracking-widest uppercase text-xs rounded-none cursor-pointer"
                  >
                    {saving ? 'Guardando...' : 'Guardar'}
                  </Button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="text-xs uppercase tracking-widest border border-stone-400 text-stone-600 px-4 hover:border-stone-900 hover:text-stone-900 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            <div className="border border-stone-300 bg-white p-6">
              <p className="text-xs uppercase tracking-widest text-stone-500 font-bold border-b border-stone-200 pb-3 mb-4">
                Valoraciones {ratings.length > 0 && `· ${ratings.length}`}
              </p>

              {ratings.length === 0 ? (
                <p className="text-stone-400 text-xs italic">Sin valoraciones aún.</p>
              ) : (
                <div className="space-y-4">
                  {ratings.map((r) => (
                    <div key={r.id} className="border-b border-stone-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-stone-700">
                          {r.ratingUser?.username ?? 'Usuario'}
                        </span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={11}
                              className={i < r.score ? 'fill-stone-700 text-stone-700' : 'text-stone-300'}
                            />
                          ))}
                        </div>
                      </div>
                      {r.comment && (
                        <p className="text-stone-500 text-xs leading-relaxed">{r.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
