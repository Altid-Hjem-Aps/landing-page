import { describe, expect, it } from 'vitest'
import type { Metadata } from 'next'
import { GUIDE_PATHS } from '@/lib/site-counts'
import { SITE_IMAGE } from '@/lib/site-image'

// ALT-1839: a page's `openGraph` replaces the layout's whole, so a page that sets its own
// and forgets `images` is shared with no picture. Every SEO page and the front page carry it.
const PAGES = import.meta.glob<{ metadata: Metadata }>('../app/*/page.tsx')
const FRONT = import.meta.glob<{ metadata: Metadata }>('../app/page.tsx')

async function metadataOf(path: string): Promise<Metadata> {
  const load = path === '/' ? FRONT['../app/page.tsx'] : PAGES[`../app${path}/page.tsx`]
  if (!load) throw new Error(`no page file for ${path}`)
  return (await load()).metadata
}

describe('the link preview image', () => {
  it.each(['/', ...GUIDE_PATHS])('%s shares the site image with its alt text', async (path) => {
    const meta = await metadataOf(path)
    expect(meta.openGraph?.images, 'openGraph.images').toEqual([SITE_IMAGE])
    expect(meta.twitter?.images, 'twitter.images').toEqual([SITE_IMAGE])
    expect((meta.twitter as { card?: string } | undefined)?.card).toBe('summary_large_image')
  })

  it('points at the 1200 x 630 image with a description', () => {
    expect(SITE_IMAGE).toMatchObject({ url: '/opengraph-image.png?v=2', width: 1200, height: 630 })
    expect(SITE_IMAGE.alt.length).toBeGreaterThan(20)
  })
})
