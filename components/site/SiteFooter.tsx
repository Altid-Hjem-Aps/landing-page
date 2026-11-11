import Image from 'next/image'
import Link from 'next/link'
import CookieSettingsLink from '@/components/CookieSettingsLink'
import NewsletterForm from '@/components/NewsletterForm'
import { FOOTER, QR } from './copy'
import { SOCIAL } from './social'
import StoreLink from './StoreLink'

const SOCIAL_PATHS: Record<string, string> = {
  LinkedIn: 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.54h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5c0-1.2-.02-2.73-1.66-2.73-1.67 0-1.92 1.3-1.92 2.65V21h-4V9.75Z',
  Instagram: 'M12 3.5c2.77 0 3.1.01 4.19.06 2.81.13 4.12 1.46 4.25 4.25.05 1.09.06 1.42.06 4.19s-.01 3.1-.06 4.19c-.13 2.79-1.44 4.12-4.25 4.25-1.09.05-1.42.06-4.19.06s-3.1-.01-4.19-.06c-2.82-.13-4.12-1.47-4.25-4.25C3.51 15.1 3.5 14.77 3.5 12s.01-3.1.06-4.19c.13-2.79 1.44-4.12 4.25-4.25C8.9 3.51 9.23 3.5 12 3.5Zm0 4.1a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8Zm0 1.6a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6Zm4.6-2.8a1.05 1.05 0 1 0 0 2.1 1.05 1.05 0 0 0 0-2.1Z',
  Facebook: 'M13.6 21v-8.2h2.75l.41-3.2H13.6V7.56c0-.93.26-1.56 1.59-1.56h1.7V3.14A22.6 22.6 0 0 0 14.42 3c-2.44 0-4.12 1.49-4.12 4.23V9.6H7.54v3.2h2.76V21h3.3Z',
}

// The footer of the front page and the press page. The SEO pages keep components/Footer.tsx.
// `base` is '' on the front page and '/' elsewhere, so the in-page links lead back to it.
export default function SiteFooter({ base = '' }: { base?: '' | '/' }) {
  return (
    <footer data-b="footer" data-surface="dark" className="ft">
      <div className="ft-inner">
        <div className="ft-brand">
          <a href={`${base}#top`} aria-label={FOOTER.home}>
            <Image src="/site/brand/lockup-white.svg" alt="" width={105} height={33} />
          </a>
          <p className="ft-company">{FOOTER.company}</p>
          <div className="ft-news">
            <NewsletterForm />
          </div>
          <ul className="ft-social">
            {SOCIAL.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
                    <path d={SOCIAL_PATHS[s.label]} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <nav className="ft-col" aria-label={FOOTER.heads.app}>
          <h2>{FOOTER.heads.app}</h2>
          <ul>
            {FOOTER.app.map((l) => (
              <li key={l.href}>
                <a href={base + l.href}>{l.label}</a>
              </li>
            ))}
            <li>
              <StoreLink store="appstore" position="footer">
                {QR.appStore}
              </StoreLink>
            </li>
            <li>
              <StoreLink store="play" position="footer">
                {QR.googlePlay}
              </StoreLink>
            </li>
          </ul>
        </nav>
        <nav className="ft-col ft-more" aria-label={FOOTER.heads.more}>
          <h2>{FOOTER.heads.more}</h2>
          <ul>
            {FOOTER.more.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ft-side">
          <nav className="ft-col" aria-label={FOOTER.heads.help}>
            <h2>{FOOTER.heads.help}</h2>
            <ul>
              {FOOTER.help.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
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
        </div>
      </div>
    </footer>
  )
}
