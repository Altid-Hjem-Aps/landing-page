const stats = [
  {
    n: '5–8',
    label: 'Leverandører en gennemsnitlig dansk husstand jonglerer med til hjemmets faste udgifter',
    labelShort: 'Leverandører pr. husstand',
  },
  {
    n: '40–50',
    label: 'Regninger en dansk husstand modtager om året — spredt på mail, e-Boks og papir',
    labelShort: 'Regninger om året',
  },
  {
    n: '1',
    label: 'Samlet regning, ét login og fuldt overblik. Det er det Altid Hjem leverer.',
    labelShort: 'Regning. Ét login.',
  },
]

export default function Why() {
  return (
    <section className="py-12 sm:py-24 px-6 sm:px-10 lg:px-12" style={{ background: 'var(--cream-dark)' }}>
      <div className="max-w-5xl mx-auto">

        {/* Text */}
        <div className="max-w-2xl mb-6 sm:mb-16 sm:mx-0 text-center sm:text-left">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase mb-3 sm:mb-4" style={{ color: 'var(--text-light)' }}>
            Hvorfor det giver mening
          </p>
          <h2
            className="font-extrabold leading-[1.15] tracking-tight mb-3 sm:mb-5"
            style={{ fontSize: 'clamp(24px, 3.5vw, 44px)', color: 'var(--forest)' }}
          >
            Ét hjem. For mange regninger.
          </h2>
          <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-mid)' }}>
            De fleste danskere modtager 40–50 regninger om året og jonglerer med op til 8 leverandører. Ikke fordi de vil, men fordi der aldrig har været et alternativ.
          </p>
        </div>

        {/* Stats — 3-col on mobile too, compact */}
        <div className="grid grid-cols-3 pt-5 sm:pt-12">
          {stats.map((s, i) => (
            <div
              key={s.n}
              className={[
                'py-0 sm:py-0',
                i < stats.length - 1 ? 'border-r' : '',
                i > 0 ? 'pl-3 sm:pl-12' : '',
                i < stats.length - 1 ? 'pr-3 sm:pr-12' : '',
              ].filter(Boolean).join(' ')}
              style={{ borderColor: 'rgba(46,125,82,0.12)' }}
            >
              <p
                className="font-extrabold leading-none tracking-tight mb-1.5 sm:mb-3 text-center sm:text-left"
                style={{ fontSize: 'clamp(20px, 5.5vw, 52px)', color: 'var(--forest)' }}
              >
                {s.n}
              </p>
              <p className="hidden sm:block text-sm leading-relaxed" style={{ color: 'var(--text-light)' }}>
                {s.label}
              </p>
              <p className="block sm:hidden leading-snug text-center sm:text-left" style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                {s.labelShort}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
