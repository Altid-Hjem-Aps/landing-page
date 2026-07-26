'use client'

import { useState } from 'react'
import { CARD_BORDER, CARD_SHADOW, CardHeader, Field, fieldStyle, FOREST, inputCls, ON_FOREST_MUTED, parseDanishNumber, SAGE, SAGE_WASH } from '@/components/seo/hjemKit'

/**
 * The interactive calculator on /hvad-koster-en-ladeboks. Pure client-side
 * arithmetic on the user's own numbers: monthly home-charging cost from
 * km/month, consumption and their own electricity price, with an optional
 * refusion price showing the with-refund cost next to it. Nothing stored.
 * Inputs are bounded to plausible ranges so a mistyped separator can't
 * skew the estimate silently.
 */

const BOUNDS = {
  km: { min: 50, max: 10_000 },
  kwh100: { min: 8, max: 35 },
  price: { min: 0.2, max: 10 },
}

const fmt = (n: number) =>
  n.toLocaleString('da-DK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

export default function LadeboksCalculator() {
  const [km, setKm] = useState('1.200')
  const [kwh100, setKwh100] = useState('18')
  const [price, setPrice] = useState('2,50')
  const [refusion, setRefusion] = useState('')

  const kmN = parseDanishNumber(km, BOUNDS.km.min, BOUNDS.km.max)
  const kwhN = parseDanishNumber(kwh100, BOUNDS.kwh100.min, BOUNDS.kwh100.max)
  const priceN = parseDanishNumber(price, BOUNDS.price.min, BOUNDS.price.max)
  const refusionN = parseDanishNumber(refusion, BOUNDS.price.min, BOUNDS.price.max)

  const kwhMonth = (kmN / 100) * kwhN
  const cost = kwhMonth * priceN
  const hasCost = Number.isFinite(cost)
  const costRefusion = Number.isFinite(refusionN) ? kwhMonth * refusionN : NaN
  // A filled-but-unreadable refusion field must never look like it was
  // included in the estimate.
  const refusionInvalid = refusion.trim() !== '' && !Number.isFinite(refusionN)

  return (
    <div
      role="group"
      aria-label="Beregner: månedlig udgift til hjemmeladning af elbil"
      className="w-full max-w-[440px] rounded-[24px] px-5 pt-5 pb-5"
      style={{ background: '#ffffff', border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW, fontFamily: 'var(--font-onest)' }}
    >
      <CardHeader eyebrow="Månedligt estimat" title="Beregn din ladepris" icon="/services/icon-opladning.svg" />

      <div className="grid grid-cols-2 gap-3 mb-3">
        <Field label="Km pr. måned">
          <input type="text" inputMode="decimal" className={inputCls} style={fieldStyle} value={km} onChange={(e) => setKm(e.target.value)} />
        </Field>
        <Field label="Forbrug (kWh/100 km)">
          <input type="text" inputMode="decimal" className={inputCls} style={fieldStyle} value={kwh100} onChange={(e) => setKwh100(e.target.value)} />
        </Field>
        <Field label="Elpris (kr./kWh)">
          <input type="text" inputMode="decimal" className={inputCls} style={fieldStyle} value={price} onChange={(e) => setPrice(e.target.value)} />
        </Field>
        <Field label="Evt. refusionspris (kr./kWh)">
          <input type="text" inputMode="decimal" placeholder="F.eks. 0,73" className={inputCls} style={fieldStyle} value={refusion} onChange={(e) => setRefusion(e.target.value)} />
        </Field>
      </div>

      <div aria-live="polite">
        {hasCost ? (
          <div className="rounded-2xl px-4 py-3 mb-3" style={{ background: 'var(--forest)' }}>
            <p style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: SAGE, marginBottom: 2 }}>
              Estimat
            </p>
            <p className="font-bold text-[17px] leading-tight text-white">
              Ca. <span style={{ color: SAGE }}>{fmt(cost)} kr.</span> om måneden
            </p>
            <p style={{ fontSize: 11, color: ON_FOREST_MUTED, marginTop: 2 }}>
              Estimeret udgift til strøm ved hjemmeladning ({fmt(kwhMonth)} kWh)
              {Number.isFinite(costRefusion) && (
                <>
                  {' '}· med refusion ca. <span style={{ color: SAGE, fontWeight: 600 }}>{fmt(costRefusion)} kr.</span>
                </>
              )}
            </p>
            {refusionInvalid && (
              <p style={{ fontSize: 11, color: SAGE, marginTop: 4 }}>
                Refusionsprisen kunne ikke læses og er ikke regnet med.
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-2xl px-4 py-3 mb-3" style={{ background: SAGE_WASH, border: `1px solid ${CARD_BORDER}` }}>
            <p className="font-bold text-[14px] leading-tight" style={{ color: FOREST }}>
              Udfyld km, forbrug og elpris med jeres egne tal
            </p>
          </div>
        )}
      </div>

      <a
        href="#venteliste"
        className="w-full inline-flex items-center justify-center rounded-full px-6 py-3.5 text-[15px] font-medium transition-opacity hover:opacity-85"
        style={{ background: SAGE, color: 'var(--forest)' }}
      >
        Få opladning med i hjemmets overblik
      </a>

      <p className="text-[11px] mt-3 leading-relaxed" style={{ color: 'rgba(26,61,34,0.55)' }}>
        Estimatet bygger alene på dine egne tal og er ikke et pristilbud. Hjemmeladning koster typisk
        2,00-3,50 kr. pr. kWh før refusion; en refusionsaftale kan ændre regnestykket. Intet gemmes,
        når du beregner.
      </p>
    </div>
  )
}
