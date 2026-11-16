import { describe, expect, it } from 'vitest'
import { storeLink } from '@/lib/store-links'
import { detectPlatform, PLATFORM_SCRIPT, type Platform } from '@/lib/platform'

// Store attribution is lost silently if a campaign parameter goes missing:
// the badge still works, the numbers just stop adding up.

describe('storeLink', () => {
  it('App Store link is the exact ALT-894 string', () => {
    expect(storeLink('appstore')).toBe(
      'https://apps.apple.com/dk/app/altid-hjem/id6794330094?pt=129212732&ct=ah_1_altidhjem_dk&mt=8',
    )
  })

  it('Google Play link is the exact ALT-894 string', () => {
    expect(storeLink('play')).toBe(
      'https://play.google.com/store/apps/details?id=dk.altidhjem.app&referrer=utm_source%3Daltidhjem_dk%26utm_campaign%3Dah_1_altidhjem_dk',
    )
  })
})

const DEVICES: { name: string; userAgent: string; maxTouchPoints: number; expected: Platform }[] = [
  {
    name: 'iPhone Safari',
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1',
    maxTouchPoints: 5,
    expected: 'ios',
  },
  {
    name: 'iPad on iPadOS (reports Macintosh)',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15',
    maxTouchPoints: 5,
    expected: 'ios',
  },
  {
    name: 'Mac Safari',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15',
    maxTouchPoints: 0,
    expected: 'desktop',
  },
  {
    name: 'Android Chrome',
    userAgent:
      'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36',
    maxTouchPoints: 5,
    expected: 'android',
  },
  {
    name: 'Android Chrome in desktop mode',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    maxTouchPoints: 5,
    expected: 'desktop',
  },
]

describe('detectPlatform', () => {
  it.each(DEVICES)('$name is $expected', ({ userAgent, maxTouchPoints, expected }) => {
    expect(detectPlatform(userAgent, maxTouchPoints)).toBe(expected)
  })
})

describe('PLATFORM_SCRIPT', () => {
  // The head script cannot import detectPlatform (it runs before any bundle),
  // so it repeats the rules. Running it against the same devices keeps the two
  // from drifting apart.
  it.each(DEVICES)('sets the same platform as detectPlatform for $name', ({ userAgent, maxTouchPoints }) => {
    const fakeDocument = { documentElement: { dataset: {} as Record<string, string> } }
    new Function('navigator', 'document', PLATFORM_SCRIPT)({ userAgent, maxTouchPoints }, fakeDocument)
    expect(fakeDocument.documentElement.dataset.platform).toBe(detectPlatform(userAgent, maxTouchPoints))
  })
})
