import { APP_STORE_ID } from '@/lib/store-links'
import { readUserCount, usersPlus } from '@/lib/user-count'
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

// The rating as the App Store writes it: one decimal, the Danish way (4,5, and 5,0).
function shown({ average }: Rating) {
  return Math.round(average * 10) / 10
}
function averageText(rating: Rating) {
  return shown(rating).toLocaleString('da-DK', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

// The stars' name for screen readers.
export function ratingText(rating: Rating) {
  return HERO.ratingStars.replace('{average}', averageText(rating))
}

// The stars show at least 4,5 for now (Thor 13/11: the real 4,3 came from 6 ratings; more are
// being collected). A higher real average shows as it is. The stars' name keeps the real figure.
// No figure beside the stars (Thor 19/11: only the stars).
const SHOWN_AT_LEAST = 4.5

// How far the stars' fill reaches, in % of the 106 px row: whole stars sit 22 px apart and are
// 17.4 px wide from x 0,3, so a 4,5 fills half the fifth star, not 41 % of it.
export function starFill(average: number) {
  const whole = Math.floor(average)
  const part = average - whole
  const px = whole * 22 + (part > 0 ? 0.3 + part * 17.4 : 0)
  return `${Math.min(100, Math.round((px / 106) * 10000) / 100)}%`
}

// Five stars, then the user count. The figure is only in the stars' name, for screen readers.
export function RatingLine({ rating, users }: { rating: Rating; users: number }) {
  return (
    <p className="h-rating">
      <span className="h-stars" role="img" aria-label={ratingText(rating)} style={{ '--fill': starFill(Math.max(shown(rating), SHOWN_AT_LEAST)) } as React.CSSProperties} />
      <span className="h-rating-text">{HERO.rating.replace('{plus}', usersPlus(users))}</span>
    </p>
  )
}

export default async function AppRating() {
  const [rating, users] = await Promise.all([readAppRating(), readUserCount()])
  return <RatingLine rating={rating} users={users} />
}
