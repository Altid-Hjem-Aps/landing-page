import { afterEach, describe, expect, it, vi } from 'vitest'
import { readUserCount, usersHundreds, usersThousands } from '@/lib/user-count'

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

  it('rounds down to the hundred, and to the thousand that "over" stays true for', () => {
    expect(usersHundreds(4741)).toBe('4.700')
    expect(usersThousands(4741)).toBe('4.000')
    expect(usersThousands(5000)).toBe('4.000')
    expect(usersThousands(5001)).toBe('5.000')
  })
})
