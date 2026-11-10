import { HERO } from './copy'

// The app's rating in the Danish App Store, read at build and again at most once an hour.
// A failed lookup fails the build; a failed hourly refresh keeps the page it already has.
const LOOKUP = 'https://itunes.apple.com/lookup?id=6794330094&country=dk'

export type Rating = { average: number; count: number }

export async function readAppRating(): Promise<Rating> {
  const res = await fetch(LOOKUP, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`App Store lookup answered ${res.status}`)
  const app = (await res.json()).results?.[0]
  if (typeof app?.averageUserRating !== 'number' || typeof app?.userRatingCount !== 'number') {
    throw new Error('App Store lookup has no rating')
  }
  return { average: app.averageUserRating, count: app.userRatingCount }
}

export function ratingText({ average, count }: Rating) {
  const fill = (template: string) =>
    template
      .replace('{average}', (Math.round(average * 10) / 10).toLocaleString('da-DK'))
      .replace('{count}', `${count} ${count === 1 ? 'bedømmelse' : 'bedømmelser'}`)
  return { line: fill(HERO.rating), label: fill(HERO.ratingLabel) }
}

// Five stars, filled as far as the average reaches, as the reference page shows them.
export function RatingLine({ rating }: { rating: Rating }) {
  const { line, label } = ratingText(rating)
  return (
    <p className="h-rating" aria-label={label}>
      <span className="h-stars" style={{ '--fill': `${(rating.average / 5) * 100}%` } as React.CSSProperties} aria-hidden="true" />
      <span aria-hidden="true">{line}</span>
    </p>
  )
}

export default async function AppRating() {
  return <RatingLine rating={await readAppRating()} />
}
