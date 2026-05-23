import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { adminGetUsers, adminUpdateUser, adminDeleteUser, adminGetPosts, adminUpdatePost, adminDeletePost } from '@/services/api'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Trash2, Pencil, X, Check } from 'lucide-react'

export default function AdminPanel() {
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [editingUser, setEditingUser] = useState(null)
  const [editingPost, setEditingPost] = useState(null)

  useEffect(() => { loadUsers() }, [])
  useEffect(() => { loadPosts() }, [])

  async function loadUsers() {
    const { data } = await adminGetUsers()
    setUsers(data)
  }

  async function loadPosts() {
    const { data } = await adminGetPosts()
    setPosts(data)
  }

  async function handleDeleteUser(id) {
    const result = await Swal.fire({
      title: '¿Eliminar usuario?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1c1917',
      cancelButtonColor: '#a8a29e',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    })
    if (!result.isConfirmed) return
    await adminDeleteUser(id)
    setUsers((prev) => prev.filter((u) => u.id !== id))
    Swal.fire({ title: 'Eliminado', icon: 'success', timer: 1500, showConfirmButton: false })
  }

  async function handleSaveUser(id) {
    await adminUpdateUser(id, editingUser)
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, ...editingUser } : u))
    setEditingUser(null)
  }

  async function handleDeletePost(id) {
    const result = await Swal.fire({
      title: '¿Eliminar anuncio?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1c1917',
      cancelButtonColor: '#a8a29e',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    })
    if (!result.isConfirmed) return
    await adminDeletePost(id)
    setPosts((prev) => prev.filter((p) => p.id !== id))
    Swal.fire({ title: 'Eliminado', icon: 'success', timer: 1500, showConfirmButton: false })
  }

  async function handleSavePost(id) {
    await adminUpdatePost(id, editingPost)
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, ...editingPost } : p))
    setEditingPost(null)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="border-t-4 border-b border-stone-900 pb-4 mb-8">
        <p className="text-stone-500 text-xs tracking-[0.3em] uppercase mb-1">Panel de administración</p>
        <h1 className="text-2xl font-black text-stone-900 tracking-tight">Control de contenido</h1>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="mb-6 bg-stone-100 rounded-none">
          <TabsTrigger value="users" className="rounded-none text-xs tracking-widest uppercase">
            Usuarios ({users.length})
          </TabsTrigger>
          <TabsTrigger value="posts" className="rounded-none text-xs tracking-widest uppercase">
            Anuncios ({posts.length})
          </TabsTrigger>
        </TabsList>

        {/* USERS TAB */}
        <TabsContent value="users">
          <div className="border border-stone-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-100 border-b border-stone-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-600">Usuario</th>
                  <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-600">Email</th>
                  <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-600">Rol</th>
                  <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-600">Reputación</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isEditing = editingUser && editingUser.id === u.id
                  return (
                    <tr key={u.id} className="border-b border-stone-100 hover:bg-stone-50">
                      <td className="px-4 py-3">
                        {isEditing
                          ? <input className="border border-stone-300 px-2 py-1 text-sm w-32" value={editingUser.username} onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })} />
                          : <span className="font-medium">{u.username}</span>
                        }
                      </td>
                      <td className="px-4 py-3 text-stone-500">{u.email}</td>
                      <td className="px-4 py-3">
                        {isEditing
                          ? (
                            <select className="border border-stone-300 px-2 py-1 text-sm" value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}>
                              <option value="user">user</option>
                              <option value="admin">admin</option>
                              <option value="visitor">visitor</option>
                            </select>
                          )
                          : <span className="text-xs uppercase tracking-widest">{u.role}</span>
                        }
                      </td>
                      <td className="px-4 py-3">
                        {isEditing
                          ? <input type="number" min="0" className="border border-stone-300 px-2 py-1 text-sm w-20" value={editingUser.reputation} onChange={(e) => setEditingUser({ ...editingUser, reputation: e.target.value })} />
                          : u.reputation
                        }
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          {isEditing ? (
                            <>
                              <button onClick={() => handleSaveUser(u.id)} className="text-green-600 hover:text-green-800"><Check size={15} /></button>
                              <button onClick={() => setEditingUser(null)} className="text-stone-400 hover:text-stone-600"><X size={15} /></button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => setEditingUser({ id: u.id, username: u.username, role: u.role, reputation: u.reputation })} className="text-stone-400 hover:text-stone-900"><Pencil size={15} /></button>
                              <button onClick={() => handleDeleteUser(u.id)} className="text-red-400 hover:text-red-600"><Trash2 size={15} /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* POSTS TAB */}
        <TabsContent value="posts">
          <div className="border border-stone-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-100 border-b border-stone-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-600">Título</th>
                  <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-600">Autor</th>
                  <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-600">Tipo</th>
                  <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-600">Estado</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => {
                  const isEditing = editingPost && editingPost.id === p.id
                  return (
                    <tr key={p.id} className="border-b border-stone-100 hover:bg-stone-50">
                      <td className="px-4 py-3">
                        {isEditing
                          ? <input className="border border-stone-300 px-2 py-1 text-sm w-48" value={editingPost.title} onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })} />
                          : <span className="font-medium">{p.title}</span>
                        }
                      </td>
                      <td className="px-4 py-3 text-stone-500">{p.author?.username}</td>
                      <td className="px-4 py-3">
                        {isEditing
                          ? (
                            <select className="border border-stone-300 px-2 py-1 text-sm" value={editingPost.type} onChange={(e) => setEditingPost({ ...editingPost, type: e.target.value })}>
                              <option value="donation">donation</option>
                              <option value="loan">loan</option>
                              <option value="exchange">exchange</option>
                            </select>
                          )
                          : <span className="text-xs uppercase tracking-widest">{p.type}</span>
                        }
                      </td>
                      <td className="px-4 py-3">
                        {isEditing
                          ? (
                            <select className="border border-stone-300 px-2 py-1 text-sm" value={editingPost.status} onChange={(e) => setEditingPost({ ...editingPost, status: e.target.value })}>
                              <option value="active">active</option>
                              <option value="completed">completed</option>
                              <option value="cancelled">cancelled</option>
                            </select>
                          )
                          : <span className="text-xs uppercase tracking-widest">{p.status}</span>
                        }
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          {isEditing ? (
                            <>
                              <button onClick={() => handleSavePost(p.id)} className="text-green-600 hover:text-green-800"><Check size={15} /></button>
                              <button onClick={() => setEditingPost(null)} className="text-stone-400 hover:text-stone-600"><X size={15} /></button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => setEditingPost({ id: p.id, title: p.title, type: p.type, status: p.status })} className="text-stone-400 hover:text-stone-900"><Pencil size={15} /></button>
                              <button onClick={() => handleDeletePost(p.id)} className="text-red-400 hover:text-red-600"><Trash2 size={15} /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
