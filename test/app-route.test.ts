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
