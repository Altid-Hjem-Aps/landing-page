import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { PostCard } from '@/components/sections/Blog'
import { POSTS } from '@/components/sections/blogPosts'
import StoreBadges from '@/components/StoreBadges'
import { STORE_ANCHOR } from '@/lib/store-links'
import AppRating from './AppRating'
import { keepBrands, titleText } from './brand'
import { GUIDE, NAV } from './copy'
import PhoneBody from './PhoneBody'
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

/** The page itself, for its dates, the breadcrumb and the Article data for Google
 * (docs/guide-recipe.md, part 6). Dates as YYYY-MM-DD. `description` is the page's meta
 * description. */
export type GuidePage = { path: string; description: string; published: string; updated: string }

/** One source in the Kilder list: who published it, what it is, the link, and what we took from
 * it (the dataset and its date, or "Egne beregninger på baggrund af data fra ..."). */
export type GuideSource = { publisher: string; title: string; href: string; note?: string }

/** The Kilder list: when every source was last checked (YYYY-MM-DD), then the sources. */
export type GuideSources = { checked: string; items: GuideSource[] }


const SITE = 'https://www.altidhjem.dk'

/** A YYYY-MM-DD date that exists, or a thrown error: a wrong date must not reach Google. */
function isoDate(value: string, field: string): Date {
  const date = new Date(`${value}T00:00:00Z`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error(`Guide: ${field} must be a real date as YYYY-MM-DD, got "${value}"`)
  }
  return date
}

const DANISH_DATE = new Intl.DateTimeFormat('da-DK', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

function DateText({ value, field }: { value: string; field: string }) {
  return <time dateTime={value}>{DANISH_DATE.format(isoDate(value, field))}</time>
}

/** JSON-LD as a script, with '<' escaped so text can never close the tag. */
function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
}

/** One illustration in the article, on a tinted card like the front page's blocks. `kind` says what
 * it shows, and test/guide-checks.test.tsx holds the caption to it: an 'example' (drawn, the
 * default) starts "Eksempel:" and says "Illustration, ikke et skærmbillede fra appen."; 'data' (a
 * chart of real figures from a source in Kilder) starts "Tal fra <that source>". A real app screen
 * goes in GuideApp, captioned "I appen:". */
export function GuideFigure({ tone = 'sand', kind = 'example', caption, children }: { tone?: 'sand' | 'mint' | 'sky' | 'honey' | 'lavender' | 'rose'; kind?: 'example' | 'data'; caption?: ReactNode; children: ReactNode }) {
  return (
    <figure className="gd-figure" data-tone={tone} data-kind={kind}>
      <div className="gd-figure-art">{children}</div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}

/** The landing page's store buttons, for the section that tells how Altid Hjem helps: the two
 * pills (a QR code each on a computer) and on a phone the one button to the visitor's own store,
 * counted under position `help` and carrying the guide's own campaign, like every store link on
 * a guide (Thor 16/11). */
export function GuideStores() {
  return (
    <div className="gd-stores">
      <StoreBadges position="help" variant="cream" size="lg" className="store-row" motion qr />
      <GetAppButton position="help" />
    </div>
  )
}

/** A real app screen in the landing page's phone: the same iPhone front, depth (PhoneBody) and
 * screen mask as CyclingPhone, standing still, since a guide has no motion controls. Put it in a
 * GuideFigure whose caption starts with "I appen". */
export function GuidePhone({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="gd-phone">
      <div className="ph">
        <PhoneBody />
        <div className="ph-screen">
          <Image src={src} alt={alt} fill sizes="(max-width: 767px) 60vw, 300px" quality={75} style={{ objectFit: 'cover', objectPosition: '50% 0%' }} />
        </div>
      </div>
    </div>
  )
}

/** The card in the section on how Altid Hjem helps: the landing page's proof (stars and how many
 * Danes have the app) over its store buttons, beside a real app screen in the phone, so the
 * phone never stands alone on an empty card (Thor 16/11). On a phone the proof and the button
 * come first and the screen follows. */
export function GuideApp({ tone = 'sand', src, alt, caption }: { tone?: 'sand' | 'mint' | 'sky' | 'honey' | 'lavender' | 'rose'; src: string; alt: string; caption: ReactNode }) {
  return (
    <figure className="gd-figure gd-app" data-tone={tone}>
      <div className="gd-app-cta">
        <AppRating />
        <GuideStores />
      </div>
      <div className="gd-app-art">
        <GuidePhone src={src} alt={alt} />
        <figcaption>{caption}</figcaption>
      </div>
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
  page,
  sources,
  related,
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
  /** The page's address, description and dates: shows the dates and the breadcrumb, and adds the
   * Article and BreadcrumbList data. Required for new guides (docs/guide-recipe.md). */
  page?: GuidePage
  /** The Kilder list, at the end of the article; also the Article data's citations. */
  sources?: GuideSources
  /** "Læs også": the addresses of 3 related guides, shown as their blog cards (POSTS in
   * components/sections/blogPosts.ts) after the questions, before the download panel. */
  related?: string[]
  /** The article: one <section> per heading (or a GuideSteps). */
  children: ReactNode
}) {
  if (page) {
    if (!/^\/[a-z0-9-]+$/.test(page.path)) throw new Error(`Guide: page.path must be one path segment like /hvad-koster-x, got "${page.path}"`)
    if (isoDate(page.updated, 'page.updated') < isoDate(page.published, 'page.published')) {
      throw new Error('Guide: page.updated is before page.published')
    }
  }
  if (sources) {
    isoDate(sources.checked, 'sources.checked')
    if (!sources.items.length) throw new Error('Guide: sources needs at least one source')
    for (const s of sources.items) {
      if (!/^https?:\/\//.test(s.href)) throw new Error(`Guide: a source link must be a full address, got "${s.href}"`)
    }
  }
  if (sources && !page) throw new Error('Guide: sources need page, for the Article data')
  const relatedPosts = related?.map((href) => {
    const post = POSTS.find((p) => p.href === href)
    if (!post) throw new Error(`Guide: "Læs også" ${href} has no card in POSTS (components/sections/blogPosts.ts)`)
    return post
  })
  if (related) {
    if (related.length !== 3) throw new Error(`Guide: "Læs også" needs exactly 3 guides, got ${related.length}`)
    if (new Set(related).size !== related.length) throw new Error('Guide: a "Læs også" guide is listed twice')
    if (page && related.includes(page.path)) throw new Error('Guide: "Læs også" lists the page itself')
  }
  const url = page ? `${SITE}${page.path}` : null
  const organisation = { '@type': 'Organization', name: 'Altid Hjem ApS', url: SITE, logo: `${SITE}/app-badge.png` }
  const articleSchema = page && {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: page.description,
    url,
    mainEntityOfPage: url,
    inLanguage: 'da-DK',
    image: `${SITE}/opengraph-image.png`,
    datePublished: page.published,
    dateModified: page.updated,
    author: organisation,
    publisher: organisation,
    ...(sources ? { citation: sources.items.map((s) => ({ '@type': 'CreativeWork', name: `${s.publisher}: ${s.title}`, url: s.href })) } : {}),
  }
  const crumbsSchema = page && {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: GUIDE.crumbs.home, item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: title, item: url },
    ],
  }
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
      {/* JsonLd escapes '<': JSON.stringify leaves it alone, so a later answer with '</script>'
          could otherwise break out of the tag. */}
      <JsonLd data={faqSchema} />
      {articleSchema ? <JsonLd data={articleSchema} /> : null}
      {crumbsSchema ? <JsonLd data={crumbsSchema} /> : null}
      <main id="indhold" className="gd">
        <header className="gd-head">
          <div>
            {page ? (
              <nav className="gd-crumbs" aria-label={GUIDE.crumbs.label} data-rise="0">
                <ol>
                  <li>
                    <Link href="/">{GUIDE.crumbs.home}</Link>
                  </li>
                  <li aria-current="page">{title}</li>
                </ol>
              </nav>
            ) : null}
            <h1 className="t-h1" data-rise="0">
              {titleText(title)}
            </h1>
            <div className="gd-lead" data-rise="1">
              {lead}
            </div>
            {page ? (
              <p className="gd-dates" data-rise="1">
                {GUIDE.published} <DateText value={page.published} field="page.published" /> · {GUIDE.updated}{' '}
                <DateText value={page.updated} field="page.updated" />
              </p>
            ) : null}
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
          {sources ? (
            <section className="gd-sources" aria-labelledby="gd-sources">
              <h2 id="gd-sources">{GUIDE.sources}</h2>
              <p className="gd-checked">
                {GUIDE.checked} <DateText value={sources.checked} field="sources.checked" />
              </p>
              <ol>
                {sources.items.map((s) => (
                  <li key={s.href + s.title}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer">
                      {s.publisher}: {s.title}
                    </a>
                    {s.note ? <span>{s.note}</span> : null}
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
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

        {/* After the questions, before the download panel: a reader not ready to download gets three
            related guides to stay on the site with, as the front page's blog cards. */}
        {relatedPosts ? (
          <section className="gd-related" aria-labelledby="gd-related" data-reveal>
            <h2 id="gd-related" className="t-h2">
              {GUIDE.related}
            </h2>
            <ul>
              {relatedPosts.map((post) => (
                <li key={post.href}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

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
