import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect } from 'vitest'
import MainLayout from '@/layouts/MainLayout'

vi.mock('@/components/Navbar', () => ({ default: () => <nav data-testid="navbar">Navbar</nav> }))
vi.mock('@/components/Footer', () => ({ default: () => <footer data-testid="footer">Footer</footer> }))

describe('MainLayout', () => {
  it('renders Navbar and Footer', () => {
    render(<MemoryRouter><MainLayout /></MemoryRouter>)
    expect(screen.getByTestId('navbar')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })
})
