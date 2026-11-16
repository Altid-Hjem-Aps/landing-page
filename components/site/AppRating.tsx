import { APP_STORE_ID } from '@/lib/store-links'
import { readUserCount, usersHundreds } from '@/lib/user-count'
import { HERO } from './copy'

// The app's rating in the Danish App Store, read at build and again at most once an hour.
// A failed lookup fails the build; a failed hourly refresh keeps the page it already has.
const LOOKUP = `https://itunes.apple.com/lookup?id=${APP_STORE_ID}&country=dk`

export type Rating = { average: number }

export async function readAppRating(): Promise<Rating> {
  const res = await fetch(LOOKUP, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(10_000) })
  if (!res.ok) throw new Error(`App Store lookup answered ${res.status}`)
  const app = (await res.json()).results?.[0]
  if (typeof app?.averageUserRating !== 'number') {
    throw new Error('App Store lookup has no rating')
  }
  return { average: app.averageUserRating }
}

// The stars' name for screen readers, with the rating written the Danish way to one decimal.
export function ratingText({ average }: Rating) {
  return HERO.ratingStars.replace('{average}', (Math.round(average * 10) / 10).toLocaleString('da-DK'))
}

// The stars show at least 4,5 for now (Thor 13/11: the real 4,3 comes from 6 ratings; more
// ratings are being collected, then the fill follows the App Store again). A higher real
// average shows as it is. The stars' name for screen readers keeps the real figure.
const SHOWN_AT_LEAST = 4.5

// Five stars, filled as far as the shown average reaches, then the user count. The number itself
// is only in the stars' name, so screen readers still hear it.
export function RatingLine({ rating, users }: { rating: Rating; users: number }) {
  return (
    <p className="h-rating">
      <span className="h-stars" role="img" aria-label={ratingText(rating)} style={{ '--fill': `${(Math.max(rating.average, SHOWN_AT_LEAST) / 5) * 100}%` } as React.CSSProperties} />
      <span className="h-rating-text">{HERO.rating.replace('{hundreds}', usersHundreds(users))}</span>
    </p>
  )
}

export default async function AppRating() {
  const [rating, users] = await Promise.all([readAppRating(), readUserCount()])
  return <RatingLine rating={rating} users={users} />
}
