import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from '@/components/Footer'

vi.mock('@/components/Logo', () => ({ Logo: () => null }))

// The footer renders the link run twice (desktop inline + mobile stacked), so
// each link appears in both blocks: assert every instance.
function expectAll(name: string, href: string) {
  const links = screen.getAllByRole('link', { name })
  expect(links.length).toBeGreaterThan(0)
  links.forEach((l) => expect(l).toHaveAttribute('href', href))
}

describe('footer', () => {
  it('links to support and the legal pages Google Play requires to be reachable', () => {
    render(<Footer />)
    expectAll('Support', '/kontakt')
    expectAll('Privatlivspolitik', '/privatlivspolitik')
    expectAll('Slet konto', '/slet-konto')
  })

  it('links to the referral page', () => {
    render(<Footer />)
    expectAll('Del Altid Hjem', '/del')
  })
})
