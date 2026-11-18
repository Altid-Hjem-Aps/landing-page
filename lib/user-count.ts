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

// The site's number moves only when the count passes another 5.000: 5.000, 10.000, 15.000.
const STEP = 5000

const stepReached = (n: number) => Math.floor(n / STEP) * STEP

// Under the first step there is no number to show, and "0+ danskere" must never reach the page.
// The same goes for "over" at exactly 5.000. Failing here fails the build and keeps the page
// already live, as a failed read does.
function shown(reached: number, count: number) {
  if (reached === 0) throw new Error(`Users count ${count} has no step of ${STEP} to show`)
  return danish(reached)
}

/** For "5.000+": the step reached, so 9.999 reads "5.000" and 10.000 reads "10.000". */
export const usersPlus = (n: number) => shown(stepReached(n), n)

/** For "over 5.000": the step below the count, so "over" stays true. 10.000 still reads "5.000",
 * and 10.001 reads "10.000". */
export const usersOver = (n: number) => shown(stepReached(n - 1), n)
