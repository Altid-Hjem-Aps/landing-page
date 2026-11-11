import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'
import StoreBadges from '@/components/StoreBadges'
import { NAV, NOTES } from '@/components/site/copy'
import { dmSans } from '@/components/site/fonts'
import { MotionPrefs } from '@/components/site/MotionPrefs'
import PauseButton from '@/components/site/PauseButton'
import Phone from '@/components/site/Phone'
import SiteFooter from '@/components/site/SiteFooter'
import SiteNav from '@/components/site/SiteNav'
import { STORE_ANCHOR } from '@/lib/store-links'
import { EXAMPLES } from './examples'
import GuideFaq from './GuideFaq'
import { danishDate, guideJsonLdScript } from './meta'
import { rich } from './rich'
import type { Guide, GuideBlock } from './types'
import '@/app/site.css'

// The fixed words of every guide. What a guide itself says lives in its data file.
const UI = {
  home: 'Altid Hjem',
  crumbs: 'Brødkrumme',
  by: 'Af',
  published: 'Udgivet',
  updated: 'Opdateret',
  toc: 'På denne side',
  source: 'Kilde',
  sources: 'Kilder',
  sourcesLine: 'Alle priser og tal på siden kommer herfra. Vi har læst dem på de datoer, der står ved hver kilde.',
  read: 'Læst',
  related: 'Læs også',
  faq: 'Ofte stillede spørgsmål',
  app: 'I appen',
  example: 'Eksempel',
  exampleNote: 'Illustration, ikke et skærmbillede fra appen.',
  newTab: ' (åbner i en ny fane)',
} as const

// "Kilde: A" or "Kilder: A, B og C", each name a link to the source itself. A publisher
// cited twice in one line gets its number in the list of sources, so the two can be told apart.
function Cite({ ids, guide }: { ids: string[]; guide: Guide }) {
  const cited = ids.map((id) => {
    const at = guide.sources.findIndex((source) => source.id === id)
    if (at < 0) throw new Error(`Guide: no source with the id "${id}"`)
    return { source: guide.sources[at], number: at + 1 }
  })
  const repeated = (publisher: string) => cited.filter((c) => c.source.publisher === publisher).length > 1
  return (
    <>
      {cited.length > 1 ? UI.sources : UI.source}:{' '}
      {cited.map(({ source, number }, i) => (
        <Fragment key={source.id}>
          {i === 0 ? '' : i === cited.length - 1 ? ' og ' : ', '}
          <a href={source.href} target="_blank" rel="noopener noreferrer">
            {source.publisher}
            {repeated(source.publisher) ? ` (${number})` : ''}
            <span className="sr-only">{UI.newTab}</span>
          </a>
        </Fragment>
      ))}
    </>
  )
}

// The label that says what a picture is: a real app screen, or an illustration.
function Tag({ kind }: { kind: 'app' | 'example' }) {
  return (
    <span className="gd-tag" data-kind={kind}>
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {kind === 'app' ? (
          <>
            <rect x="4.2" y="1.5" width="7.6" height="13" rx="2" />
            <path d="M7 12.3h2" />
          </>
        ) : (
          <path d="M2.5 13.5l.7-3L10.6 3a1.3 1.3 0 0 1 1.9 0l.5.5a1.3 1.3 0 0 1 0 1.9l-7.5 7.4-3 .7zM9.5 4.2l2.3 2.3" />
        )}
      </svg>
      {kind === 'app' ? UI.app : UI.example}
    </span>
  )
}

function Block({ block, guide }: { block: GuideBlock; guide: Guide }) {
  switch (block.type) {
    case 'text':
      return (
        <p>
          {rich(block.text)}
          {block.sources ? (
            <span className="gd-cite">
              {' '}
              <Cite ids={block.sources} guide={guide} />.
            </span>
          ) : null}
        </p>
      )
    case 'list':
      return (
        <ul className="gd-list">
          {block.items.map((item) => (
            <li key={item}>{rich(item)}</li>
          ))}
        </ul>
      )
    case 'steps':
      return (
        <ol className="gd-steps">
          {block.items.map((item) => (
            <li key={item}>{rich(item)}</li>
          ))}
        </ol>
      )
    case 'prices':
      return (
        <div className="gd-prices">
          <ul>
            {block.rows.map((row) => (
              <li key={row.name}>
                <p>
                  <b>{row.name}</b>
                  <strong>{row.price}</strong>
                </p>
                <small>{row.note}</small>
                <small>
                  <Cite ids={[row.source]} guide={guide} />
                </small>
              </li>
            ))}
          </ul>
          <p className="note">{block.note}</p>
        </div>
      )
    case 'app':
      return (
        <figure className="gd-vis" data-kind="app">
          <div className="gd-vis-card" data-tone={block.tone} data-staged="true">
            <div className="gd-vis-text">
              <Tag kind="app" />
              <h3>{block.title}</h3>
              <p>{block.body}</p>
            </div>
            <div className="gd-vis-art" data-frame={block.frame}>
              {block.frame === 'screen' ? (
                <Phone src={block.src} alt={block.alt} sizes="(max-width: 767px) 60vw, 300px" />
              ) : (
                // The mail's phone with its lifted pieces: 866 x 1477, the phone already in the picture.
                <Image src={block.src} alt={block.alt} width={866} height={1477} sizes="(max-width: 767px) 80vw, 400px" />
              )}
            </div>
          </div>
          <figcaption className="note">{NOTES.staged}</figcaption>
        </figure>
      )
    case 'example': {
      const Example = EXAMPLES[block.example]
      return (
        <figure className="gd-vis" data-kind="example">
          <div className="gd-vis-card" data-tone={block.tone}>
            <div className="gd-vis-text">
              <Tag kind="example" />
              <h3>{block.title}</h3>
              <p>{block.body}</p>
            </div>
            <div className="gd-vis-art">
              <Example />
            </div>
          </div>
          <figcaption className="note">{UI.exampleNote}</figcaption>
        </figure>
      )
    }
  }
}

// One guide page in the new site's look, drawn from one data file (content/guides/). The
// order is fixed: the search question, the short answer with its source in a dark panel, the
// sections under question-shaped headings, the sources, more guides, the FAQ and one block
// with the store buttons.
export default function GuidePage({ guide }: { guide: Guide }) {
  return (
    <div className={`site ${dmSans.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: guideJsonLdScript(guide) }} />
      <MotionPrefs>
        <a href="#indhold" className="skip">
          {NAV.skip}
        </a>
        <SiteNav base="/" />
        <main id="indhold" className="pz gd">
          <article>
            <header className="pz-head gd-head">
              <nav className="gd-crumbs" aria-label={UI.crumbs}>
                <Link href="/">{UI.home}</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">{guide.name}</span>
              </nav>
              <h1 className="t-h1">{guide.h1}</h1>
              <p className="t-body pz-lead">{guide.lead}</p>
              <p className="gd-by">
                <span>
                  {UI.by} <b>{guide.author.name}</b>, {guide.author.role}
                </span>
                <span>
                  {UI.published} <time dateTime={guide.published}>{danishDate(guide.published)}</time>
                </span>
                <span>
                  {UI.updated} <time dateTime={guide.updated}>{danishDate(guide.updated)}</time>
                </span>
              </p>
            </header>

            <section className="pz-about gd-answer" data-surface="dark" aria-labelledby="gd-answer">
              <div>
                <h2 id="gd-answer" className="t-h2">
                  {guide.answer.title}
                </h2>
                {guide.answer.body.map((line) => (
                  <p key={line} className="pz-about-body">
                    {rich(line)}
                  </p>
                ))}
                <p className="gd-answer-cite">
                  <Cite ids={guide.answer.sources} guide={guide} />
                </p>
              </div>
              <dl className="pz-facts">
                {guide.answer.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <div className="gd-body">
              <nav className="gd-toc" aria-labelledby="gd-toc">
                <p id="gd-toc">{UI.toc}</p>
                <ol>
                  {guide.sections.map((section) => (
                    <li key={section.id}>
                      <a href={`#${section.id}`}>{section.title}</a>
                    </li>
                  ))}
                  <li>
                    <a href="#kilder">{UI.sources}</a>
                  </li>
                  <li>
                    <a href="#spoergsmaal">{UI.faq}</a>
                  </li>
                </ol>
              </nav>

              <div className="gd-main">
                {guide.sections.map((section) => (
                  <section key={section.id} id={section.id} className="gd-sec" aria-labelledby={`${section.id}-title`}>
                    <h2 id={`${section.id}-title`} className="t-h3">
                      {section.title}
                    </h2>
                    {section.blocks.map((block, i) => (
                      <Block key={i} block={block} guide={guide} />
                    ))}
                  </section>
                ))}

                <section id="kilder" className="gd-sec" aria-labelledby="kilder-title">
                  <h2 id="kilder-title" className="t-h3">
                    {UI.sources}
                  </h2>
                  <p>{UI.sourcesLine}</p>
                  <ol className="gd-sources">
                    {guide.sources.map((source) => (
                      <li key={source.id}>
                        <a href={source.href} target="_blank" rel="noopener noreferrer">
                          <b>{source.publisher}</b>: {source.title}
                          <span className="sr-only">{UI.newTab}</span>
                        </a>
                        <small>
                          {UI.read} <time dateTime={source.read}>{danishDate(source.read)}</time>
                        </small>
                      </li>
                    ))}
                  </ol>
                </section>
              </div>
            </div>
          </article>

          <section className="pz-sec gd-wide" aria-labelledby="gd-related">
            <h2 id="gd-related" className="t-h2">
              {UI.related}
            </h2>
            <ul className="pz-coverage">
              {guide.related.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <span>
                      <b>{item.title}</b>
                      <small>{item.note}</small>
                    </span>
                    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section id="spoergsmaal" className="pz-sec gd-wide" aria-labelledby="gd-faq">
            <h2 id="gd-faq" className="t-h2">
              {UI.faq}
            </h2>
            <GuideFaq items={guide.faq} />
          </section>

          <section className="pz-contact gd-store" data-surface="dark" aria-labelledby="gd-store">
            <h2 id="gd-store" className="t-h2">
              {guide.store.title}
            </h2>
            <p className="gd-store-body">{guide.store.body}</p>
            <div id={STORE_ANCHOR} className="gd-store-pills">
              <StoreBadges position="bottom" variant="forest" size="lg" />
            </div>
          </section>
        </main>
        <PauseButton />
      </MotionPrefs>
      <SiteFooter base="/" />
    </div>
  )
}
