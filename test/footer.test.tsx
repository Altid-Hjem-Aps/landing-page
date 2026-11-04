import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from '@/components/Footer'

vi.mock('@/components/Logo', () => ({ Logo: () => null }))

describe('footer', () => {
  it('links to support and the legal pages Google Play requires to be reachable', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: 'Support' })).toHaveAttribute('href', '/kontakt')
    expect(screen.getByRole('link', { name: 'Privatlivspolitik' })).toHaveAttribute('href', '/privatlivspolitik')
    expect(screen.getByRole('link', { name: 'Slet konto' })).toHaveAttribute('href', '/slet-konto')
    expect(screen.getByRole('button', { name: 'Cookieindstillinger' })).toBeInTheDocument()
  })

  it('names the company with its CVR', () => {
    render(<Footer />)
    expect(screen.getByText(/Altid Hjem ApS · CVR 45637476/)).toBeInTheDocument()
  })

  it('shows the icons of the services in the app only', () => {
    const { container } = render(<Footer />)
    const icons = Array.from(container.querySelectorAll('img')).map((i) => i.getAttribute('src'))
    expect(icons).toEqual(['/site/icons/madplan.svg', '/site/icons/strom.svg', '/site/icons/forsikring.svg', '/site/icons/okonomi.svg'])
  })
})
