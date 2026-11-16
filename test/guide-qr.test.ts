import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { GUIDE_SLUGS } from '@/lib/site-counts'
import { GUIDE_QR_SOURCES, guideQrImage, STORES, storeLink } from '@/lib/store-links'

// ALT-1713: every guide has its own four QR codes (the two store pills, the footer, the offer
// pop-up), made by scripts/site-assets.py guide-qr. The script writes what each code says to
// test/fixtures/guide-qr-links.json; a decode of every code against that file was run when they
// were made (16 Nov 2026). This test keeps the list, the files and the links in step: a new
// guide without its codes, or a changed store link, fails here.
const links: Record<string, string> = JSON.parse(readFileSync(join(process.cwd(), 'test/fixtures/guide-qr-links.json'), 'utf8'))

describe('the guides’ own QR codes', () => {
  it('exist for every guide, for both stores and both places, and for nothing else', () => {
    const expected = GUIDE_SLUGS.flatMap((g) => [...STORES, ...GUIDE_QR_SOURCES].map((n) => `${g}-${n}`)).sort()
    expect(Object.keys(links).sort()).toEqual(expected)
    for (const g of GUIDE_SLUGS) {
      for (const n of [...STORES, ...GUIDE_QR_SOURCES]) {
        expect(existsSync(join(process.cwd(), 'public', guideQrImage(g, n))), `${g}-${n}`).toBe(true)
      }
    }
  })

  it('say the guide’s own store link, or /qr with the place and the guide', () => {
    for (const g of GUIDE_SLUGS) {
      for (const store of STORES) expect(links[`${g}-${store}`]).toBe(storeLink(store, g))
      for (const src of GUIDE_QR_SOURCES) expect(links[`${g}-${src}`]).toBe(`https://www.altidhjem.dk/qr?src=${src}&g=${g}`)
    }
  })
})
