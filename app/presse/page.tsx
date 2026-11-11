import type { Metadata } from 'next'
import Image from 'next/image'
import { NAV, PRESSE } from '@/components/site/copy'
import { dmSans } from '@/components/site/fonts'
import SiteFooter from '@/components/site/SiteFooter'
import SiteNav from '@/components/site/SiteNav'
import '../site.css'

export const metadata: Metadata = {
  title: PRESSE.meta.title,
  description: PRESSE.meta.description,
  alternates: { canonical: 'https://www.altidhjem.dk/presse' },
}

function Download({ href, children, quiet = false, external = false }: { href: string; children: React.ReactNode; quiet?: boolean; external?: boolean }) {
  return (
    <a className="pz-dl" data-quiet={quiet ? 'true' : undefined} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : { download: true })}>
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
        <path d="M8 2.5v8M4.5 7.5 8 11l3.5-3.5M3 13.5h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {children}
    </a>
  )
}

// The press page for all of Altid Hjem, in the new site's look: what the app is, a screenshot
// per part of the app (Økonomi, Mad, Energi, Forsikring), press photos with their credit,
// logos, coverage and the press contact. Everything a journalist takes away is a direct download.
export default function Presse() {
  return (
    <div className={`site ${dmSans.variable}`}>
      <a href="#indhold" className="skip">
        {NAV.skip}
      </a>
      <SiteNav base="/" />
      <main id="indhold" className="pz">
        <header className="pz-head">
          <h1 className="t-h1">{PRESSE.title}</h1>
          <p className="t-body pz-lead">{PRESSE.lead}</p>
        </header>

        <section className="pz-about" data-surface="dark" aria-labelledby="pz-about">
          <div>
            <h2 id="pz-about" className="t-h2">
              {PRESSE.about.title}
            </h2>
            {PRESSE.about.body.map((line) => (
              <p key={line} className="pz-about-body">
                {line}
              </p>
            ))}
          </div>
          <dl className="pz-facts">
            {PRESSE.about.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="pz-sec" aria-labelledby="pz-parts">
          <h2 id="pz-parts" className="t-h2">
            {PRESSE.parts.title}
          </h2>
          <p className="pz-line">{PRESSE.parts.line}</p>
          <ul className="pz-parts">
            {PRESSE.parts.items.map((part) => (
              <li key={part.name} className="pz-part" data-tone={part.tone}>
                <div className="pz-part-text">
                  <h3>{part.name}</h3>
                  <p>{part.body}</p>
                  <Download href={`/presse/${part.file}`}>{PRESSE.parts.download}</Download>
                </div>
                {/* The phone with its lifted pieces, cut by the card as in the launch mail; the download is the same picture on its tone. */}
                <Image src={part.shot} alt={part.alt} width={866} height={1477} sizes="(max-width: 767px) 70vw, 380px" className="pz-part-shot" />
              </li>
            ))}
          </ul>
          <ul className="pz-soon">
            {PRESSE.parts.soon.items.map((part) => (
              <li key={part.name} className="pz-soon-card" data-tone={part.tone}>
                <h3>{part.name}</h3>
                <span>{PRESSE.parts.soon.label}</span>
              </li>
            ))}
          </ul>
          <p className="note pz-note">{PRESSE.staged}</p>
        </section>

        <section className="pz-sec" aria-labelledby="pz-photos">
          <h2 id="pz-photos" className="t-h2">
            {PRESSE.photos.title}
          </h2>
          <p className="pz-line">{PRESSE.photos.line}</p>
          <ul className="pz-photos">
            {PRESSE.photos.items.map((photo) => (
              <li key={photo.file}>
                <figure>
                  <Image src={`/presse/${photo.file}`} alt={PRESSE.photos.alt} width={1200} height={1600} sizes="(max-width: 767px) 45vw, 330px" />
                  <figcaption>{PRESSE.photos.caption}</figcaption>
                </figure>
                <div className="pz-dls">
                  <Download href={`/presse/${photo.file}`}>
                    {PRESSE.photos.web} ({photo.web})
                  </Download>
                  {'print' in photo ? (
                    <Download href={photo.print.href} quiet external>
                      {PRESSE.photos.print} ({photo.print.size})<span className="sr-only">{PRESSE.newTab}</span>
                    </Download>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="pz-sec" aria-labelledby="pz-logos">
          <h2 id="pz-logos" className="t-h2">
            {PRESSE.logos.title}
          </h2>
          <p className="pz-line">{PRESSE.logos.line}</p>
          <ul className="pz-logos">
            {PRESSE.logos.items.map((logo) => (
              <li key={logo.name}>
                <div className="pz-logo" data-on={logo.surface}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/presse/${logo.preview}`} alt={logo.alt} />
                </div>
                <h3>{logo.name}</h3>
                <div className="pz-dls">
                  <Download href={`/presse/${logo.svg}`}>SVG</Download>
                  <Download href={`/presse/${logo.png}`} quiet>
                    PNG
                  </Download>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="pz-sec" aria-labelledby="pz-coverage">
          <h2 id="pz-coverage" className="t-h2">
            {PRESSE.coverage.title}
          </h2>
          <ul className="pz-coverage">
            {PRESSE.coverage.items.map((item) => (
              <li key={item.href}>
                <a href={item.href} {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                  <span>
                    <b>{item.label}</b>
                    <small>{item.note}</small>
                    {item.external ? <span className="sr-only">{PRESSE.newTab}</span> : null}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M4 10l6-6M5 4h5v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="pz-contact" data-surface="dark" aria-labelledby="pz-contact">
          <h2 id="pz-contact" className="t-h2">
            {PRESSE.contact.title}
          </h2>
          <p className="pz-contact-name">{PRESSE.contact.name}</p>
          <p className="pz-contact-lines">
            <a href={`mailto:${PRESSE.contact.mail}`}>{PRESSE.contact.mail}</a>
            <a href={PRESSE.contact.phoneHref}>{PRESSE.contact.phone}</a>
          </p>
        </section>
      </main>
      <SiteFooter base="/" />
    </div>
  )
}
