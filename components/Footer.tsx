import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { FINE_PRINT } from '@/lib/typography'

const footerLinks = [
  { href: '/kontakt', label: 'Support' },
  { href: '/privatlivspolitik', label: 'Privatlivspolitik' },
]

// Official profiles (LinkedIn from the published Resend template, Instagram
// verified @altidhjem, Facebook page id from Thor).
const socialLinks = [
  { href: 'https://www.linkedin.com/company/altid-hjem/', label: 'LinkedIn' },
  { href: 'https://www.instagram.com/altidhjem/', label: 'Instagram' },
  { href: 'https://www.facebook.com/profile.php?id=61590767814024', label: 'Facebook' },
]

// The six subbrand icons shown as a row next to the logo, like the Figma footer.
const SUBBRAND_ICONS = [
  '/services/icon-strom.svg',
  '/services/icon-mad.svg',
  '/services/icon-forsikring.svg',
  '/services/icon-alarm.svg',
  '/services/icon-mobil.svg',
  '/services/icon-opladning.svg',
]

export default function Footer() {
  return (
    <footer
      className="flex flex-wrap items-center justify-between gap-y-4 gap-x-8 px-6 sm:px-10 lg:px-[clamp(48px,3.7vw,72px)] py-6 sm:py-7"
      style={{ background: '#163223', borderTop: '1px solid rgba(255,255,255,0.08)' }}
    >
      {/* Left — wordmark + subbrand icon row (sized to the Figma footer) */}
      <div className="flex items-center gap-8">
        <Logo className="h-12 w-auto" variant="forest" />
        <div className="flex items-center gap-5" aria-hidden>
          {SUBBRAND_ICONS.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" className="w-10 h-10 rounded-full" />
          ))}
        </div>
      </div>

      {/* Right — links + ©. One inline run on desktop; on mobile two lines
          with the links on top and the copyright below. */}
      <p className={`${FINE_PRINT} flex flex-col gap-1.5 max-lg:w-full max-lg:text-center lg:block`} style={{ color: 'rgba(255,255,255,0.6)' }}>
        <span className="order-2 lg:order-none">
          © 2026 Altid Hjem · Skabt af teamet bag{' '}
          <a
            href="https://altidenergi.dk"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 hover:underline"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            Altid Energi
          </a>
        </span>
        <span className="order-1 lg:order-none">
          <span className="hidden lg:inline">{' · '}</span>
          {footerLinks.map(({ href, label }, i) => (
            <span key={href}>
              {i > 0 && ' · '}
              <Link
                href={href}
                className="underline-offset-2 hover:underline"
                style={{ color: 'rgba(255,255,255,0.85)' }}
              >
                {label}
              </Link>
            </span>
          ))}
          {socialLinks.map(({ href, label }) => (
            <span key={href}>
              {' · '}
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:underline"
                style={{ color: 'rgba(255,255,255,0.85)' }}
              >
                {label}
              </a>
            </span>
          ))}
          {' · '}
          <Link
            href="/slet-konto"
            className="underline-offset-2 hover:underline"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            Slet konto
          </Link>
        </span>
      </p>
    </footer>
  )
}
