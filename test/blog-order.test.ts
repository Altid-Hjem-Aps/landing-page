import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

// The front page's blog cards should show the visitor different services (Thor, 16 Nov 2026):
// never a row of one service, and the first cards one of each.
const src = fs.readFileSync(path.join(process.cwd(), 'components/sections/Blog.tsx'), 'utf-8')
const posts = src.slice(src.indexOf('const POSTS'), src.indexOf('\n]', src.indexOf('const POSTS')))
const categories = [...posts.matchAll(/category: '([^']+)'/g)].map((m) => m[1])

describe('blog card order', () => {
  it('never puts two cards of the same service side by side', () => {
    for (let i = 1; i < categories.length; i++) {
      expect(categories[i], `cards ${i} and ${i + 1}`).not.toBe(categories[i - 1])
    }
  })

  it('opens with one card of every service', () => {
    const services = new Set(categories)
    expect(new Set(categories.slice(0, services.size)).size).toBe(services.size)
  })
})
