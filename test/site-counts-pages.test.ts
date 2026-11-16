import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { GUIDE_PATHS, pageGroup, parseSiteCount } from '@/lib/site-counts'

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

  it('is accepted by the count route only with a known group', () => {
    expect(parseSiteCount({ event: 'Page Visited', props: { page: 'guide' } })).toEqual({ event: 'Page Visited', props: { page: 'guide' } })
    expect(parseSiteCount({ event: 'Page Visited', props: { page: '/hvad-koster-indboforsikring' } })).toBeNull()
    expect(parseSiteCount({ event: 'Page Visited', props: {} })).toBeNull()
  })
})
