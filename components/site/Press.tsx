import Image from 'next/image'
import { PRESS } from './copy'

// The press mention altidmad.dk shows, in the layout of its press block: outlet, date, the
// headline as a quote and a link to the article.
export default function Press() {
  return (
    <section data-b="press" className="pr" aria-labelledby="pr-quote">
      <p className="pr-eyebrow">
        {PRESS.eyebrow}
        <Image src="/site/press/ekstra-bladet.png" alt={PRESS.outlet} width={48} height={48} />
      </p>
      <p className="pr-date">{PRESS.date}</p>
      <blockquote id="pr-quote" className="pr-quote">
        {PRESS.quote}
      </blockquote>
      <a className="pr-cta" href={PRESS.href} target="_blank" rel="noopener noreferrer">
        {PRESS.cta}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M4 10l6-6M5 4h5v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  )
}
