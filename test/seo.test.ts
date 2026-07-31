import { describe, expect, it } from 'vitest'
import robots from '@/app/robots'
import sitemap from '@/app/sitemap'
import nextConfig from '@/next.config'

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
      'https://altidhjem.dk/hvornar-er-strommen-billigst',
      'https://altidhjem.dk/hvad-koster-forsikring',
      'https://altidhjem.dk/billigste-mobilabonnement',
      'https://altidhjem.dk/hvad-koster-en-ladeboks',
      'https://altidhjem.dk/hvad-koster-en-tyverialarm',
      'https://altidhjem.dk/hvad-koster-indboforsikring',
      'https://altidhjem.dk/billigste-elselskab',
      'https://altidhjem.dk/opsig-abonnementer',
      'https://altidhjem.dk/gennemsnitligt-elforbrug',
      'https://altidhjem.dk/bedste-budget-app',
      'https://altidhjem.dk/skift-forsikringsselskab',
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

describe('redirects', () => {
  it('permanently redirects the old /elpriser slug to the new SEO slug', async () => {
    const redirects = await nextConfig.redirects!()
    expect(redirects).toContainEqual({
      source: '/elpriser',
      destination: '/hvornar-er-strommen-billigst',
      permanent: true,
    })
  })
})
