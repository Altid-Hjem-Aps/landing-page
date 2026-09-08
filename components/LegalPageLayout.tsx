import type { ReactNode } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

// Shared shell for the legal/support pages (/privatlivspolitik, /kontakt,
// /slet-konto). Same surface as the SEO articles: forest nav over a cream
// body, so the nav keeps its edge and the copy reads on a light ground.
// These are documents people have to actually read, so body copy is 16px on
// a ~70-character measure (max-w-xl) rather than the 14px/95ch the pages
// shipped with.

/** Body copy colour on cream. */
export const LEGAL_BODY = 'rgba(26,61,34,0.75)'
/** Metadata, dates, back link. */
export const LEGAL_MUTED = 'rgba(26,61,34,0.55)'
/** Hairline borders on cream. */
export const LEGAL_RULE = '1px solid rgba(26,61,34,0.1)'

/** Numbered/section heading inside a legal document. */
export const LEGAL_H2 = 'text-xl font-semibold text-forest mb-4'
/** Bold run-in label above or in front of a short block. */
export const LEGAL_LABEL = 'font-semibold text-forest'
/** Inline text link inside legal copy. */
export const LEGAL_LINK = 'text-forest underline underline-offset-2 transition-opacity hover:opacity-70'
/** Hanging bullet list. */
export const LEGAL_LIST = 'list-disc pl-5 space-y-1.5'

interface LegalAddressProps {
  name: string
  children: ReactNode
}

/** Postal/contact block rendered as a small white card, like the SEO tables. */
export function LegalAddress({ name, children }: LegalAddressProps) {
  return (
    <div
      className="rounded-xl bg-white px-5 py-4 leading-relaxed"
      style={{ border: LEGAL_RULE, boxShadow: '0 1px 3px rgba(26,61,34,0.06)' }}
    >
      <p className={LEGAL_LABEL}>{name}</p>
      {children}
    </div>
  )
}

interface LegalPageLayoutProps {
  title: string
  /** Entity line under the title, e.g. "Altid Hjem ApS · CVR 45637476". */
  meta: string
  /** "Senest opdateret" — omit on pages without a revision date. */
  updated?: string
  children: ReactNode
}

export default function LegalPageLayout({ title, meta, updated, children }: LegalPageLayoutProps) {
  return (
    <>
      <Nav />
      <main className="min-h-screen pt-28 pb-24" style={{ background: 'var(--cream)', fontFamily: 'var(--font-onest)' }}>
        <div className="max-w-xl mx-auto px-6">

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm mb-10 transition-opacity hover:opacity-70"
            style={{ color: LEGAL_MUTED }}
          >
            <span aria-hidden="true">←</span> Tilbage
          </Link>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-forest mb-3">{title}</h1>
            <p className="text-sm" style={{ color: LEGAL_MUTED }}>{meta}</p>
            {updated && (
              <p className="text-sm mt-1" style={{ color: LEGAL_MUTED }}>Senest opdateret: {updated}</p>
            )}
          </header>

          <div className="space-y-12 text-[16px] leading-[1.7]" style={{ color: LEGAL_BODY }}>
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
