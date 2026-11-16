import Image from 'next/image'
import Link from 'next/link'
import CookieSettingsLink from '@/components/CookieSettingsLink'
import NewsletterForm from '@/components/NewsletterForm'
import { qrImage } from '@/lib/store-links'
import { FOOTER, QR } from './copy'
import FooterLogo from './FooterLogo'
import GetAppButton from './GetAppButton'
import { SOCIAL } from './social'

const SOCIAL_PATHS: Record<string, string> = {
  LinkedIn: 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.54h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5c0-1.2-.02-2.73-1.66-2.73-1.67 0-1.92 1.3-1.92 2.65V21h-4V9.75Z',
  Instagram: 'M12 3.5c2.77 0 3.1.01 4.19.06 2.81.13 4.12 1.46 4.25 4.25.05 1.09.06 1.42.06 4.19s-.01 3.1-.06 4.19c-.13 2.79-1.44 4.12-4.25 4.25-1.09.05-1.42.06-4.19.06s-3.1-.01-4.19-.06c-2.82-.13-4.12-1.47-4.25-4.25C3.51 15.1 3.5 14.77 3.5 12s.01-3.1.06-4.19c.13-2.79 1.44-4.12 4.25-4.25C8.9 3.51 9.23 3.5 12 3.5Zm0 4.1a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8Zm0 1.6a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6Zm4.6-2.8a1.05 1.05 0 1 0 0 2.1 1.05 1.05 0 0 0 0-2.1Z',
  Facebook: 'M13.6 21v-8.2h2.75l.41-3.2H13.6V7.56c0-.93.26-1.56 1.59-1.56h1.7V3.14A22.6 22.6 0 0 0 14.42 3c-2.44 0-4.12 1.49-4.12 4.23V9.6H7.54v3.2h2.76V21h3.3Z',
}

// Small line marks for the company facts, drawn here (stroke, 24 px grid).
const FACT_MARK = {
  company: 'M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16M15 9h4a1 1 0 0 1 1 1v11M2.5 21h19M8 8h3M8 12h3M8 16h3',
  address: 'M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  email: 'M3.5 6.5h17v11h-17zM3.5 7l8.5 6.5L20.5 7',
  press: 'M5 4.5h11.5v15H6.5A1.5 1.5 0 0 1 5 18V4.5ZM16.5 8.5H19V18a1.5 1.5 0 0 1-3 0M8 8h5.5M8 11.5h5.5M8 15h3.5',
} as const

function Fact({ mark, children }: { mark: keyof typeof FACT_MARK; children: React.ReactNode }) {
  return (
    <li className="ft-fact">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={FACT_MARK[mark]} />
      </svg>
      <span>{children}</span>
    </li>
  )
}

// The footer of the front page, the guides and the press page, in Alona's structure (Thor
// 15/11), all in white: five columns of about the same height (the newsletter, customer service
// with the Kontakt page's facts, Juridisk, the social profiles with their names, and
// "Hent appen" like Boozt's: a QR code on a computer, the one button to the visitor's own store
// on a phone), the company facts on one line under them, and the logo on one line at the end.
// No guides (the front page's blog cards link them all) and no list of the services (the nav
// has them), so the footer has room to breathe. `base` is '' on the front page and '/'
// elsewhere, so the logo's link leads back to the front page's top.
export default function SiteFooter({ base = '' }: { base?: '' | '/' }) {
  return (
    <footer data-b="footer" data-surface="dark" className="ft">
      <div className="ft-inner">
        <section className="ft-col ft-news" aria-label={FOOTER.heads.news}>
          <h2>{FOOTER.heads.news}</h2>
          <NewsletterForm heading={false} typewriter={FOOTER.newsletterTyped} />
        </section>

        <section className="ft-col ft-service" aria-label={FOOTER.heads.service}>
          <h2>{FOOTER.heads.service}</h2>
          <dl>
            <dt>{FOOTER.service.app.label}</dt>
            <dd>
              <a href={FOOTER.service.app.href}>{FOOTER.service.app.text}</a>
            </dd>
            <dt>{FOOTER.service.energi.label}</dt>
            <dd>
              <a href={FOOTER.service.energi.phone.href}>{FOOTER.service.energi.phone.text}</a>
            </dd>
            <dd>
              <a href={FOOTER.service.energi.mail.href}>{FOOTER.service.energi.mail.text}</a>
            </dd>
            <dd className="ft-hours">{FOOTER.service.energi.hours}</dd>
          </dl>
        </section>

        <nav className="ft-col" aria-label={FOOTER.heads.legal}>
          <h2>{FOOTER.heads.legal}</h2>
          <ul>
            {FOOTER.legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
            <li>
              <CookieSettingsLink className="ft-cookie" />
            </li>
          </ul>
        </nav>

        <nav className="ft-col" aria-label={FOOTER.heads.social}>
          <h2>{FOOTER.heads.social}</h2>
          <ul className="ft-social">
            {SOCIAL.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                    <path d={SOCIAL_PATHS[s.label]} />
                  </svg>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Boozt's "Hent vores app": the code on a computer, the visitor's store on a phone. */}
        <section className="ft-col ft-app" aria-label={FOOTER.heads.getApp}>
          <h2>{FOOTER.heads.getApp}</h2>
          <div className="ft-qr">
            <span className="ft-qr-tile">
              <Image src={qrImage('footer')} alt={QR.alt} width={104} height={104} />
            </span>
            <p>{QR.line}</p>
          </div>
          <GetAppButton position="footer" />
        </section>

      </div>
      {/* The logo on one line across the bottom, in place of the small one top left (Thor 15/11). */}
      {/* The logo on one line, and the company facts in the band under "altid", up to where the
          "j" of "hjem" comes down (Thor 15/11), so they sit in the logo by design. */}
      <div className="ft-end">
        <FooterLogo href={`${base}#top`} label={FOOTER.home} />
        <ul className="ft-facts">
          <Fact mark="company">{FOOTER.company}</Fact>
          <Fact mark="address">{FOOTER.address}</Fact>
          <Fact mark="email">
            <a href={`mailto:${FOOTER.email}`}>{FOOTER.email}</a>
          </Fact>
          <Fact mark="press">
            <Link href={FOOTER.press.href}>{FOOTER.press.label}</Link>
          </Fact>
        </ul>
      </div>
    </footer>
  )
}
