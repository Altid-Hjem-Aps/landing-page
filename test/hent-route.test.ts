import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, HEAD } from '@/app/hent/route'

// www.altidhjem.dk/hent is the link in Werner's public LinkedIn post for the
// hard launch (ALT-1348). Risk: it stops reaching the tracked store link
// /m/li-werner/header, carries query junk along, gets cached so later taps skip
// the counter, or LinkedIn draws Apple's App Store card on the post.
describe('/hent', () => {
  it('sends everyone to /m/li-werner/header with a 307, dropping any query, never cached', () => {
    const res = GET(new NextRequest('https://www.altidhjem.dk/hent?utm_source=x&trk=y'))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe('https://www.altidhjem.dk/m/li-werner/header')
    expect(res.headers.get('cache-control')).toBe('no-store')
    expect(res.headers.get('x-robots-tag')).toBe('noindex, nofollow')
    expect(res.headers.get('vary')).toBe('User-Agent')
  })

  it('gives LinkedIn and other link previews an Altid Hjem card instead of following on to the App Store', async () => {
    for (const ua of ['LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)', 'WhatsApp/2.24.1 A']) {
      const res = GET(new NextRequest('https://www.altidhjem.dk/hent', { headers: { 'user-agent': ua } }))
      expect(res.status, ua).toBe(200)
      const html = await res.text()
      expect(html).toContain('<meta property="og:title" content="Hent Altid Hjem">')
      expect(html).toContain('<meta property="og:url" content="https://www.altidhjem.dk/hent">')
      expect(html).toContain(
        '<meta property="og:description" content="Mad, strøm, forsikring og økonomi i ét overblik. Det er gratis at komme i gang.">',
      )
      expect(html).toContain('<meta property="og:image" content="https://www.altidhjem.dk/opengraph-image.png">')
      expect(html).not.toContain('apps.apple.com')
      expect(res.headers.get('vary')).toBe('User-Agent')
      expect(res.headers.get('cache-control')).toBe('no-store')
    }
  })

  it('still redirects a phone browser, the LinkedIn app included', () => {
    const iphone = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1'
    const linkedinApp = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [LinkedInApp]/9.30.1'
    for (const ua of [iphone, linkedinApp]) {
      const res = GET(new NextRequest('https://www.altidhjem.dk/hent', { headers: { 'user-agent': ua } }))
      expect(res.status, ua).toBe(307)
      expect(res.headers.get('location')).toBe('https://www.altidhjem.dk/m/li-werner/header')
    }
  })

  it('stays on the host it was called on (preview deploys)', () => {
    const res = GET(new NextRequest('https://preview-abc.vercel.app/hent'))
    expect(res.headers.get('location')).toBe('https://preview-abc.vercel.app/m/li-werner/header')
  })

  it('answers HEAD with the same redirect and no body', () => {
    const res = HEAD(new NextRequest('https://www.altidhjem.dk/hent', { method: 'HEAD' }))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe('https://www.altidhjem.dk/m/li-werner/header')
    expect(res.body).toBeNull()
    expect(res.headers.get('vary')).toBe('User-Agent')
  })

  it('answers a HEAD from LinkedIn\'s crawler with the card status and no body, never cached', () => {
    const res = HEAD(
      new NextRequest('https://www.altidhjem.dk/hent', {
        method: 'HEAD',
        headers: { 'user-agent': 'LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)' },
      }),
    )
    expect(res.status).toBe(200)
    expect(res.body).toBeNull()
    expect(res.headers.get('cache-control')).toBe('no-store')
    expect(res.headers.get('vary')).toBe('User-Agent')
  })
})
