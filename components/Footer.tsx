import Link from 'next/link'
import { Logo } from '@/components/Logo'
import CookieSettingsLink from '@/components/CookieSettingsLink'
import NewsletterForm from '@/components/NewsletterForm'
import './site/footer-front.css'

const SITE_LINKS = [
  { href: '/kontakt', label: 'Support' },
  { href: '/privatlivspolitik', label: 'Privatlivspolitik' },
  { href: '/slet-konto', label: 'Slet konto' },
]

// Official profiles (LinkedIn from the published Resend template, Instagram
// verified @altidhjem, Facebook page id from Thor).
const SOCIAL_LINKS = [
  { href: 'https://www.linkedin.com/company/altid-hjem/', label: 'LinkedIn' },
  { href: 'https://www.instagram.com/altidhjem/', label: 'Instagram' },
  { href: 'https://www.facebook.com/profile.php?id=61590767814024', label: 'Facebook' },
]

// The SEO pages about what is in the app today.
const READ_MORE_LINKS = [
  { href: '/hvornar-er-strommen-billigst', label: 'Hvornår er strømmen billigst?' },
  { href: '/billigste-elselskab', label: 'Billigste elselskab' },
  { href: '/gennemsnitligt-elforbrug', label: 'Gennemsnitligt elforbrug' },
  { href: '/hvad-koster-forsikring', label: 'Hvad koster forsikring?' },
  { href: '/skift-forsikringsselskab', label: 'Skift forsikringsselskab' },
  { href: '/bedste-budget-app', label: 'Bedste budget-app' },
]

// Only the services in the app.
const SERVICE_ICONS = ['madplan', 'strom', 'forsikring', 'okonomi']

const LINK = 'inline-flex min-h-[44px] items-center underline-offset-2 hover:underline'

function Column({ title, className, children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <p className="text-[13px] font-medium" style={{ color: 'rgb(255 255 255 / 0.6)' }}>
        {title}
      </p>
      <ul className="mt-2 text-[15px]" style={{ color: 'rgb(255 255 255 / 0.9)' }}>
        {children}
      </ul>
    </div>
  )
}

const SOCIAL_ICONS: Record<string, string> = {
  LinkedIn:
    'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.83v1.54h.05c.53-1 1.84-2.05 3.78-2.05 4.04 0 4.79 2.66 4.79 6.12V21h-4v-5.01c0-1.2-.02-2.73-1.66-2.73-1.67 0-1.92 1.3-1.92 2.65V21h-4V9.75Z',
  Instagram:
    'M12 3.6c2.74 0 3.06.01 4.14.06 1 .05 1.54.21 1.9.35.48.19.82.41 1.18.77.36.36.58.7.77 1.18.14.36.3.9.35 1.9.05 1.08.06 1.4.06 4.14s-.01 3.06-.06 4.14c-.05 1-.21 1.54-.35 1.9-.19.48-.41.82-.77 1.18-.36.36-.7.58-1.18.77-.36.14-.9.3-1.9.35-1.08.05-1.4.06-4.14.06s-3.06-.01-4.14-.06c-1-.05-1.54-.21-1.9-.35a3.17 3.17 0 0 1-1.18-.77 3.17 3.17 0 0 1-.77-1.18c-.14-.36-.3-.9-.35-1.9C3.61 15.06 3.6 14.74 3.6 12s.01-3.06.06-4.14c.05-1 .21-1.54.35-1.9.19-.48.41-.82.77-1.18.36-.36.7-.58 1.18-.77.36-.14.9-.3 1.9-.35C8.94 3.61 9.26 3.6 12 3.6Zm0 1.8c-2.7 0-3 .01-4.05.06-.86.04-1.33.18-1.64.3-.41.16-.7.35-1.01.66-.31.31-.5.6-.66 1.01-.12.31-.26.78-.3 1.64C4.29 9.13 4.28 9.43 4.28 12s.01 2.87.06 3.93c.04.86.18 1.33.3 1.64.16.41.35.7.66 1.01.31.31.6.5 1.01.66.31.12.78.26 1.64.3 1.06.05 1.36.06 4.05.06s2.99-.01 4.05-.06c.86-.04 1.33-.18 1.64-.3.41-.16.7-.35 1.01-.66.31-.31.5-.6.66-1.01.12-.31.26-.78.3-1.64.05-1.06.06-1.36.06-3.93s-.01-2.87-.06-3.93c-.04-.86-.18-1.33-.3-1.64a2.73 2.73 0 0 0-.66-1.01 2.73 2.73 0 0 0-1.01-.66c-.31-.12-.78-.26-1.64-.3C14.99 5.41 14.69 5.4 12 5.4Zm0 2.2a4.4 4.4 0 1 1 0 8.8 4.4 4.4 0 0 1 0-8.8Zm0 1.8a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2Zm5.6-2.1a1.03 1.03 0 1 1-2.06 0 1.03 1.03 0 0 1 2.06 0Z',
  Facebook:
    'M13.6 21v-8.2h2.75l.41-3.2H13.6V7.56c0-.93.26-1.56 1.59-1.56h1.7V3.14A22.6 22.6 0 0 0 14.42 3c-2.45 0-4.12 1.5-4.12 4.24V9.6H7.54v3.2h2.76V21h3.3Z',
}

// The front page's footer: the reference's layout, with the newsletter between the
// contact line and the links.
function FrontFooter({ sampleData }: { sampleData: boolean }) {
  return (
    <footer className="ft-front">
      <div className="ft-panel">
        <div className="ft-top">
          <p className="ft-big">Kontakt os</p>
          <a href="mailto:hej@altidhjem.dk" className="ft-big ft-mail">
            hej@altidhjem.dk
          </a>
        </div>

        <NewsletterForm className="ft-news" />

        <div className="ft-down">
          <div className="ft-legal">
            <p>© 2026 Altid Hjem ApS · CVR 45637476</p>
            {SITE_LINKS.map(({ href, label }) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
            <CookieSettingsLink className="cursor-pointer" />
          </div>
          <ul className="ft-social">
            {SOCIAL_LINKS.map(({ href, label }) => (
              <li key={href}>
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d={SOCIAL_ICONS[label]} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="ft-more">
          {READ_MORE_LINKS.map(({ href, label }) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
          {sampleData && <p>Skærmbilleder fra appen med eksempeldata.</p>}
        </div>
      </div>
    </footer>
  )
}

// Rounded top that overlaps the section above by its radius, on every page. The SEO
// pages keep this one; the front page passes front.
export default function Footer({ sampleData = false, front = false }: { sampleData?: boolean; front?: boolean }) {
  if (front) return <FrontFooter sampleData={sampleData} />
  return (
    <footer
      className="relative z-[1] mt-[-32px] rounded-t-[32px] px-6 pt-14 pb-8 sm:px-10 lg:px-16"
      style={{ background: '#163223', color: '#fff' }}
    >
      <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-[1.6fr_1fr_1fr] md:gap-x-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="col-span-2 md:col-span-3 lg:col-span-1">
          <Logo className="w-32 h-auto" variant="forest" />
          <div className="mt-6 flex items-center gap-2.5" aria-hidden>
            {SERVICE_ICONS.map((name) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={name} src={`/site/icons/${name}.svg`} alt="" className="h-9 w-9" />
            ))}
          </div>
        </div>

        <Column title="Læs mere" className="col-span-2 md:col-span-1">
          {READ_MORE_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={LINK}>
                {label}
              </Link>
            </li>
          ))}
        </Column>

        <Column title="Altid Hjem">
          {SITE_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={LINK}>
                {label}
              </Link>
            </li>
          ))}
          <li>
            <CookieSettingsLink className={`${LINK} cursor-pointer`} />
          </li>
        </Column>

        <Column title="Følg os">
          {SOCIAL_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a href={href} target="_blank" rel="noopener noreferrer" className={LINK}>
                {label}
              </a>
            </li>
          ))}
        </Column>
      </div>

      <div
        className="mx-auto mt-10 max-w-[1240px] border-t pt-5 text-[13px] leading-[1.6]"
        style={{ borderColor: 'rgb(255 255 255 / 0.14)', color: 'rgb(255 255 255 / 0.65)' }}
      >
        <p>
          © 2026 Altid Hjem ApS · CVR 45637476 · Skabt af teamet bag{' '}
          <a href="https://altidenergi.dk" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
            Altid Energi
          </a>
        </p>
        {sampleData && <p>Skærmbilleder fra appen med eksempeldata.</p>}
      </div>
    </footer>
  )
}
