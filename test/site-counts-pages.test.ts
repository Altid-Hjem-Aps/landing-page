import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { GUIDE_PATHS, guideSlug, pageGroup, parseSiteCount, SITE_PAGES, sitePage } from '@/lib/site-counts'

// The cookie-free visit count (Page Visited) groups pages; a group must follow the site.
describe('pageGroup', () => {
  it('groups the new site’s pages', () => {
    expect(pageGroup('/')).toBe('front')
    expect(pageGroup('/hvad-koster-indboforsikring')).toBe('guide')
    expect(pageGroup('/hvad-koster-indboforsikring/')).toBe('guide')
    expect(pageGroup('/kontakt')).toBe('kontakt')
    expect(pageGroup('/presse')).toBe('presse')
    expect(pageGroup('/privatlivspolitik')).toBe('legal')
    expect(pageGroup('/slet-konto')).toBe('legal')
    expect(pageGroup('/bekraeft')).toBe('other')
  })

  it('lists every page built on the guide layout, so a new guide never lands as "other"', () => {
    const app = join(process.cwd(), 'app')
    const guides = readdirSync(app, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .filter((d) => {
        try {
          return readFileSync(join(app, d.name, 'page.tsx'), 'utf8').includes("from '@/components/site/Guide'")
        } catch {
          return false
        }
      })
      .map((d) => `/${d.name}`)
      .sort()
    expect([...GUIDE_PATHS].sort()).toEqual(guides)
  })

  it('is accepted by the count route only with a known group and a known page name', () => {
    const visit = { event: 'Page Visited', props: { page: 'guide', slug: 'hvad-koster-indboforsikring' } }
    expect(parseSiteCount(visit)).toEqual(visit)
    // A tab opened before the page name came (16 Nov) still counts, without one.
    expect(parseSiteCount({ event: 'Page Visited', props: { page: 'guide' } })).toEqual({ event: 'Page Visited', props: { page: 'guide' } })
    expect(parseSiteCount({ event: 'Page Visited', props: { slug: 'front' } })).toBeNull()
    expect(parseSiteCount({ event: 'Page Visited', props: { page: 'guide', slug: 'front', extra: 'x' } })).toBeNull()
    expect(parseSiteCount({ event: 'Page Visited', props: { page: '/hvad-koster-indboforsikring', slug: 'front' } })).toBeNull()
    expect(parseSiteCount({ event: 'Page Visited', props: { page: 'guide', slug: '/hvad-koster-indboforsikring' } })).toBeNull()
    expect(parseSiteCount({ event: 'Page Visited', props: { page: 'guide', slug: 'en-side-vi-ikke-har' } })).toBeNull()
    expect(parseSiteCount({ event: 'Page Visited', props: {} })).toBeNull()
  })
})

// ALT-1713: each guide by its own name, every other page by its group.
describe('sitePage and guideSlug', () => {
  it('name a guide by its path without the slash, with or without a trailing slash', () => {
    expect(sitePage('/billigste-elselskab')).toBe('billigste-elselskab')
    expect(sitePage('/billigste-elselskab/')).toBe('billigste-elselskab')
    expect(guideSlug('/madbudget')).toBe('madbudget')
  })

  it('name every other page by its group, and know no guide there', () => {
    expect(sitePage('/')).toBe('front')
    expect(sitePage('/kontakt')).toBe('kontakt')
    expect(sitePage('/slet-konto')).toBe('legal')
    expect(sitePage('/noget-andet')).toBe('other')
    expect(guideSlug('/')).toBeNull()
    expect(guideSlug('/kontakt')).toBeNull()
    expect(guideSlug(null)).toBeNull()
  })

  it('give every guide a name on the fixed list', () => {
    for (const path of GUIDE_PATHS) expect(SITE_PAGES).toContain(sitePage(path))
  })
})
