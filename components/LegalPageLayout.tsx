import type { ReactNode } from 'react'
import { titleText } from '@/components/site/brand'
import { NAV } from '@/components/site/copy'
import { dmSans } from '@/components/site/fonts'
import Reveal from '@/components/site/Reveal'
import SiteFooter from '@/components/site/SiteFooter'
import SiteNav from '@/components/site/SiteNav'

// The shell for the legal pages (/privatlivspolitik, /slet-konto), in the new site's look like
// /presse and /kontakt (Thor 15/11: the footer's Juridisk links led back to the old site). The
// new nav and footer, the title like Presse's, then the document in one reading column: these
// are pages people have to read, so the text is 17 to 19 px on about 70 characters a line.
// Styled in app/site.css (.lg*); the pages import site.css.

/** Numbered or section heading inside a legal document. */
export const LEGAL_H2 = 'lg-h2'
/** Bold run-in label above or in front of a short block. */
export const LEGAL_LABEL = 'lg-label'
/** Inline text link inside legal copy. */
export const LEGAL_LINK = 'lg-link'
/** Hanging bullet list. */
export const LEGAL_LIST = 'lg-list'

interface LegalAddressProps {
  name: string
  children: ReactNode
}

/** A postal or contact block, as a tinted card like the Kontakt page's. */
export function LegalAddress({ name, children }: LegalAddressProps) {
  return (
    <div className="lg-address" data-tone="sand">
      <p className={LEGAL_LABEL}>{name}</p>
      {children}
    </div>
  )
}

interface LegalPageLayoutProps {
  title: string
  /** Entity line under the title, e.g. "Altid Hjem ApS · CVR 45637476". */
  meta: string
  /** "Senest opdateret": omit on pages without a revision date. */
  updated?: string
  children: ReactNode
}

export default function LegalPageLayout({ title, meta, updated, children }: LegalPageLayoutProps) {
  return (
    <div className={`site ${dmSans.variable}`}>
      <a href="#indhold" className="skip">
        {NAV.skip}
      </a>
      <SiteNav base="/" />
      <main id="indhold" className="pz lg">
        <header className="pz-head">
          <h1 className="t-h1" data-rise="0">
            {titleText(title)}
          </h1>
          <div className="lg-meta" data-rise="1">
            <p>{meta}</p>
            {updated ? <p>Senest opdateret: {updated}</p> : null}
          </div>
        </header>
        <div className="lg-body">{children}</div>
      </main>
      <SiteFooter base="/" />
      <Reveal />
    </div>
  )
}
