import axios from 'axios'

const BASE_URL = 'http://localhost:3002/api'

const api = axios.create({
  baseURL: BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)
export const verifyEmail = (token) => api.get(`/auth/verify-email/${token}`)
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email })
export const resetPassword = (token, password) => api.post('/auth/reset-password', { token, password })

export const getUser = (id) => api.get(`/users/${id}`)
export const updateUser = (id, data) => api.put(`/users/${id}`, data)

export const getPosts = (params) => api.get('/posts', { params })
export const getPost = (id) => api.get(`/posts/${id}`)
export const createPost = (data) => api.post('/posts', data)
export const updatePost = (id, data) => api.put(`/posts/${id}`, data)
export const updatePostStatus = (id, status) => api.patch(`/posts/${id}/status`, { status })
export const deletePost = (id) => api.delete(`/posts/${id}`)

export const getRequests = (type) => api.get('/requests', { params: { type } })
export const createRequest = (data) => api.post('/requests', data)
export const updateRequest = (id, status) => api.put(`/requests/${id}`, { status })

export const getConversations = () => api.get('/messages')
export const getMessages = (userId) => api.get(`/messages/${userId}`)
export const sendMessage = (data) => api.post('/messages', data)
export const markMessageRead = (id) => api.put(`/messages/${id}/read`)

export const getUserRatings = (userId) => api.get(`/ratings/user/${userId}`)
export const createRating = (data) => api.post('/ratings', data)

export const getCategories = () => api.get('/categories')
export const getTags = () => api.get('/tags')

// Admin
export const adminGetUsers = () => api.get('/admin/users')
export const adminUpdateUser = (id, data) => api.put(`/admin/users/${id}`, data)
export const adminDeleteUser = (id) => api.delete(`/admin/users/${id}`)

export const adminGetPosts = (params) => api.get('/admin/posts', { params })
export const adminUpdatePost = (id, data) => api.put(`/admin/posts/${id}`, data)
export const adminDeletePost = (id) => api.delete(`/admin/posts/${id}`)

export default api
