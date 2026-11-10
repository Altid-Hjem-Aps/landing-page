import Link from 'next/link'
import { PRIVACY } from './copy'

// The Altid house with a keyhole, drawn as a soft glass outline behind the text.
function GlassHouse() {
  return (
    <svg className="x-house" viewBox="0 0 551 786" aria-hidden="true">
      <defs>
        <linearGradient id="x-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0.035" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.015" />
        </linearGradient>
        <linearGradient id="x-line" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path
        d="M275.5 70 C290 70 303 75 315 85 L515 250 C532 264 541 283 541 305 L541 690 C541 730 511 760 471 760 L80 760 C40 760 10 730 10 690 L10 305 C10 283 19 264 36 250 L236 85 C248 75 261 70 275.5 70 Z"
        fill="url(#x-fill)"
        stroke="url(#x-line)"
        strokeWidth="2"
      />
      <path
        d="M275.5 118 C282 118 289 120 295 125 L482 279 C493 288 499 300 499 314 L499 682 C499 703 484 718 463 718 L88 718 C67 718 52 703 52 682 L52 314 C52 300 58 288 69 279 L256 125 C262 120 269 118 275.5 118 Z"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.09"
        strokeWidth="1.5"
      />
      <path
        d="M275.5 306 C306 306 331 331 331 362 C331 383 319 401 302 410 L314 486 C315 493 310 499 303 499 L248 499 C241 499 236 493 237 486 L249 410 C232 401 220 383 220 362 C220 331 245 306 275.5 306 Z"
        fill="#fff"
        fillOpacity="0.035"
        stroke="#fff"
        strokeOpacity="0.14"
        strokeWidth="1.5"
      />
    </svg>
  )
}

export default function Privacy() {
  return (
    <section data-b="privacy" className="sec x">
      <div className="x-panel" data-surface="dark">
        <GlassHouse />
        <div className="x-text">
          <h2 className="t-h2">{PRIVACY.title}</h2>
          <p className="t-body">{PRIVACY.body}</p>
          <Link href="/privatlivspolitik" className="x-link">
            {PRIVACY.link}
          </Link>
        </div>
      </div>
    </section>
  )
}
