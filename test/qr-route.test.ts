import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, HEAD } from '@/app/qr/route'

// www.altidhjem.dk/qr is the front page's one QR code. Risk: a phone lands in the wrong store,
// a computer is sent to a store it cannot install from, or the redirect is cached so the next
// phone gets the previous phone's store.

// Literal on purpose, not built from lib/store-links.
const APP_STORE = 'https://apps.apple.com/dk/app/altid-hjem/id6794330094?pt=129212732&ct=ah_1_altidhjem_dk&mt=8'
const PLAY =
  'https://play.google.com/store/apps/details?id=dk.altidhjem.app&referrer=utm_source%3Daltidhjem_dk%26utm_campaign%3Dah_1_altidhjem_dk'

const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
const ANDROID = 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36'
const DESKTOP = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
const IPAD = 'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
// iPadOS Safari asks for the desktop site by default and then sends a Mac user agent.
const IPAD_DESKTOP_MODE = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15'

const get = (userAgent?: string) =>
  GET(new NextRequest('https://www.altidhjem.dk/qr', { headers: userAgent ? { 'user-agent': userAgent } : {} }))

describe('/qr', () => {
  it('sends an iPhone to the App Store with the site campaign', () => {
    const res = get(IPHONE)
    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toBe(APP_STORE)
  })

  it('sends an Android phone to Google Play with the site campaign', () => {
    const res = get(ANDROID)
    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toBe(PLAY)
  })

  it('sends a computer, or a request with no user agent, to the store buttons on the front page', () => {
    for (const userAgent of [DESKTOP, undefined]) {
      const res = get(userAgent)
      expect(res.status).toBe(302)
      expect(res.headers.get('location')).toBe('https://www.altidhjem.dk/#hent-appen')
    }
  })

  it('sends an iPad that says it is an iPad to the App Store', () => {
    const res = get(IPAD)
    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toBe(APP_STORE)
  })

  it('sends an iPad in desktop mode to the store buttons, as a computer: the server sees no touch screen', () => {
    const res = get(IPAD_DESKTOP_MODE)
    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toBe('https://www.altidhjem.dk/#hent-appen')
  })

  it('keeps the redirect out of search engines', () => {
    for (const userAgent of [IPHONE, ANDROID, DESKTOP, undefined]) {
      expect(get(userAgent).headers.get('x-robots-tag')).toBe('noindex, nofollow')
    }
    const head = HEAD(new NextRequest('https://www.altidhjem.dk/qr', { method: 'HEAD', headers: { 'user-agent': IPHONE } }))
    expect(head.headers.get('x-robots-tag')).toBe('noindex, nofollow')
  })

  it('is never cached, and says the answer depends on the user agent', () => {
    for (const userAgent of [IPHONE, ANDROID, DESKTOP]) {
      const res = get(userAgent)
      expect(res.headers.get('cache-control')).toBe('no-store')
      expect(res.headers.get('vary')).toBe('User-Agent')
    }
  })

  it('answers HEAD with the same redirect and no body', () => {
    const res = HEAD(new NextRequest('https://www.altidhjem.dk/qr', { method: 'HEAD', headers: { 'user-agent': ANDROID } }))
    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toBe(PLAY)
    expect(res.body).toBeNull()
  })
})
