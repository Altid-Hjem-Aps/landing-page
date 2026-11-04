import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { PLATES } from '@/components/site/plates'
import { HJEM_HERO_CROP, PAINTING, SCREENS } from '@/components/site/screens'

const inPublic = (src: string) => `public${src}`

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
