import { PROOF } from './copy'
import Voices from './Voices'

// A laurel of our own drawing, one side: a curved stem with pointed leaves on both sides,
// smaller towards the top. The other side is the same drawing mirrored.
const STEM = 'M52 116Q-6 78 30 6'
const LEAVES =
  'M41.3 108.1Q32.5 101.6 24.4 108.8Q33.2 115.2 41.3 108.1ZM41.3 108.1Q45.4 99.2 37.6 93.2Q33.5 102.1 41.3 108.1ZM32.0 98.8Q24.6 91.4 15.8 96.9Q23.2 104.3 32.0 98.8ZM32.0 98.8Q37.2 91.0 30.7 84.2Q25.5 92.0 32.0 98.8ZM24.8 88.7Q19.2 80.5 9.9 84.2Q15.6 92.4 24.8 88.7ZM24.8 88.7Q31.0 82.3 26.1 74.8Q19.9 81.2 24.8 88.7ZM19.8 77.8Q16.0 69.2 6.7 70.9Q10.5 79.6 19.8 77.8ZM19.8 77.8Q26.7 72.9 23.5 65.1Q16.5 70.0 19.8 77.8ZM16.9 66.2Q15.0 57.4 6.0 57.4Q7.9 66.2 16.9 66.2ZM16.9 66.2Q24.3 62.9 22.7 54.9Q15.3 58.2 16.9 66.2ZM16.3 53.7Q15.9 45.2 7.5 43.7Q7.9 52.2 16.3 53.7ZM16.3 53.7Q23.7 51.9 23.5 44.2Q16.1 46.1 16.3 53.7ZM17.8 40.5Q18.7 32.5 11.1 29.9Q10.2 37.9 17.8 40.5ZM17.8 40.5Q24.9 39.9 25.9 32.7Q18.7 33.3 17.8 40.5ZM21.4 26.5Q23.2 19.2 16.5 15.8Q14.7 23.1 21.4 26.5ZM21.4 26.5Q28.2 26.8 30.0 20.2Q23.2 19.9 21.4 26.5ZM27.3 11.7Q29.7 5.1 23.8 1.2Q21.3 7.9 27.3 11.7ZM27.9 10.3Q35.8 6.8 33.4 -1.5Q25.6 2.0 27.9 10.3Z'

function Laurel({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="-7 -2 60 120" className="p-laurel-branch" fill="currentColor" aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <path d={STEM} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d={LEAVES} />
    </svg>
  )
}

// The same Apple mark as on the App Store pill (components/StoreBadges.tsx).
const APPLE =
  'M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09v-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z'

export default function Proof() {
  return (
    <section data-b="proof" className="sec p" aria-labelledby="p-title">
      <p className="p-laurel" data-reveal>
        <Laurel />
        <span>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" className="p-apple" aria-hidden="true">
            <path d={APPLE} />
          </svg>
          {PROOF.award.lines.map((line) => (
            <span key={line} className="p-award-line">
              {line}
            </span>
          ))}
        </span>
        <Laurel flip />
      </p>
      <h2 id="p-title" className="t-h2 p-title" data-reveal>
        {PROOF.title}
      </h2>
      <Voices />
    </section>
  )
}
