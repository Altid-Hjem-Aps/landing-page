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
      disallow: ['/api/', '/preview/', '/r/', '/betaling-retur'],
    })
  })

  it('points crawlers at the production sitemap', () => {
    expect(robots().sitemap).toBe('https://www.altidhjem.dk/sitemap.xml')
  })
})

describe('sitemap.xml', () => {
  it('lists every public page on the production domain', () => {
    const urls = sitemap().map((entry) => entry.url)
    expect(urls).toEqual([
      'https://www.altidhjem.dk/',
      'https://www.altidhjem.dk/spiir-alternativ',
      'https://www.altidhjem.dk/hvornar-er-strommen-billigst',
      'https://www.altidhjem.dk/hvad-koster-forsikring',
      'https://www.altidhjem.dk/billigste-mobilabonnement',
      'https://www.altidhjem.dk/hvad-koster-en-ladeboks',
      'https://www.altidhjem.dk/hvad-koster-en-tyverialarm',
      'https://www.altidhjem.dk/hvad-koster-indboforsikring',
      'https://www.altidhjem.dk/billigste-elselskab',
      'https://www.altidhjem.dk/opsig-abonnementer',
      'https://www.altidhjem.dk/gennemsnitligt-elforbrug',
      'https://www.altidhjem.dk/bedste-budget-app',
      'https://www.altidhjem.dk/skift-forsikringsselskab',
      'https://www.altidhjem.dk/madbudget',
      'https://www.altidhjem.dk/billigste-supermarked',
      'https://www.altidhjem.dk/madbudget-familie-paa-4',
      'https://www.altidhjem.dk/mad-for-3000-om-maaneden',
      'https://www.altidhjem.dk/madplan-efter-tilbud',
      'https://www.altidhjem.dk/madpakker-paa-budget',
      'https://www.altidhjem.dk/spar-penge-paa-dagligvarer',
      'https://www.altidhjem.dk/graensehandel-beregner',
      'https://www.altidhjem.dk/jul-paa-budget',
      'https://www.altidhjem.dk/presse',
      'https://www.altidhjem.dk/kontakt',
      'https://www.altidhjem.dk/privatlivspolitik',
      'https://www.altidhjem.dk/slet-konto',
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
    const home = sitemap().find((entry) => entry.url === 'https://www.altidhjem.dk/')
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

  it('temporarily redirects /madrapport to the Mad report before the apex-to-www rule', async () => {
    const redirects = await nextConfig.redirects!()
    const madrapport = {
      source: '/madrapport',
      destination: 'https://altidmad.dk/altid-mad-kvartalsrapport-q3.pdf',
      permanent: false,
    }
    expect(redirects).toContainEqual(madrapport)
    const apexRule = redirects.findIndex((r) =>
      r.has?.some((h) => h.type === 'host' && h.value === 'altidhjem.dk'),
    )
    expect(apexRule).toBeGreaterThanOrEqual(0)
    expect(redirects.findIndex((r) => r.source === '/madrapport')).toBeLessThan(apexRule)
  })

  // www is the one canonical host; a temporary apex redirect would contradict every canonical
  // and the sitemap, and would put a second hop behind the old altidmad.dk redirects.
  it('permanently redirects the apex host to www, every path but .well-known and /api', async () => {
    const redirects = await nextConfig.redirects!()
    const apexRules = redirects.filter((r) => r.has?.some((h) => h.type === 'host' && h.value === 'altidhjem.dk'))
    expect(apexRules.map((r) => r.source).sort()).toEqual(['/', '/:path((?!\\.well-known|api/).+)'])
    for (const rule of apexRules) {
      expect(rule.permanent).toBe(true)
      expect(rule.destination.startsWith('https://www.altidhjem.dk/')).toBe(true)
    }
  })
})

describe('canonical host', () => {
  it('points every sitemap entry and the robots sitemap at www', () => {
    expect(sitemap().every((entry) => entry.url.startsWith('https://www.altidhjem.dk/'))).toBe(true)
    expect(robots().sitemap).toBe('https://www.altidhjem.dk/sitemap.xml')
  })
})

describe('apex rule, as Next matches it', () => {
  it('sends pages to www but leaves .well-known and /api on the apex', async () => {
    // Next's own matcher, so the test matches what Next matches. It ships without types.
    const PATH_TO_REGEXP = 'next/dist/compiled/path-to-regexp'
    const { pathToRegexp } = (await import(/* @vite-ignore */ PATH_TO_REGEXP)) as { pathToRegexp: (source: string) => RegExp }
    const redirects = await nextConfig.redirects!()
    const rule = redirects.find((r) => r.source.startsWith('/:path') && r.has?.some((h) => h.type === 'host' && h.value === 'altidhjem.dk'))!
    const re = pathToRegexp(rule.source)
    expect(re.test('/madbudget')).toBe(true)
    expect(re.test('/hvad-koster-forsikring')).toBe(true)
    expect(re.test('/.well-known/apple-app-site-association')).toBe(false)
    expect(re.test('/api/unsubscribe')).toBe(false)
  })
})

// Google Search Console verifies https://www.altidhjem.dk/ by this tag (ALT-1713): if it goes,
// the team loses Search Console.
describe('Search Console ownership', () => {
  it('keeps the Google verification tag on every page', async () => {
    const { metadata } = await import('@/app/layout')
    expect(metadata.verification?.google).toBe('F2QceHS2iUXU9-KrN8WbnRhFYgBUtxtzeNTwGpEzbrE')
  })
})
