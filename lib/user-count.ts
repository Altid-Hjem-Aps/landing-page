// How many people have the app, read live for the front page: the Altid Energi customers who
// have logged into the app at least once plus the Altid Hjem accounts without Altid Energi.
// The admin works it out and answers it as one number at a public address with no key
// (admin: app/api/public/app-users), so the site holds no secret for it. Read at build and
// again at most once an hour. A failed read fails the build; a failed hourly refresh keeps
// the page it already has, as the App Store rating does (AppRating.tsx).
const USERS_URL = 'https://admin.altidhjem.dk/api/public/app-users'

export async function readUserCount(): Promise<number> {
  const res = await fetch(USERS_URL, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(20_000) })
  if (!res.ok) throw new Error(`Users count answered ${res.status}`)
  const { users } = await res.json()
  if (!Number.isInteger(users) || users <= 0) throw new Error(`Users count is not a number: ${JSON.stringify(users)}`)
  return users
}

const danish = (n: number) => n.toLocaleString('da-DK')

/** Rounded down to the hundred: 4.741 reads "4.700". */
export const usersHundreds = (n: number) => danish(Math.floor(n / 100) * 100)

/** The whole thousand below the count, so "over" stays true: 4.741 reads "4.000", 5.000
 * still reads "4.000", and 5.001 reads "5.000". */
export const usersThousands = (n: number) => danish(Math.floor((n - 1) / 1000) * 1000)
