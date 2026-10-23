// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/tryg-demo/route'

// Risk: the deck opens without the password (or with a hand-typed cookie).

function login(password: string) {
  const body = new URLSearchParams({ password })
  return POST(new NextRequest('https://www.altidhjem.dk/tryg-demo', { method: 'POST', body }))
}

function get(cookie?: string) {
  return GET(new NextRequest('https://www.altidhjem.dk/tryg-demo', { headers: cookie ? { cookie } : {} }))
}

describe('/tryg-demo gate', () => {
  it('without a cookie: 401 login page, not the deck, noindex', async () => {
    const res = await get()
    const html = await res.text()
    expect(res.status).toBe(401)
    expect(html).toContain('name="password"')
    expect(html).not.toContain('Altid Hjem Demo')
    expect(res.headers.get('x-robots-tag')).toContain('noindex')
  })

  it('wrong password: 401 with error and no cookie', async () => {
    const res = await login('nope')
    expect(res.status).toBe(401)
    expect(await res.text()).toContain('Forkert adgangskode')
    expect(res.headers.getSetCookie()).toHaveLength(0)
  })

  it('right password sets the cookie, and that cookie opens the deck', async () => {
    const res = await login('tryg')
    expect(res.status).toBe(303)
    const setCookie = res.headers.getSetCookie()[0]
    expect(setCookie).toContain('HttpOnly')
    expect(setCookie).toContain('Path=/tryg-demo')

    const deck = await get(setCookie.split(';')[0])
    expect(deck.status).toBe(200)
    expect(await deck.text()).toContain('Altid Hjem Demo')
  })

  it('a hand-typed cookie does not open the deck', async () => {
    expect((await get('tryg_demo_auth=granted')).status).toBe(401)
  })
})
