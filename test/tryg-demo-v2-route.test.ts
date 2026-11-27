// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/tryg-demo-v2/route'

// Risk: the deck opens without the password (or with a hand-typed cookie).

function login(password: string) {
  const body = new URLSearchParams({ password })
  return POST(new NextRequest('https://www.altidhjem.dk/tryg-demo-v2', { method: 'POST', body }))
}

function get(cookie?: string) {
  return GET(new NextRequest('https://www.altidhjem.dk/tryg-demo-v2', { headers: cookie ? { cookie } : {} }))
}

describe('/tryg-demo-v2 gate', () => {
  it('without a cookie: 401 login page, not the deck, noindex', async () => {
    const res = await get()
    const html = await res.text()
    expect(res.status).toBe(401)
    expect(html).toContain('name="password"')
    expect(html).not.toContain('Samtykke og forsikrings')
    expect(res.headers.get('x-robots-tag')).toContain('noindex')
  })

  it('wrong password: 401 with error and no cookie', async () => {
    const res = await login('nope')
    expect(res.status).toBe(401)
    expect(await res.text()).toContain('Forkert adgangskode')
    expect(res.headers.getSetCookie()).toHaveLength(0)
  })

  it('right password sets the cookie, and that cookie opens the deck', async () => {
    const res = await login('tryg2026')
    expect(res.status).toBe(303)
    const setCookie = res.headers.getSetCookie()[0]
    expect(setCookie).toContain('HttpOnly')
    expect(setCookie).toContain('Path=/tryg-demo-v2')

    const deck = await get(setCookie.split(';')[0])
    expect(deck.status).toBe(200)
    expect(await deck.text()).toContain('Samtykke og forsikrings')
  })

  it('a post without a form body gets the login page, not a 500', async () => {
    const res = await POST(new NextRequest('https://www.altidhjem.dk/tryg-demo-v2', { method: 'POST' }))
    expect(res.status).toBe(401)
    expect(await res.text()).toContain('Forkert adgangskode')
  })

  it('a hand-typed cookie does not open the deck', async () => {
    expect((await get('tryg_demo_v2_auth=granted')).status).toBe(401)
  })
})

describe('/tryg-demo-v2 is separate from V1', () => {
  it("V1's cookie does not open V2", async () => {
    const v1 = await (await import('@/app/tryg-demo/route')).POST(
      new NextRequest('https://www.altidhjem.dk/tryg-demo', { method: 'POST', body: new URLSearchParams({ password: 'tryg2026' }) }),
    )
    const v1Cookie = v1.headers.getSetCookie()[0].split(';')[0]
    expect((await get(v1Cookie)).status).toBe(401)
  })
})
