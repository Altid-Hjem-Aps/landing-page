// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { GET, dynamic } from '@/app/guides.json/route'
import { GUIDE_PATHS } from '@/lib/site-counts'

// Risk: the admin's guide table and Homebase's SEO-kørsel (ALT-1715) miss a guide, list one twice,
// show one without a name or dates, or the list turns up in Google, when guides.json drifts. That
// each title and date is the one the page shows is checked on the rendered page in
// test/guide-checks.test.tsx.

describe('/guides.json', () => {
  it('lists exactly the guides in GUIDE_PATHS, in order, each with a title and dates, kept out of search', async () => {
    const res = GET()
    expect(dynamic).toBe('force-static')
    expect(res.headers.get('content-type')).toBe('application/json; charset=utf-8')
    expect(res.headers.get('x-robots-tag')).toBe('noindex')
    const { guides } = (await res.json()) as { guides: { path: string; title: string; published: string; updated: string }[] }
    expect(guides.map((g) => g.path)).toEqual([...GUIDE_PATHS])
    expect(guides.filter((g) => !g.title.trim()).map((g) => g.path)).toEqual([])
    const date = /^\d{4}-\d{2}-\d{2}$/
    expect(guides.filter((g) => !date.test(g.published) || !date.test(g.updated) || g.updated < g.published).map((g) => g.path)).toEqual([])
    // The guide's own question, not a blog card's teaser ("Lad Altid Hjem holde øje med elprisen for dig").
    expect(guides.find((g) => g.path === '/hvornar-er-strommen-billigst')?.title).toBe('Hvornår er strømmen billigst?')
  })
})
