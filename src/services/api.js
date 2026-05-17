import axios from 'axios'

const BASE_URL = 'http://localhost:3001/api'

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

// Auth
export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)

// Users
export const getUser = (id) => api.get(`/users/${id}`)
export const updateUser = (id, data) => api.put(`/users/${id}`, data)

// Posts
export const getPosts = (params) => api.get('/posts', { params })
export const getPost = (id) => api.get(`/posts/${id}`)
export const createPost = (data) => api.post('/posts', data)
export const updatePost = (id, data) => api.put(`/posts/${id}`, data)
export const deletePost = (id) => api.delete(`/posts/${id}`)

// Requests
export const getRequests = (type) => api.get('/requests', { params: { type } })
export const createRequest = (data) => api.post('/requests', data)
export const updateRequest = (id, status) => api.put(`/requests/${id}`, { status })

// Messages
export const getMessages = (userId) => api.get(`/messages/${userId}`)
export const sendMessage = (data) => api.post('/messages', data)
export const markMessageRead = (id) => api.put(`/messages/${id}/read`)

// Ratings
export const getUserRatings = (userId) => api.get(`/ratings/user/${userId}`)
export const createRating = (data) => api.post('/ratings', data)

// Categories & Tags
export const getCategories = () => api.get('/categories')
export const getTags = () => api.get('/tags')

export default api
