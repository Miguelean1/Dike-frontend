import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPost, getCategories, getTags } from '@/services/api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ImagePlus, X } from 'lucide-react'

const TYPES = [
  { value: 'donation', label: 'Donación' },
  { value: 'loan', label: 'Préstamo' },
  { value: 'exchange', label: 'Intercambio' },
]

export default function CreatePost() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('donation')
  const [category, setCategory] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  useEffect(() => {
    async function loadOptions() {
      try {
        const [catRes, tagRes] = await Promise.all([getCategories(), getTags()])
        setCategories(catRes.data)
        setTags(tagRes.data)
      } catch {
        setError('No se pudieron cargar las opciones del formulario.')
      }
    }
    loadOptions()
  }, [])

  const handleImage = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const removeImage = () => {
    setImage(null)
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const toggleTag = (id) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!category) {
      setError('Selecciona una categoría.')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('type', type)
      formData.append('category', category)
      selectedTags.forEach((id) => formData.append('tagIds[]', id))
      if (image) formData.append('image', image)

      await createPost(formData)
      navigate('/feed')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al publicar el anuncio.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-full bg-transparent">
      <div className="max-w-2xl mx-auto px-4 py-8">

        <div className="border-t-4 border-b border-stone-900 pb-4 mb-8">
          <p className="text-stone-500 text-xs tracking-[0.3em] uppercase mb-1">Nuevo anuncio</p>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Publicar objeto</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="space-y-2">
            <Label className="text-stone-700 text-xs tracking-widest uppercase">Tipo de anuncio</Label>
            <div className="flex gap-2 flex-wrap">
              {TYPES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setType(value)}
                  className={`text-xs uppercase tracking-widest px-4 py-2 border transition-colors ${
                    type === value
                      ? 'bg-stone-900 text-stone-100 border-stone-900'
                      : 'bg-transparent text-stone-600 border-stone-400 hover:border-stone-900 hover:text-stone-900'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-stone-700 text-xs tracking-widest uppercase">Título</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Sofá de dos plazas"
              required
              className="bg-white border-stone-300 text-stone-900 placeholder:text-stone-400 focus-visible:ring-stone-500 rounded-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-stone-700 text-xs tracking-widest uppercase">Categoría</Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white border border-stone-300 text-stone-900 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500"
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-stone-700 text-xs tracking-widest uppercase">Descripción</Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe el objeto, su estado, cómo se entrega..."
              required
              rows={4}
              className="w-full bg-white border border-stone-300 text-stone-900 text-sm px-3 py-2 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-500 resize-none"
            />
          </div>

          {tags.length > 0 && (
            <div className="space-y-2">
              <Label className="text-stone-700 text-xs tracking-widest uppercase">Etiquetas</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`text-xs uppercase tracking-widest px-3 py-1.5 border transition-colors ${
                      selectedTags.includes(tag.id)
                        ? 'bg-stone-900 text-stone-100 border-stone-900'
                        : 'bg-transparent text-stone-600 border-stone-400 hover:border-stone-900 hover:text-stone-900'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-stone-700 text-xs tracking-widest uppercase">Imagen</Label>
            {preview ? (
              <div className="relative w-full aspect-video border border-stone-300 overflow-hidden">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-stone-900 text-stone-100 p-1 hover:bg-stone-700 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full border border-dashed border-stone-400 py-10 flex flex-col items-center gap-2 text-stone-500 hover:border-stone-700 hover:text-stone-700 transition-colors"
              >
                <ImagePlus size={24} />
                <span className="text-xs uppercase tracking-widest">Añadir imagen</span>
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />
          </div>

          {error && (
            <p className="text-xs text-red-700 border border-red-300 bg-red-50 px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-stone-900 text-stone-100 hover:bg-stone-800 font-bold tracking-widest uppercase text-xs rounded-none cursor-pointer"
            >
              {loading ? 'Publicando...' : 'Publicar anuncio'}
            </Button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 text-xs uppercase tracking-widest border border-stone-400 text-stone-600 hover:border-stone-900 hover:text-stone-900 transition-colors"
            >
              Cancelar
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
