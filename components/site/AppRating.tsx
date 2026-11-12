import { Fragment } from 'react'
import { APP_STORE_ID } from '@/lib/store-links'
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

export function ratingText({ average }: Rating) {
  return HERO.rating.replace('{average}', (Math.round(average * 10) / 10).toLocaleString('da-DK'))
}

// Five stars, filled as far as the average reaches, as the reference page shows them.
// Each half of the line is kept whole, so a phone breaks it at the middle dot.
export function RatingLine({ rating }: { rating: Rating }) {
  const [first, ...rest] = ratingText(rating).split(' · ')
  return (
    <p className="h-rating">
      <span className="h-stars" style={{ '--fill': `${(rating.average / 5) * 100}%` } as React.CSSProperties} aria-hidden="true" />
      <span className="h-rating-text">
        <span className="h-rating-part">{first}</span>
        {rest.map((part) => (
          <Fragment key={part}>
            <span className="h-rating-dot"> · </span>
            <span className="h-rating-part">{part}</span>
          </Fragment>
        ))}
      </span>
    </p>
  )
}

export default async function AppRating() {
  return <RatingLine rating={await readAppRating()} />
}
