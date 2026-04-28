// test: vercel-github integration
import { AltidMark } from '@/components/AltidMark'

function AltidEnergiLogo({ className }: { className?: string }) {
  return <img src="/altidenergi-logo-stamp.svg" alt="Altid Energi" className={className} />
}

export default function Trust() {
  return (
    <section className="bg-white py-28 sm:py-24 px-6 sm:px-10 lg:px-12">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* Altid Energi credibility card */}
        <div
          className="rounded-2xl p-8 sm:p-10 flex flex-col gap-7"
          style={{ background: 'var(--forest)' }}
        >
          {/* Hero quote */}
          <blockquote>
            <span
              aria-hidden
              className="block leading-none select-none mt-1"
              style={{ color: 'rgba(168,224,99,0.35)', fontSize: 96, fontFamily: 'Georgia, serif', marginBottom: -28 }}
            >
              &ldquo;
            </span>
            <p
              className="italic leading-snug"
              style={{ color: 'rgba(255,255,255,0.92)', fontSize: 'clamp(20px, 2.2vw, 26px)', fontWeight: 300 }}
            >
              Vi startede med at gøre op med skjulte gebyrer i elmarkedet. Nu gør vi det samme på tværs af alle hjemmets faste udgifter.
            </p>
          </blockquote>

          {/* +14.000 stat — slim attribution row */}
          <div className="flex items-baseline gap-3 pt-1">
            <p className="font-extrabold leading-none text-[34px] sm:text-[40px]" style={{ color: 'var(--sage)' }}>+14.000</p>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>tilfredse danske kunder</p>
          </div>

          {/* Logo at bottom */}
          <div className="flex sm:block justify-center mt-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20 }}>
            <AltidEnergiLogo className="h-10 w-auto" />
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.12em] uppercase mb-4" style={{ color: 'var(--text-light)' }}>
            Vi har gjort det før
          </p>
          <h2
            className="font-extrabold leading-[1.15] tracking-tight mb-5"
            style={{ fontSize: 'clamp(28px, 2.8vw, 36px)', color: 'var(--forest)' }}
          >
            Altid fair,<br className="hidden lg:inline" /> gennemsigtigt og billigt.
          </h2>
          <p className="text-lg leading-relaxed mb-4" style={{ color: 'var(--text-mid)' }}>
            Altid Hjem er skabt af teamet bag Altid Energi, som gjorde op med skjulte gebyrer i elmarkedet. Med over 14.000 kunder har vi bevist, at fair og gennemsigtige priser virker.
          </p>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--text-mid)' }}>
            Nu tager vi samme tilgang til hjemmets faste udgifter, så du altid ved, hvad du betaler for, og hvorfor. Ingen skjulte gebyrer. Fuld gennemsigtighed. <AltidMark />
          </p>
        </div>
      </div>
    </section>
  )
}
