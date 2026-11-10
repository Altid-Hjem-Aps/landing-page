import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import Velkommen from '@/components/site/Velkommen'
import { storeLink } from '@/lib/store-links'

function stubObserver() {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      disconnect() {}
    },
  )
}
beforeEach(stubObserver)

function setup() {
  return render(<Velkommen />)
}

describe('Velkommen', () => {
  // Risk: every "Hent appen" on the page lands on nothing.
  it('holds the anchor around the heading and the pills, with the exact store links', () => {
    const { container } = setup()
    const anchors = container.querySelectorAll('#hent-appen')
    expect(anchors).toHaveLength(1)
    const get = within(anchors[0] as HTMLElement)
    expect(get.getByRole('heading', { level: 2 }).textContent).toBe('Velkommen hjem. Hent Altid Hjem gratis i dag.')
    expect(get.getByRole('link', { name: 'Hent i App Store' })).toHaveAttribute('href', storeLink('appstore'))
    expect(get.getByRole('link', { name: 'Hent i Google Play' })).toHaveAttribute('href', storeLink('play'))
  })

  it('counts a pill click as final', async () => {
    const sendBeacon = vi.fn((url: string, data: Blob) => {
      void url
      void data
      return true
    })
    vi.stubGlobal('navigator', { ...navigator, sendBeacon })
    setup()
    fireEvent.click(screen.getByRole('link', { name: 'Hent i Google Play' }))
    expect(JSON.parse(await sendBeacon.mock.calls[0][1].text())).toEqual({ store: 'play', position: 'final' })
    vi.unstubAllGlobals()
    stubObserver()
  })

  it('tells search engines the app is free, with no rating', () => {
    const { container } = setup()
    const data = JSON.parse(container.querySelector('script[type="application/ld+json"]')?.textContent ?? '') as Record<string, unknown>[]
    const app = data.find((d) => d['@type'] === 'MobileApplication') as Record<string, unknown>
    expect(app.offers).toMatchObject({ price: '0', priceCurrency: 'DKK' })
    expect(app.operatingSystem).toBe('iOS, Android')
    expect(app.aggregateRating).toBeUndefined()
    expect(data.find((d) => d['@type'] === 'Organization')?.sameAs).toContain('https://www.instagram.com/altidhjem/')
  })
})
