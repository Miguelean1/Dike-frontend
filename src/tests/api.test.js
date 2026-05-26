import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import api, {
  register, login, verifyEmail, forgotPassword, resetPassword,
  getUser, getPosts, getPost, createPost, deletePost,
  createRating, getUserRatings,
} from '@/services/api'

describe('api service', () => {
  beforeEach(() => {
    vi.spyOn(api, 'get').mockResolvedValue({ data: {} })
    vi.spyOn(api, 'post').mockResolvedValue({ data: {} })
    vi.spyOn(api, 'put').mockResolvedValue({ data: {} })
    vi.spyOn(api, 'delete').mockResolvedValue({ data: {} })
    vi.spyOn(api, 'patch').mockResolvedValue({ data: {} })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('register calls POST /auth/register', async () => {
    await register({ email: 'a@test.com', password: 'pw' })
    expect(api.post).toHaveBeenCalledWith('/auth/register', { email: 'a@test.com', password: 'pw' })
  })

  it('login calls POST /auth/login', async () => {
    await login({ email: 'a@test.com', password: 'pw' })
    expect(api.post).toHaveBeenCalledWith('/auth/login', { email: 'a@test.com', password: 'pw' })
  })

  it('verifyEmail calls GET /auth/verify-email/:token', async () => {
    await verifyEmail('mytoken')
    expect(api.get).toHaveBeenCalledWith('/auth/verify-email/mytoken')
  })

  it('forgotPassword calls POST /auth/forgot-password', async () => {
    await forgotPassword('a@test.com')
    expect(api.post).toHaveBeenCalledWith('/auth/forgot-password', { email: 'a@test.com' })
  })

  it('resetPassword calls POST /auth/reset-password', async () => {
    await resetPassword('tok', 'newpass')
    expect(api.post).toHaveBeenCalledWith('/auth/reset-password', { token: 'tok', password: 'newpass' })
  })

  it('getUser calls GET /users/:id', async () => {
    await getUser(5)
    expect(api.get).toHaveBeenCalledWith('/users/5')
  })

  it('getPosts calls GET /posts with params', async () => {
    await getPosts({ page: 1, limit: 12 })
    expect(api.get).toHaveBeenCalledWith('/posts', { params: { page: 1, limit: 12 } })
  })

  it('getPost calls GET /posts/:id', async () => {
    await getPost(3)
    expect(api.get).toHaveBeenCalledWith('/posts/3')
  })

  it('createPost calls POST /posts', async () => {
    const data = { title: 'Test' }
    await createPost(data)
    expect(api.post).toHaveBeenCalledWith('/posts', data)
  })

  it('deletePost calls DELETE /posts/:id', async () => {
    await deletePost(7)
    expect(api.delete).toHaveBeenCalledWith('/posts/7')
  })

  it('getUserRatings calls GET /ratings/user/:id', async () => {
    await getUserRatings(2)
    expect(api.get).toHaveBeenCalledWith('/ratings/user/2')
  })

  it('createRating calls POST /ratings', async () => {
    const data = { rated_user_id: 2, score: 5 }
    await createRating(data)
    expect(api.post).toHaveBeenCalledWith('/ratings', data)
  })
})
