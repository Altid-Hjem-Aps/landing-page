import { afterEach, describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import AppRating, { readAppRating, ratingText, starFill } from '@/components/site/AppRating'

// The user count has its own test (test/user-count.test.ts); here it is a fixed count.
vi.mock('@/lib/user-count', async (original) => ({
  ...(await original<typeof import('@/lib/user-count')>()),
  readUserCount: async () => 10000,
}))

afterEach(() => vi.unstubAllGlobals())

const answer = (status: number, body: unknown) => vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(body), { status })))

describe('App Store rating', () => {
  it('reads the Danish App Store and refreshes at most once an hour', async () => {
    answer(200, { results: [{ averageUserRating: 4.33333, userRatingCount: 6 }] })
    expect(await readAppRating()).toEqual({ average: 4.33333 })
    const [url, init] = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(url).toBe('https://itunes.apple.com/lookup?id=6794330094&country=dk')
    expect(init).toMatchObject({ next: { revalidate: 3600 } })
    expect(init.signal).toBeInstanceOf(AbortSignal)
  })

  it('renders the stars filled to the real rating, the figure only in their name, then the user count', async () => {
    answer(200, { results: [{ averageUserRating: 4.5, userRatingCount: 8 }] })
    const { container } = render(await AppRating())
    expect(container).toHaveTextContent(/^10\.000\+ danskere har allerede appen$/)
    const stars = container.querySelector('.h-stars') as HTMLElement
    expect(stars).toHaveAttribute('role', 'img')
    expect(stars).toHaveAccessibleName('4,5 ud af 5 stjerner i App Store')
    expect(stars.style.getPropertyValue('--fill')).toBe(starFill(4.5))
  })

  it('fills five whole stars at 5,0', async () => {
    answer(200, { results: [{ averageUserRating: 5, userRatingCount: 9 }] })
    const { container } = render(await AppRating())
    expect((container.querySelector('.h-stars') as HTMLElement).style.getPropertyValue('--fill')).toBe('100%')
  })

  it('below 4,5 keeps the stars at 4,5, the real rating in their name', async () => {
    answer(200, { results: [{ averageUserRating: 4.2, userRatingCount: 10 }] })
    const { container } = render(await AppRating())
    const stars = container.querySelector('.h-stars') as HTMLElement
    expect(stars).toHaveAccessibleName('4,2 ud af 5 stjerner i App Store')
    expect(stars.style.getPropertyValue('--fill')).toBe(starFill(4.5))
  })

  it('fills the stars to the drawn stars, not the row: 4,5 is half of the fifth star', () => {
    // The mask draws stars 17,4 px wide every 22 px in a 106 px row.
    expect(starFill(4.5)).toBe('91.51%') // 88 + 0,3 + 8,7 = 97 px
    expect(starFill(4)).toBe('83.02%') // 88 px, the gap before the fifth star
    expect(starFill(5)).toBe('100%')
  })

  it('fails when the App Store answers with an error or without a rating', async () => {
    answer(503, {})
    await expect(readAppRating()).rejects.toThrow('App Store lookup answered 503')
    answer(200, { results: [] })
    await expect(readAppRating()).rejects.toThrow('App Store lookup has no rating')
  })

  it('names the stars with the average written the Danish way, to one decimal', () => {
    expect(ratingText({ average: 4.75 })).toBe('4,8 ud af 5 stjerner i App Store')
    expect(ratingText({ average: 5 })).toBe('5,0 ud af 5 stjerner i App Store')
  })
})
