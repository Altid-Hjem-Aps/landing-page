'use client'

import { useState } from 'react'
import { CARD_BORDER, CARD_SHADOW, CardHeader, DUR_FAST, DUR_MED, EASE_OUT, EASE_STANDARD, Field, fieldStyle, FOREST, inputCls, mockupEntranceStyle, ON_FOREST_MUTED, parseDanishNumber, RED, RED_WASH, SAGE, SAGE_WASH, useMockupStart } from '@/components/seo/hjemKit'

/**
 * The interactive calculator on /hvad-koster-en-ladeboks. Pure client-side
 * arithmetic on the user's own numbers: monthly home-charging cost from
 * km/month, consumption and their own electricity price, with an optional
 * refusion price showing the with-refund cost next to it. Nothing stored.
 * Inputs are bounded to plausible ranges so a mistyped separator can't
 * skew the estimate silently. Validation is deliberately blur-based: no
 * red while the user is still typing.
 */

const BOUNDS = {
  km: { min: 50, max: 10_000 },
  kwh100: { min: 8, max: 35 },
  price: { min: 0.2, max: 10 },
}

const fmt = (n: number) =>
  n.toLocaleString('da-DK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

type FieldKey = 'km' | 'kwh100' | 'price' | 'refusion'

// Derived from BOUNDS so retuning a range can never leave stale error copy.
const fmtDk = (n: number) =>
  n.toLocaleString('da-DK', { minimumFractionDigits: 0, maximumFractionDigits: 2 })

const PRICE_ERROR = `Indtast en pris mellem ${fmtDk(BOUNDS.price.min)} og ${fmtDk(BOUNDS.price.max)} kr./kWh`

const ERROR_COPY: Record<FieldKey, string> = {
  km: `Indtast et tal mellem ${fmtDk(BOUNDS.km.min)} og ${fmtDk(BOUNDS.km.max)} km`,
  kwh100: `Indtast et tal mellem ${fmtDk(BOUNDS.kwh100.min)} og ${fmtDk(BOUNDS.kwh100.max)} kWh/100 km`,
  price: PRICE_ERROR,
  refusion: PRICE_ERROR,
}

export default function LadeboksCalculator() {
  const { ref, reduced, entered } = useMockupStart()
  const [km, setKm] = useState('1.200')
  const [kwh100, setKwh100] = useState('18')
  const [price, setPrice] = useState('2,50')
  const [refusion, setRefusion] = useState('')
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({ km: false, kwh100: false, price: false, refusion: false })

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

  // Red only after blur: a half-typed "2," must not flash an error.
  // The optional refusion field stays neutral while empty.
  const fieldError: Record<FieldKey, boolean> = {
    km: touched.km && !Number.isFinite(kmN),
    kwh100: touched.kwh100 && !Number.isFinite(kwhN),
    price: touched.price && !Number.isFinite(priceN),
    refusion: touched.refusion && refusionInvalid,
  }

  const blur = (k: FieldKey) => () => setTouched(t => (t[k] ? t : { ...t, [k]: true }))

  const inputStyle = (k: FieldKey) =>
    fieldError[k]
      ? {
          ...fieldStyle,
          background: RED_WASH,
          border: `1px solid ${RED}`,
          // Re-triggers on each valid→invalid flip because the property
          // toggles through 'none' in between; a keyed remount would drop focus.
          animation: reduced ? 'none' : `hjem-invalid-shake ${DUR_FAST}ms ${EASE_STANDARD}`,
        }
      : fieldStyle

  const errorText = (k: FieldKey) =>
    fieldError[k] ? (
      <span id={`ladeboks-${k}-error`} className="block text-[11px] font-medium mt-1" style={{ color: RED }}>
        {ERROR_COPY[k]}
      </span>
    ) : null

  const inputA11y = (k: FieldKey) => ({
    'aria-invalid': fieldError[k] || undefined,
    'aria-describedby': fieldError[k] ? `ladeboks-${k}-error` : undefined,
  })

  return (
    <div
      ref={ref}
      role="group"
      aria-label="Beregner: månedlig udgift til hjemmeladning af elbil"
      className="w-full max-w-[440px] rounded-[24px] px-5 pt-5 pb-5 hjem-motion-scope"
      style={{ backgroundColor: '#ffffff', border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW, fontFamily: 'var(--font-onest)', ...mockupEntranceStyle(entered, reduced) }}
    >
      <CardHeader eyebrow="Månedligt estimat" title="Beregn din ladeudgift" icon="/services/icon-opladning.svg" />

      {/* Error text sits OUTSIDE Field: Field wraps its children in <label>,
          and error copy inside the label would pollute the input's accessible
          name and double-announce alongside aria-describedby. */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <Field label="Km pr. måned">
            <input type="text" inputMode="decimal" className={inputCls} style={inputStyle('km')} value={km} onChange={(e) => setKm(e.target.value)} onBlur={blur('km')} {...inputA11y('km')} />
          </Field>
          {errorText('km')}
        </div>
        <div>
          <Field label="Forbrug (kWh/100 km)">
            <input type="text" inputMode="decimal" className={inputCls} style={inputStyle('kwh100')} value={kwh100} onChange={(e) => setKwh100(e.target.value)} onBlur={blur('kwh100')} {...inputA11y('kwh100')} />
          </Field>
          {errorText('kwh100')}
        </div>
        <div>
          <Field label="Elpris (kr./kWh)">
            <input type="text" inputMode="decimal" className={inputCls} style={inputStyle('price')} value={price} onChange={(e) => setPrice(e.target.value)} onBlur={blur('price')} {...inputA11y('price')} />
          </Field>
          {errorText('price')}
        </div>
        <div>
          <Field label="Evt. elpris efter refusion (kr./kWh)">
            <input type="text" inputMode="decimal" placeholder="F.eks. 0,73" className={inputCls} style={inputStyle('refusion')} value={refusion} onChange={(e) => setRefusion(e.target.value)} onBlur={blur('refusion')} {...inputA11y('refusion')} />
          </Field>
          {errorText('refusion')}
        </div>
      </div>

      {/* The live region node itself must stay stable — keying or swapping it
          would re-announce the whole card on every keystroke. min-height keeps
          the CTA from jumping between the valid and invalid presentations. */}
      <div aria-live="polite" style={{ minHeight: 112 }}>
        {hasCost ? (
          <div
            className="rounded-2xl px-4 py-3 mb-3"
            style={{ backgroundColor: 'var(--forest)', animation: reduced ? 'none' : `hjem-panel-in ${DUR_MED}ms ${EASE_OUT} both` }}
          >
            <p style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: SAGE, marginBottom: 2 }}>
              Estimat
            </p>
            <p className="font-bold text-[17px] leading-tight text-white tabular-nums">
              Ca.{' '}
              <span key={fmt(cost)} style={{ color: SAGE, display: 'inline-block', animation: reduced ? 'none' : `hjem-value-in ${DUR_FAST}ms ${EASE_OUT} both` }}>
                {fmt(cost)} kr.
              </span>{' '}
              om måneden
            </p>
            <p className="tabular-nums" style={{ fontSize: 11, color: ON_FOREST_MUTED, marginTop: 2 }}>
              Estimeret udgift til strøm ved hjemmeladning (
              <span key={fmt(kwhMonth)} style={{ display: 'inline-block', animation: reduced ? 'none' : `hjem-value-in ${DUR_FAST}ms ${EASE_OUT} both` }}>
                {fmt(kwhMonth)} kWh
              </span>
              )
              {Number.isFinite(costRefusion) && (
                <>
                  {' '}· med refusion ca.{' '}
                  <span key={fmt(costRefusion)} style={{ color: SAGE, fontWeight: 600, display: 'inline-block', animation: reduced ? 'none' : `hjem-value-in ${DUR_FAST}ms ${EASE_OUT} both` }}>
                    {fmt(costRefusion)} kr.
                  </span>
                </>
              )}
            </p>
            {refusionInvalid && (
              <p style={{ fontSize: 11, color: SAGE, marginTop: 4 }}>
                Elprisen efter refusion kunne ikke læses og er ikke regnet med.
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-2xl px-4 py-3 mb-3" style={{ backgroundColor: SAGE_WASH, border: `1px solid ${CARD_BORDER}` }}>
            <p className="font-bold text-[14px] leading-tight" style={{ color: FOREST }}>
              Udfyld km, forbrug og elpris med dine egne tal
            </p>
          </div>
        )}
      </div>

      <a
        href="#venteliste"
        className="w-full inline-flex items-center justify-center rounded-full px-6 py-3.5 text-[15px] font-medium transition-opacity hover:opacity-85"
        style={{ backgroundColor: SAGE, color: 'var(--forest)' }}
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
