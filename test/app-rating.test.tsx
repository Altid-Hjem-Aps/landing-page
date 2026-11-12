import { afterEach, describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import AppRating, { readAppRating, ratingText } from '@/components/site/AppRating'

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

  it('renders what the App Store answers, stars filled to the average', async () => {
    answer(200, { results: [{ averageUserRating: 4.33333, userRatingCount: 6 }] })
    const { container } = render(await AppRating())
    expect(container).toHaveTextContent('4,3 ud af 5 i App Store · Over 4.000 danskere har appen')
    expect((container.querySelector('.h-stars') as HTMLElement).style.getPropertyValue('--fill')).toBe('86.6666%')
  })

  it('fails when the App Store answers with an error or without a rating', async () => {
    answer(503, {})
    await expect(readAppRating()).rejects.toThrow('App Store lookup answered 503')
    answer(200, { results: [] })
    await expect(readAppRating()).rejects.toThrow('App Store lookup has no rating')
  })

  it('writes the average the Danish way, to one decimal', () => {
    expect(ratingText({ average: 4.75 })).toBe('4,8 ud af 5 i App Store · Over 4.000 danskere har appen')
    expect(ratingText({ average: 5 })).toBe('5 ud af 5 i App Store · Over 4.000 danskere har appen')
  })
})
