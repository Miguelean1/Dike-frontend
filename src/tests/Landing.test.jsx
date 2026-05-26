import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Landing from '@/features/auth/Landing'

vi.mock('@/components/Logo', () => ({ default: () => <span>Logo</span> }))

const renderLanding = () => render(<Landing />, { wrapper: MemoryRouter })

describe('Landing', () => {
  it('renders the login and register links', () => {
    renderLanding()
    expect(screen.getByRole('link', { name: /acceder/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /registrarse/i })).toBeInTheDocument()
  })

  it('renders the explore-without-account link', () => {
    renderLanding()
    expect(screen.getByRole('link', { name: /explorar sin cuenta/i })).toBeInTheDocument()
  })

  it('renders the marketing tagline', () => {
    renderLanding()
    expect(screen.getByText(/comparte · presta · dona/i)).toBeInTheDocument()
  })
})
