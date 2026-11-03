import { describe, expect, it } from 'vitest'
import { detectStorePlatform, googlePlayUrl, GOOGLE_PLAY_URL } from '@/lib/store-links'

const TOKEN = 'A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8S9t0U_-'

describe('detectStorePlatform', () => {
  it.each([
    ['iPhone', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Mobile/15E148', 5, 'ios'],
    ['iPad with its own UA', 'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) Mobile/15E148', 5, 'ios'],
    ['iPadOS posing as a Mac', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15', 5, 'ios'],
    ['Android phone', 'Mozilla/5.0 (Linux; Android 15; Pixel 9) Chrome/130.0 Mobile Safari/537.36', 5, 'android'],
    ['Mac without touch', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15', 0, 'other'],
    ['Windows', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0 Safari/537.36', 0, 'other'],
  ])('%s', (_name, userAgent, maxTouchPoints, expected) => {
    expect(detectStorePlatform({ userAgent, maxTouchPoints })).toBe(expected)
  })
})

describe('googlePlayUrl', () => {
  it('carries the invite as an encoded install referrer', () => {
    expect(googlePlayUrl(TOKEN)).toBe(`${GOOGLE_PLAY_URL}&referrer=invite_token%3D${TOKEN}`)
  })

  it.each([
    ['no token', null],
    ['too short', 'abc'],
    ['43 characters with a symbol', `${TOKEN.slice(0, 42)}&`],
    ['a second referrer parameter smuggled in', `${TOKEN}&utm_source=x`],
  ])('links plain Google Play for %s', (_name, token) => {
    expect(googlePlayUrl(token)).toBe(GOOGLE_PLAY_URL)
  })
})
