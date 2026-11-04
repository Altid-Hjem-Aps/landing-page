import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import Velkommen from '@/components/site/Velkommen'
import { storeLink } from '@/lib/store-links'

function setup() {
  return render(<Velkommen />)
}

describe('Velkommen', () => {
  // Risk: every "Hent appen" on the page lands on nothing.
  it('holds the anchor around the pills and QR cards, with the exact store links', () => {
    const { container } = setup()
    const anchors = container.querySelectorAll('#hent-appen')
    expect(anchors).toHaveLength(1)
    const get = within(anchors[0] as HTMLElement)
    expect(get.getByRole('link', { name: 'Hent i App Store' })).toHaveAttribute('href', storeLink('appstore'))
    expect(get.getByRole('link', { name: 'Hent i Google Play' })).toHaveAttribute('href', storeLink('play'))
    expect(get.getByRole('link', { name: 'QR-kode til Altid Hjem i App Store' })).toHaveAttribute('href', storeLink('appstore'))
    expect(get.getByRole('link', { name: 'QR-kode til Altid Hjem i Google Play' })).toHaveAttribute('href', storeLink('play'))
  })

  // Risk: the light variant is a copy that drifts from what the route expects.
  it('has one form, and it posts as the newsletter', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ status: 200 })
    vi.stubGlobal('fetch', fetchMock)
    const { container } = setup()
    expect(container.querySelectorAll('form')).toHaveLength(1)

    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'ny@example.dk' } })
    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.click(screen.getByRole('button', { name: 'Tilmeld' }))

    expect(await screen.findByText('Tak. Du hører fra os.')).toHaveFocus()
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/waitlist')
    expect(JSON.parse(init.body)).toEqual({ source: 'newsletter', scope: 'hjem', email: 'ny@example.dk', consent: true })
    vi.unstubAllGlobals()
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
