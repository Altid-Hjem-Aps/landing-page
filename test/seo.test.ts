import { describe, expect, it } from 'vitest'
import robots from '@/app/robots'
import sitemap from '@/app/sitemap'

describe('robots.txt', () => {
  it('allows crawling of the site but blocks api and preview paths', () => {
    const result = robots()
    expect(result.rules).toEqual({
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/preview/'],
    })
  })

  it('points crawlers at the production sitemap', () => {
    expect(robots().sitemap).toBe('https://altidhjem.dk/sitemap.xml')
  })
})

describe('sitemap.xml', () => {
  it('lists every public page on the production domain', () => {
    const urls = sitemap().map((entry) => entry.url)
    expect(urls).toEqual([
      'https://altidhjem.dk/',
      'https://altidhjem.dk/spiir-alternativ',
      'https://altidhjem.dk/hvad-koster-forsikring',
      'https://altidhjem.dk/kontakt',
      'https://altidhjem.dk/privatlivspolitik',
      'https://altidhjem.dk/slet-konto',
    ])
  })

  it('does not list any path robots.txt disallows', () => {
    const disallowed = ['/api/', '/preview/']
    for (const { url } of sitemap()) {
      const path = new URL(url).pathname
      expect(disallowed.some((d) => path.startsWith(d))).toBe(false)
    }
  })

  it('gives the front page top priority', () => {
    const home = sitemap().find((entry) => entry.url === 'https://altidhjem.dk/')
    expect(home?.priority).toBe(1)
  })
})
