// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { GET, dynamic } from '@/app/privatlivspolitik.json/route'
import { COOKIE_SETTINGS_URL, parseInline, privacyPolicy, type PolicyBlock } from '@/lib/privacyPolicy'

// Risk: the app's native policy sheet breaks (or shows a different text) when
// the JSON drifts from the contract or from the page's data.

function texts(block: PolicyBlock): string[] {
  switch (block.type) {
    case 'paragraph':
    case 'label':
      return [block.text]
    case 'list':
      return block.items.map((item) => item.text)
    case 'address':
      return block.lines
    default:
      throw new Error(`Unknown block type: ${JSON.stringify(block)}`)
  }
}

describe('/privatlivspolitik.json', () => {
  it('serves the policy module as static JSON', async () => {
    const res = await GET()
    expect(dynamic).toBe('force-static')
    expect(res.headers.get('content-type')).toBe('application/json; charset=utf-8')
    expect(await res.json()).toEqual(privacyPolicy)
  })

  it('matches the contract the app is built against', async () => {
    const body: typeof privacyPolicy = await (await GET()).json()
    expect(body.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(body.sections.length).toBeGreaterThan(0)
    for (const section of body.sections) {
      expect(section.title).toMatch(/^\d+\. /)
      for (const block of section.blocks) {
        for (const text of texts(block)) {
          for (const segment of parseInline(text)) {
            if ('url' in segment) expect(segment.url).toMatch(new RegExp(`^(https://|mailto:|${COOKIE_SETTINGS_URL}$)`))
          }
        }
        if (block.type === 'list') {
          for (const item of block.items) expect(item.label ?? '').not.toContain('](')
        }
      }
    }
  })
})
