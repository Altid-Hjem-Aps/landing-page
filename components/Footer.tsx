import Link from 'next/link'
import { Logo } from '@/components/Logo'
import CookieSettingsLink from '@/components/CookieSettingsLink'

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

// Rounded top that overlaps the section above by its radius, on every page.
export default function Footer({ sampleData = false }: { sampleData?: boolean }) {
  return (
    <footer
      className="relative z-[1] mt-[-32px] rounded-t-[32px] px-6 pt-14 pb-8 sm:px-10 lg:px-16"
      style={{ background: '#163223', color: '#fff' }}
    >
      <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-x-12">
        <div className="col-span-2 md:col-span-1">
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
