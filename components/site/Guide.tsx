import Link from 'next/link'
import type { ReactNode } from 'react'
import StoreBadges from '@/components/StoreBadges'
import { STORE_ANCHOR } from '@/lib/store-links'
import { GUIDE, NAV } from './copy'
import { dmSans } from './fonts'
import Reveal from './Reveal'
import SiteFooter from './SiteFooter'
import SiteNav from './SiteNav'
import '@/app/site.css'

export type GuideFaq = { q: string; a: string[] }

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

// A guide (the SEO pages) in the new site's look, like /presse: the new nav and footer, the
// title and the short answer on top, the article in a readable column with a small "Hent
// Altid Hjem" card beside it on a computer, the questions as native disclosures (they work
// without JavaScript and Google reads them), and the store buttons on a Dark forest panel at
// the end. Every call to action goes to the App Store and Google Play. The questions are also
// the page's FAQPage data, so the two never drift apart.
export default function Guide({
  title,
  lead,
  meta,
  faq,
  cta,
  children,
}: {
  title: string
  /** The short answer under the title (aimed at Google's featured snippet). */
  lead: ReactNode
  /** The small line with the date and the sources. */
  meta: ReactNode
  faq: GuideFaq[]
  cta: { eyebrow: string; heading: string; subtitle: string }
  /** The article: one <section> per heading. */
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
          <Link href="/" className="gd-back" data-rise="0">
            <span aria-hidden="true">←</span> {GUIDE.back}
          </Link>
          <h1 className="t-h1" data-rise="0">
            {title}
          </h1>
          <div className="gd-lead" data-rise="1">
            {lead}
          </div>
          <p className="gd-meta" data-rise="1">
            {meta}
          </p>
        </header>

        <div className="gd-grid">
          <article className="gd-body">
            {children}
            <section aria-labelledby="gd-faq">
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
            </section>
          </article>

          {/* Computers only (CSS): stays beside the article while it scrolls. */}
          <aside className="gd-side" aria-label={GUIDE.side.title}>
            <div className="gd-side-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/app-badge.png" alt="" width={56} height={56} />
              <p className="gd-side-title">{GUIDE.side.title}</p>
              <p className="gd-side-line">{GUIDE.side.line}</p>
              <StoreBadges position="side" variant="cream" className="gd-side-pills" />
            </div>
          </aside>
        </div>

        <section id={STORE_ANCHOR} className="gd-cta" data-surface="dark" aria-labelledby="gd-cta" data-reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/app-badge.png" alt="" width={72} height={72} className="gd-cta-icon" />
          <p className="gd-cta-eyebrow">{cta.eyebrow}</p>
          <h2 id="gd-cta" className="t-h2">
            {cta.heading}
          </h2>
          <p className="gd-cta-line">{cta.subtitle}</p>
          <StoreBadges position="bottom" variant="forest" size="lg" className="gd-cta-pills" />
        </section>
      </main>
      <SiteFooter base="/" />
      <Reveal />
    </div>
  )
}
