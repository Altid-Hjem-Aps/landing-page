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

// The bank connection, made calm: a Deep forest panel, a lock with the MitID mark, what the
// connection can and can't do, and the banks it works with sliding past in white.
export default function Privacy() {
  return (
    <section data-b="privacy" className="sec x">
      <div className="x-panel" data-surface="dark" data-reveal>
        {/* The lock and the MitID mark (mitid.dk's own logo file): the login is MitID's. */}
        <span className="x-lock">
          <Lock />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/site/brand/mitid.svg" alt="MitID" width={94} height={25} />
        </span>
        <h2 className="t-h2 x-title">{PRIVACY.title}</h2>
        <p className="t-body x-body">{PRIVACY.body}</p>
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
