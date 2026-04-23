const stats = [
  { n: '5–8', label: 'Gennemsnitlige antal leverandører en dansk husstand jonglerer med om måneden' },
  { n: '1', label: 'Regning, ét login og fuldt overblik. Det er det Altid Hjem leverer.' },
  { n: '0 kr.', label: 'Det koster at skrive sig på ventelisten og få tidlig adgang' },
]

export default function Why() {
  return (
    <section className="py-24 px-12" style={{ background: 'var(--cream-dark)' }}>
      <div className="max-w-5xl mx-auto">

        {/* Text */}
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase mb-4" style={{ color: 'var(--text-light)' }}>
            Hvorfor det giver mening
          </p>
          <h2
            className="font-extrabold leading-[1.15] tracking-tight mb-5"
            style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', color: 'var(--forest)' }}
          >
            Overblikket mangler. Ikke pengene.
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--text-mid)' }}>
            De fleste danskere betaler for meget. Ikke fordi de vil, men fordi overblikket mangler. Hjemmets faste udgifter er spredt på mange leverandører, regninger og vilkår.
          </p>
        </div>

        {/* Stats — horizontal row, no cards */}
        <div className="grid grid-cols-3 pt-12">
          {stats.map((s, i) => (
            <div
              key={s.n}
              className="pr-12"
              style={{
                paddingLeft: i > 0 ? 48 : 0,
                paddingRight: i < stats.length - 1 ? 48 : 0,
                borderRight: i < stats.length - 1 ? '1px solid rgba(46,125,82,0.12)' : 'none',
              }}
            >
              <p
                className="font-extrabold leading-none tracking-tight mb-3"
                style={{ fontSize: 'clamp(36px, 4vw, 52px)', color: 'var(--forest)' }}
              >
                {s.n}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-light)' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
