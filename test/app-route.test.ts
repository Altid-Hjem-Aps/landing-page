import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, HEAD } from '@/app/app/route'

// www.altidhjem.dk/app is the link people share (ALT-605). Risk: it stops
// reaching the tracked store link, or carries query junk along, or gets cached
// so later taps skip the counter at /m/invite/header.
describe('/app', () => {
  it('sends everyone to /m/invite/header with a 307, dropping any query, never cached', async () => {
    const res = GET(new NextRequest('https://www.altidhjem.dk/app?utm_source=x&ref=y'))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe('https://www.altidhjem.dk/m/invite/header')
    expect(res.headers.get('cache-control')).toBe('no-store')
    expect(res.headers.get('x-robots-tag')).toBe('noindex, nofollow')
  })

  it('gives a link preview an Altid Hjem card instead of following on to the App Store', async () => {
    const res = GET(new NextRequest('https://www.altidhjem.dk/app', { headers: { 'user-agent': 'WhatsApp/2.24.1 A' } }))
    expect(res.status).toBe(200)
    const html = await res.text()
    expect(html).toContain('<meta property="og:title" content="Prøv Altid Hjem">')
    expect(html).not.toContain('apps.apple.com')
    expect(res.headers.get('vary')).toBe('User-Agent')
  })

  it('still redirects a phone browser', () => {
    const iphone = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1'
    const res = GET(new NextRequest('https://www.altidhjem.dk/app', { headers: { 'user-agent': iphone } }))
    expect(res.status).toBe(307)
  })

  it('stays on the host it was called on (preview deploys)', () => {
    const res = GET(new NextRequest('https://preview-abc.vercel.app/app'))
    expect(res.headers.get('location')).toBe('https://preview-abc.vercel.app/m/invite/header')
  })

  it('answers HEAD with the same redirect and no body', () => {
    const res = HEAD(new NextRequest('https://www.altidhjem.dk/app', { method: 'HEAD' }))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe('https://www.altidhjem.dk/m/invite/header')
    expect(res.body).toBeNull()
  })
})
