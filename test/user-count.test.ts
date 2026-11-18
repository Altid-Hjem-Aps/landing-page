import { afterEach, describe, expect, it, vi } from 'vitest'
import GuideOfferPopup from '@/components/site/GuideOfferPopup'
import { readUserCount, usersOver, usersPlus } from '@/lib/user-count'

afterEach(() => {
  vi.unstubAllGlobals()
})

const answer = (status: number, body: unknown) => vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(body), { status })))
describe('user count', () => {
  it('reads the one public number from the admin, refreshed at most once an hour', async () => {
    answer(200, { users: 4741 })
    expect(await readUserCount()).toBe(4741)
    const [url, init] = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(url).toBe('https://admin.altidhjem.dk/api/public/app-users')
    expect(init).toMatchObject({ next: { revalidate: 3600 } })
    expect(init.headers).toBeUndefined()
  })

  it('fails on an error answer or an answer without a count', async () => {
    answer(503, { error: 'service unavailable' })
    await expect(readUserCount()).rejects.toThrow('Users count answered 503')
    answer(200, { users: null })
    await expect(readUserCount()).rejects.toThrow('Users count is not a number')
  })

  it('fails on a count that cannot be true: zero, a fraction, a string, or no users key', async () => {
    for (const body of [{ users: 0 }, { users: -3 }, { users: 4741.5 }, { users: '4741' }, {}, { count: 4741 }]) {
      answer(200, body)
      await expect(readUserCount(), JSON.stringify(body)).rejects.toThrow('Users count is not a number')
    }
  })

  it.each([
    [5000, '5.000'],
    [5295, '5.000'],
    [9999, '5.000'],
    [10000, '10.000'],
    [14999, '10.000'],
    [15000, '15.000'],
  ])('shows %i as %s+', (count, shown) => {
    expect(usersPlus(count)).toBe(shown)
  })

  it.each([
    [5001, '5.000'],
    [5295, '5.000'],
    [10000, '5.000'],
    [10001, '10.000'],
    [15000, '10.000'],
    [15001, '15.000'],
  ])('shows %i as over %s, which stays true at an exact step', (count, shown) => {
    expect(usersOver(count)).toBe(shown)
  })

  it('fails rather than show 0 under the first step', () => {
    expect(() => usersPlus(4999)).toThrow('Users count 4999 has no step of 5000 to show')
    expect(() => usersOver(5000)).toThrow('Users count 5000 has no step of 5000 to show')
  })

  it('gives the guides\' offer popup the step reached', async () => {
    answer(200, { users: 10000 })
    const popup = await GuideOfferPopup({ after: 0.5 })
    expect(popup.props.proof).toBe('10.000+ danskere har allerede appen')
  })
})
