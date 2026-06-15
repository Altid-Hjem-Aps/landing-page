import Link from 'next/link'
import { Logo } from '@/components/Logo'

const footerLinks = [
  { href: '/kontakt', label: 'Support' },
  { href: '/privatlivspolitik', label: 'Privatlivspolitik' },
  { href: '/slet-konto', label: 'Slet konto' },
]

export default function Footer() {
  return (
    <footer
      className="flex flex-wrap items-center justify-between gap-y-3 px-6 sm:px-10 lg:px-12 py-6 sm:py-8"
      style={{ background: 'var(--forest)', borderTop: '1px solid rgba(255,255,255,0.08)' }}
    >
      <Logo className="h-8 w-auto" variant="white" />
      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
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
        {footerLinks.map(({ href, label }) => (
          <span key={href}>
            {' · '}
            <Link
              href={href}
              className="underline-offset-2 hover:underline"
              style={{ color: 'rgba(255,255,255,0.85)' }}
            >
              {label}
            </Link>
          </span>
        ))}
      </p>
    </footer>
  )
}
