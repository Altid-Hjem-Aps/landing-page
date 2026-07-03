import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

// Home's sections are client components with browser-only side effects —
// the footer is what's under test here.
vi.mock('@/components/Nav', () => ({ default: () => null }))
vi.mock('@/components/Hero', () => ({ default: () => null }))
vi.mock('@/components/sections/Testimonials', () => ({ default: () => null }))
vi.mock('@/components/sections/FounderVideo', () => ({ default: () => null }))
vi.mock('@/components/sections/SavingsCounter', () => ({ default: () => null }))
vi.mock('@/components/sections/Services', () => ({ default: () => null }))
vi.mock('@/components/sections/HowItWorks', () => ({ default: () => null }))
vi.mock('@/components/sections/WhatIs', () => ({ default: () => null }))
vi.mock('@/components/sections/Trust', () => ({ default: () => null }))
vi.mock('@/components/sections/Faq', () => ({ default: () => null }))
vi.mock('@/components/sections/Blog', () => ({ default: () => null }))
vi.mock('@/components/sections/BottomCta', () => ({ default: () => null }))
vi.mock('@/components/Logo', () => ({ Logo: () => null }))

describe('home footer', () => {
  it('links to support and the legal pages Google Play requires to be reachable', () => {
    render(<Home />)
    // The footer renders the link run twice (desktop inline + mobile stacked),
    // so each link appears in both blocks — assert every instance.
    const expectAll = (name: string, href: string) => {
      const links = screen.getAllByRole('link', { name })
      expect(links.length).toBeGreaterThan(0)
      links.forEach((l) => expect(l).toHaveAttribute('href', href))
    }
    expectAll('Support', '/kontakt')
    expectAll('Privatlivspolitik', '/privatlivspolitik')
    expectAll('Slet konto', '/slet-konto')
  })
})
