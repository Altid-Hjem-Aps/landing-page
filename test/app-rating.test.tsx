import { afterEach, describe, expect, it, vi } from 'vitest'
import { readAppRating, ratingText } from '@/components/site/AppRating'

afterEach(() => vi.unstubAllGlobals())

const answer = (status: number, body: unknown) => vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(body), { status })))

describe('App Store rating', () => {
  it('reads the Danish App Store and refreshes at most once an hour', async () => {
    answer(200, { results: [{ averageUserRating: 4.33333, userRatingCount: 6 }] })
    expect(await readAppRating()).toEqual({ average: 4.33333, count: 6 })
    const [url, init] = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(url).toBe('https://itunes.apple.com/lookup?id=6794330094&country=dk')
    expect(init).toEqual({ next: { revalidate: 3600 } })
  })

  it('fails when the App Store answers with an error or without a rating', async () => {
    answer(503, {})
    await expect(readAppRating()).rejects.toThrow('App Store lookup answered 503')
    answer(200, { results: [] })
    await expect(readAppRating()).rejects.toThrow('App Store lookup has no rating')
  })

  it('writes the numbers the Danish way, one rating in the singular', () => {
    expect(ratingText({ average: 4.75, count: 1 }).line).toBe('4,8 ud af 5 · 1 bedømmelse i App Store')
    expect(ratingText({ average: 5, count: 1200 }).line).toBe('5 ud af 5 · 1200 bedømmelser i App Store')
  })
})
