'use client'

import { ChaosCard } from './why/ChaosCard'
import { VictoriousCard } from './why/VictoriousCard'
import { FloatingStat } from './why/FloatingStat'
import { CHAOS_BILLS, CHAOS_BILLS_MOBILE } from './why/cards'

function scrollToWaitlist() {
  const el = document.getElementById('venteliste')
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('expand-waitlist'))
  }, 450)
}

export default function Why() {
  return (
    <section className="py-12 sm:py-24 px-6 sm:px-10 lg:px-12" style={{ background: 'var(--cream-dark)' }}>
      <div className="max-w-6xl mx-auto">

        {/* PHASE A — STATIC PREVIEW: Act 1 (chaos) and Act 3 (victorious) side by side. */}
        {/* Phase B will replace this with a sticky scroll-driven canvas. */}

        {/* Section heading */}
        <div className="max-w-2xl mb-12 sm:mb-20 text-center sm:text-left">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase mb-3 sm:mb-4" style={{ color: 'var(--text-light)' }}>
            Hvorfor det giver mening
          </p>
          <h2
            className="font-extrabold leading-[1.1] tracking-tight mb-4"
            style={{ fontSize: 'clamp(28px, 4vw, 52px)', color: 'var(--forest)' }}
          >
            Ét hjem. For mange regninger.
          </h2>
          <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-mid)' }}>
            Strøm hos én, mobil hos en anden, forsikring hos en tredje. Spredt på mail, e-Boks og papir — uden noget samlet overblik.
          </p>
        </div>

        {/* Two static frames stacked vertically for visual review */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* === ACT 1: CHAOS === */}
          <div>
            <p className="text-[11px] font-bold tracking-[0.15em] uppercase mb-4" style={{ color: 'rgba(46,125,82,0.55)' }}>
              Uden Altid Hjem
            </p>
            <div
              className="relative overflow-hidden rounded-2xl"
              style={{
                height: 520,
                background: 'linear-gradient(160deg, #f0e8d8 0%, #e6dcc8 100%)',
                border: '1px solid rgba(46,125,82,0.08)',
              }}
            >
              {/* Floating stats */}
              <FloatingStat
                number="5–8"
                label="leverandører"
                style={{ position: 'absolute', top: 24, left: 24, zIndex: 0 }}
              />
              <FloatingStat
                number="40–50"
                label="regninger om året"
                style={{ position: 'absolute', bottom: 24, right: 24, zIndex: 0, textAlign: 'right' }}
                className="[&>p:nth-child(2)]:tracking-[0.16em]"
              />

              {/* Chaos pile — desktop (8 cards) */}
              <div className="hidden sm:block absolute inset-0 z-10">
                {CHAOS_BILLS.map((bill) => (
                  <div
                    key={bill.type}
                    className="absolute top-1/2 left-1/2"
                    style={{
                      transform: `translate(-50%, -50%) translate(${bill.x}px, ${bill.y}px) rotate(${bill.rotate}deg)`,
                      zIndex: bill.z,
                    }}
                  >
                    <ChaosCard bill={bill} />
                  </div>
                ))}
              </div>

              {/* Chaos pile — mobile (4 cards, tighter scatter) */}
              <div className="sm:hidden absolute inset-0 z-10">
                {CHAOS_BILLS_MOBILE.map((bill, i) => (
                  <div
                    key={bill.type}
                    className="absolute top-1/2 left-1/2"
                    style={{
                      transform: `translate(-50%, -50%) translate(${bill.x * 0.55}px, ${bill.y * 0.55}px) rotate(${bill.rotate}deg) scale(0.78)`,
                      zIndex: i + 1,
                    }}
                  >
                    <ChaosCard bill={bill} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* === ACT 3: VICTORIOUS === */}
          <div>
            <p className="text-[11px] font-bold tracking-[0.15em] uppercase mb-4" style={{ color: 'var(--sage-dark, #2e7d52)' }}>
              Med Altid Hjem
            </p>
            <div
              className="relative rounded-2xl flex items-center justify-center"
              style={{
                height: 520,
                background: 'linear-gradient(160deg, var(--forest) 0%, #0f3a26 100%)',
                border: '1px solid rgba(168,224,99,0.18)',
                overflow: 'hidden',
              }}
            >
              {/* Soft sage radial backdrop */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(168,224,99,0.12) 0%, rgba(168,224,99,0) 60%)',
                }}
              />
              <VictoriousCard onCtaClick={scrollToWaitlist} />
            </div>
          </div>

        </div>

        {/* Verdict */}
        <p
          className="mt-10 sm:mt-14 text-center font-semibold tracking-tight"
          style={{ fontSize: 'clamp(20px, 2.4vw, 28px)', color: 'var(--forest)' }}
        >
          1 regning. Ét login. <span style={{ color: 'var(--sage-dark, #2e7d52)' }}>Fuldt overblik.</span>
        </p>

      </div>
    </section>
  )
}
