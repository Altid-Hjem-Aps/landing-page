import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { PLATES } from '@/components/site/plates'
import { HJEM_HERO_CROP, PAINTING, QR_CODES, SCREENS } from '@/components/site/screens'
import { storeLink } from '@/lib/store-links'

const inPublic = (src: string) => `public${src}`

describe('QR codes', () => {
  // Scanned once with a real decoder when generated (see components/site/screens.ts).
  // The generator is not in the repo, so this catches links changing under them:
  // a printed or shown code would go on working with the old attribution.
  it.each([
    ['appstore', QR_CODES.appstore.src],
    ['play', QR_CODES.play.src],
  ] as const)('%s holds the exact store link', (store, src) => {
    const desc = /<desc>(.*?)<\/desc>/.exec(readFileSync(inPublic(src), 'utf8'))?.[1]
    expect(desc?.replaceAll('&amp;', '&')).toBe(storeLink(store))
  })
})

describe('picture files', () => {
  it('every screen and painting in the data file exists', () => {
    const files = [...Object.values(SCREENS), HJEM_HERO_CROP, PAINTING.line, PAINTING.colour].map((s) => s.src)
    expect(files.filter((src) => !existsSync(inPublic(src)))).toEqual([])
  })

  it('every plate exists, under its full dish name', () => {
    expect(PLATES).toHaveLength(26)
    const files = PLATES.flatMap((p) => (p.src800 ? [p.src, p.src800] : [p.src]))
    expect(files.filter((src) => !existsSync(inPublic(src)))).toEqual([])
    expect(PLATES.find((p) => p.slug === 'butter-chicken')?.name).toBe('Butter chicken med ris og naan')
  })
})
