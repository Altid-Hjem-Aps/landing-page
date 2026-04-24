import { AltidMark } from '@/components/AltidMark'

function AltidEnergiLogo({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 225 137.3" fill="none" className={className}>
      {/* "altid" wordmark in accent blue */}
      <path fill="#8fccff" d="M220.5,0v78.4h-10.6v-10.1c-3.2,5.9-9.6,11.8-21.5,11.8-18.1,0-29.6-14-29.6-30.6s12.9-30.4,29.4-30.4,19,6.6,21.3,11.1V0h11ZM169.8,49.5h0c.1,10.7,7.5,20.4,20.2,20.4s10.8-2.3,14.4-6c3.7-3.7,5.8-8.8,5.6-14.5,0-5.7-2.2-10.7-5.8-14.2-3.6-3.6-8.6-5.7-14.2-5.7-12.2,0-20.2,9.3-20.2,20.1Z"/>
      <path fill="#8fccff" d="M136.6,11.7V0h11v11.7h-11ZM136.6,78.4V20.8h11v57.7h-11Z"/>
      <path fill="#8fccff" d="M106.2,78.4V29.4h-10.4v-8.6h10.4V0h11v20.8h11.1v8.6h-11.1v49.1h-11Z"/>
      <path fill="#8fccff" d="M76.6,78.4V0h11v78.4h-11Z"/>
      <path fill="#8fccff" d="M62,20.8v57.7h-11v-10.1c-4,7.7-12.3,11.8-21.4,11.8-18.5,0-29.6-14.4-29.6-30.5s12.8-30.5,29.6-30.5,18.8,6.4,21.4,11.9v-10.2h11ZM11,49.7h0c.1,8.7,6.1,20.1,20.1,20.1s15.1-4.9,17.9-11.4c1.3-2.6,1.9-5.6,2-8.6.1-3-.4-5.9-1.7-8.6-2.8-6.7-9.2-11.9-18.4-11.9s-19.9,9.5-19.9,20.4Z"/>
      {/* "energi" text in white */}
      <text
        x="116.1"
        y="124.7"
        fill="white"
        fontFamily="Onest, system-ui, sans-serif"
        fontSize="36"
        fontWeight="500"
      >energi</text>
    </svg>
  )
}

export default function Trust() {
  return (
    <section className="bg-white py-28 sm:py-24 px-6 sm:px-10 lg:px-12">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* Altid Energi credibility card */}
        <div
          className="rounded-2xl p-6 sm:p-10 flex flex-col gap-6"
          style={{ background: 'var(--forest)' }}
        >
          {/* Stats — +14.000 leads, #1 supports */}
          <div className="grid grid-cols-2 gap-4">
            <div
              className="rounded-xl p-5 flex flex-col"
              style={{ background: 'rgba(168,224,99,0.1)', border: '1px solid rgba(168,224,99,0.18)' }}
            >
              <p className="font-extrabold leading-none text-[28px] sm:text-[38px]" style={{ color: 'var(--sage)' }}>+14.000</p>
              <p className="text-xs leading-relaxed mt-auto pt-3" style={{ color: 'rgba(255,255,255,0.55)' }}>tilfredse danske kunder</p>
            </div>
            <div
              className="rounded-xl p-5 flex flex-col"
              style={{ background: 'rgba(168,224,99,0.1)', border: '1px solid rgba(168,224,99,0.18)' }}
            >
              <p className="font-extrabold leading-none text-[28px] sm:text-[38px]" style={{ color: 'var(--sage)' }}>#1</p>
              <p className="text-xs leading-relaxed mt-auto pt-3" style={{ color: 'rgba(255,255,255,0.55)' }}>Forbrugerrådet Tænk</p>
            </div>
          </div>

          {/* Quote */}
          <p className="text-base italic leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
            "Vi startede med at gøre op med skjulte gebyrer i elmarkedet. Nu gør vi det samme på tværs af alle hjemmets faste udgifter."
          </p>

          {/* Logo at bottom */}
          <div className="flex sm:block justify-center" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20 }}>
            <AltidEnergiLogo className="h-10 w-auto" />
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.12em] uppercase mb-4" style={{ color: 'var(--text-light)' }}>
            Vi har gjort det før
          </p>
          <h2
            className="font-extrabold leading-[1.15] tracking-tight mb-5"
            style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', color: 'var(--forest)' }}
          >
            Gennemsigtighed er vores DNA
          </h2>
          <p className="text-lg leading-relaxed mb-4" style={{ color: 'var(--text-mid)' }}>
            Altid Hjem er bygget af teamet bag Altid Energi. Med over 14.000 danske kunder og topkarakteren fra Forbrugerrådet Tænk har vi bevist at fair, gennemsigtige priser virker.
          </p>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--text-mid)' }}>
            Nu tager vi den samme tilgang og anvender den på alle hjemmets faste udgifter. Ingen overraskelser. Ingen skjulte gebyrer. <AltidMark />
          </p>
        </div>
      </div>
    </section>
  )
}
