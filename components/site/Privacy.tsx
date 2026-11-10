import Link from 'next/link'
import BankMarquee from './BankMarquee'
import { PRIVACY } from './copy'

function Lock() {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" aria-hidden="true">
      <rect x="4.5" y="10.5" width="15" height="10" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="15.5" r="1.4" fill="currentColor" />
    </svg>
  )
}

function Check() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// The bank connection, made calm: a light Mint panel, a lock, what the connection can and
// can't do in three short lines, and the banks it works with sliding past underneath.
export default function Privacy() {
  return (
    <section data-b="privacy" className="sec x">
      <div className="x-panel" data-tone="mint">
        <span className="x-lock">
          <Lock />
        </span>
        <h2 className="t-h2 x-title">{PRIVACY.title}</h2>
        <p className="t-body x-body">{PRIVACY.body}</p>
        <ul className="x-points">
          {PRIVACY.points.map((point) => (
            <li key={point}>
              <Check />
              {point}
            </li>
          ))}
        </ul>
        <div className="x-banks">
          <BankMarquee />
        </div>
        <Link href="/privatlivspolitik" className="x-link">
          {PRIVACY.link}
        </Link>
      </div>
    </section>
  )
}
