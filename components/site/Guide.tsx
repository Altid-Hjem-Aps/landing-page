import Link from 'next/link'
import type { ReactNode } from 'react'
import StoreBadges from '@/components/StoreBadges'
import { STORE_ANCHOR } from '@/lib/store-links'
import { keepBrands, titleText } from './brand'
import { GUIDE, NAV } from './copy'
import { dmSans } from './fonts'
import EngagementTracker from './EngagementTracker'
import GetAppButton from './GetAppButton'
import GuideOfferPopup from './GuideOfferPopup'
import Reveal from './Reveal'
import SiteFooter from './SiteFooter'
import SiteNav from './SiteNav'
import '@/app/site.css'

export type GuideFaq = { q: string; a: string[] }

/** The guide's short answer in the card beside the title: a number (or a short sentence when the
 * guide has no number), what it is, and one line of context. `range` draws a price range to
 * scale with its average marked. */
export type GuideAnswer = {
  label: string
  value: string
  unit?: string
  note?: string
  range?: { max: number; low: number; high: number; markLow: number; markHigh: number; markLabel: string; unit: string }
}

/** The things the answer depends on, as a row of small cards under the head. */
export type GuideFactors = { label: string; items: string[] }

/** One illustration in the article, on a tinted card like the front page's blocks. */
export function GuideFigure({ tone = 'sand', caption, children }: { tone?: 'sand' | 'mint' | 'sky' | 'honey' | 'lavender' | 'rose'; caption?: ReactNode; children: ReactNode }) {
  return (
    <figure className="gd-figure" data-tone={tone}>
      <div className="gd-figure-art">{children}</div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}

/** An in-text link to another page of the site. */
export function GuideLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link href={href}>{children}</Link>
}

/** A checklist section as numbered steps on Dark forest cards, one paragraph each. */
export function GuideSteps({ title, steps }: { title: string; steps: ReactNode[] }) {
  return (
    <section className="gd-steps">
      <h2>{title}</h2>
      <ol>
        {steps.map((step, i) => (
          <li key={i}>
            <span className="gd-eyebrow">
              {GUIDE.step} {i + 1}
            </span>
            <p>{step}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

function RangeBar({ range }: { range: NonNullable<GuideAnswer['range']> }) {
  const at = (n: number) => `${(n / range.max) * 100}%`
  return (
    <div className="gd-range" aria-hidden="true">
      <div className="gd-range-track">
        <span className="gd-range-fill" style={{ left: at(range.low), right: `calc(100% - ${at(range.high)})` }} />
        <span className="gd-range-mark" style={{ left: at(range.markLow), width: `calc(${at(range.markHigh)} - ${at(range.markLow)})` }} />
      </div>
      <div className="gd-range-ticks">
        <span style={{ left: at(range.low) }}>
          {range.low} {range.unit}
        </span>
        <span className="gd-range-tick-mark" style={{ left: at((range.markLow + range.markHigh) / 2) }}>
          {range.markLabel}
        </span>
        <span style={{ left: at(range.high) }}>
          {range.high} {range.unit}
        </span>
      </div>
    </div>
  )
}

// A guide (the SEO pages) in the new site's look (Thor 15/11, version B of three): the title and
// the short answer beside a card with the guide's key number, the things it depends on as a row
// of cards, then each section of the article as a tinted block like the front page's, its
// heading on the left and its text on the right. The questions sit beside their heading as native
// disclosures (they work without JavaScript and Google reads them), with a card for whoever did
// not find the answer, and the store buttons end the page on a Dark forest panel: on a phone the
// one button to the visitor's own store. The questions are also the page's FAQPage data, so the
// two never drift apart.
export default function Guide({
  title,
  lead,
  meta,
  answer,
  factors,
  faq,
  cta,
  children,
}: {
  title: string
  /** The short answer under the title (aimed at Google's featured snippet). */
  lead: ReactNode
  /** The small line with the date and the sources. */
  meta: ReactNode
  answer: GuideAnswer
  factors?: GuideFactors
  faq: GuideFaq[]
  cta: { eyebrow: string; heading: string; subtitle: string }
  /** The article: one <section> per heading (or a GuideSteps). */
  children: ReactNode
}) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a.join(' ') },
    })),
  }
  const statement = answer.value.length > 14

  return (
    <div className={`site ${dmSans.variable}`}>
      <a href="#indhold" className="skip">
        {NAV.skip}
      </a>
      <SiteNav base="/" storesHere />
      <script
        type="application/ld+json"
        // '<' as <: JSON.stringify leaves '<' alone, so a later answer with '</script>'
        // could otherwise break out of the tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }}
      />
      <main id="indhold" className="gd">
        <header className="gd-head">
          <div>
            <h1 className="t-h1" data-rise="0">
              {titleText(title)}
            </h1>
            <div className="gd-lead" data-rise="1">
              {lead}
            </div>
            <p className="gd-meta" data-rise="1">
              {meta}
            </p>
          </div>
          <div className="gd-answer" data-tone="mint" data-rise="2">
            <p className="gd-eyebrow">{answer.label}</p>
            <p className="gd-answer-value" data-statement={statement ? 'true' : undefined}>
              {keepBrands(answer.value)}
              {answer.unit ? <span>{answer.unit}</span> : null}
            </p>
            {answer.range ? <RangeBar range={answer.range} /> : null}
            {answer.note ? <p className="gd-answer-note">{keepBrands(answer.note)}</p> : null}
          </div>
        </header>

        {factors ? (
          <section className="gd-factors" aria-labelledby="gd-factors" data-reveal>
            <h2 id="gd-factors" className="gd-eyebrow">
              {factors.label}
            </h2>
            <ul>
              {factors.items.map((item, i) => (
                <li key={item}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <article className="gd-body">
          {children}
          {/* The heading on the left with the card under it, the questions on the right, on the
              blocks' own columns (Thor 15/11: no empty space beside the questions). */}
          <section className="gd-faq-sec" aria-labelledby="gd-faq">
            <h2 id="gd-faq">{GUIDE.faq}</h2>
            <div className="gd-faq">
              {faq.map((f) => (
                <details key={f.q}>
                  <summary>
                    <h3>{f.q}</h3>
                    <svg viewBox="0 0 14 14" width="14" height="14" fill="none" aria-hidden="true">
                      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </summary>
                  <div>
                    {f.a.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
            <aside className="gd-ask" data-tone="sand" aria-labelledby="gd-ask">
              <h3 id="gd-ask">{GUIDE.ask.title}</h3>
              <p>{GUIDE.ask.line}</p>
              <a className="kt-mail" href={GUIDE.ask.href}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3.5 6.5h17v11h-17zM3.5 7l8.5 6.5L20.5 7" />
                </svg>
                {GUIDE.ask.button}
              </a>
            </aside>
          </section>
        </article>

        <section id={STORE_ANCHOR} className="gd-cta" data-surface="dark" aria-labelledby="gd-cta" data-reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/app-badge.png" alt="" width={72} height={72} className="gd-cta-icon" />
          <p className="gd-cta-eyebrow">{cta.eyebrow}</p>
          <h2 id="gd-cta" className="t-h2">
            {keepBrands(cta.heading)}
          </h2>
          <p className="gd-cta-line">{cta.subtitle}</p>
          {/* The two store pills on a computer; on a phone the one button to the visitor's store. */}
          <StoreBadges position="bottom" variant="forest" size="lg" className="gd-cta-pills store-row" motion qr />
          <div className="gd-cta-get">
            <GetAppButton position="bottom" />
          </div>
        </section>
      </main>
      <SiteFooter base="/" />
      <Reveal />
      {/* Half way down the guide: the reader has had the answer they came for. */}
      <GuideOfferPopup after={0.5} />
      <EngagementTracker />
    </div>
  )
}
