'use client'

import { useState } from 'react'
import { CARD_BORDER, CARD_SHADOW, CardHeader, DUR_FAST, EASE_STANDARD, Field, fieldStyle, FOREST, inputCls, mockupEntranceStyle, ON_FOREST_MUTED, parseDanishNumber, RED, RED_WASH, SAGE, SAGE_WASH, useMockupStart, AMBER } from '@/components/seo/hjemKit'

/**
 * The interactive calculator on /graensehandel-beregner (moved from altidmad.dk, 16 Nov 2026).
 * Pure client-side arithmetic on the user's own numbers: transport cost for the trip and the
 * break-even against whatever saving the user expects. The page takes no position on how much
 * anyone saves at the border: the only prefilled figure is the fuel list price (Drivkraft
 * Danmark, July 2026), and it is editable. Each field is bounded to plausible values so a
 * mistyped thousands separator can't silently skew the verdict 1000x. Same maths, labels and
 * defaults as the altidmad.dk calculator, on Altid Hjem's kit.
 */

const BOUNDS = {
  km: { min: 1, max: 3000 },
  kmPerL: { min: 3, max: 60 },
  fuelPrice: { min: 5, max: 50 },
  saving: { min: 0, max: 100_000 },
}

type FieldKey = keyof typeof BOUNDS

const fmt = (n: number) =>
  n.toLocaleString('da-DK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

export default function GraensehandelCalculator() {
  const { ref, reduced, entered } = useMockupStart()
  const [km, setKm] = useState('100')
  const [kmPerL, setKmPerL] = useState('15')
  const [fuelPrice, setFuelPrice] = useState('17,39')
  const [saving, setSaving] = useState('')
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({ km: false, kmPerL: false, fuelPrice: false, saving: false })

  const kmN = parseDanishNumber(km, BOUNDS.km.min, BOUNDS.km.max)
  const kmlN = parseDanishNumber(kmPerL, BOUNDS.kmPerL.min, BOUNDS.kmPerL.max)
  const priceN = parseDanishNumber(fuelPrice, BOUNDS.fuelPrice.min, BOUNDS.fuelPrice.max)
  const savingN = parseDanishNumber(saving, BOUNDS.saving.min, BOUNDS.saving.max)

  const transport = (kmN / kmlN) * priceN
  const hasTransport = Number.isFinite(transport)
  const hasSaving = Number.isFinite(savingN)
  const net = hasTransport && hasSaving ? savingN - transport : NaN
  const paysOff = net > 0

  // An unreadable field is marked after the visitor leaves it (never while typing), so screen
  // readers hear "invalid" on the field itself. The optional saving field stays neutral while empty.
  const invalid: Record<FieldKey, boolean> = {
    km: touched.km && !Number.isFinite(kmN),
    kmPerL: touched.kmPerL && !Number.isFinite(kmlN),
    fuelPrice: touched.fuelPrice && !Number.isFinite(priceN),
    saving: touched.saving && saving.trim() !== '' && !hasSaving,
  }
  const blur = (k: FieldKey) => () => setTouched((t) => (t[k] ? t : { ...t, [k]: true }))
  const inputProps = (k: FieldKey) => ({
    type: 'text',
    inputMode: 'decimal' as const,
    className: inputCls,
    style: invalid[k]
      ? { ...fieldStyle, background: RED_WASH, border: `1px solid ${RED}`, transition: reduced ? 'none' : `background ${DUR_FAST}ms ${EASE_STANDARD}` }
      : fieldStyle,
    onBlur: blur(k),
    'aria-invalid': invalid[k] || undefined,
  })

  return (
    <div
      ref={ref}
      role="group"
      aria-label="Beregner: kan grænsehandelsturen betale sig"
      className="w-full max-w-[440px] rounded-[24px] px-5 pt-5 pb-5 hjem-motion-scope"
      style={{ backgroundColor: '#ffffff', border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW, fontFamily: 'var(--font-onest)', ...mockupEntranceStyle(entered, reduced) }}
    >
      <CardHeader eyebrow="Beregner" title="Kan turen betale sig?" icon="/services/icon-mad.svg" />

      <div className="grid grid-cols-2 gap-3 mb-3 items-end">
        <Field label="Kørsel tur-retur (km)">
          <input {...inputProps('km')} value={km} onChange={(e) => setKm(e.target.value)} />
        </Field>
        <Field label="Bilens forbrug (km/l)">
          <input {...inputProps('kmPerL')} value={kmPerL} onChange={(e) => setKmPerL(e.target.value)} />
        </Field>
        <Field label="Benzinpris (kr./l)">
          <input {...inputProps('fuelPrice')} value={fuelPrice} onChange={(e) => setFuelPrice(e.target.value)} />
        </Field>
        <Field label="Forventet besparelse (kr.)">
          <input {...inputProps('saving')} placeholder="Jeres eget tal" value={saving} onChange={(e) => setSaving(e.target.value)} />
        </Field>
      </div>

      <div aria-live="polite">
        <div className="rounded-2xl px-4 py-3 mb-3" style={{ backgroundColor: SAGE_WASH, border: `1px solid ${CARD_BORDER}` }}>
          <p className="text-[11px] mb-0.5" style={{ color: 'var(--text-light)' }}>
            Brændstof for turen
          </p>
          <p className="font-bold text-[17px] tabular-nums" style={{ color: FOREST }}>
            {hasTransport ? `Ca. ${fmt(transport)} kr.` : 'Udfyld kørsel, forbrug og pris'}
          </p>
          {hasTransport && (
            <p className="text-[12px] mt-1 tabular-nums" style={{ color: 'var(--text-dark)' }}>
              I skal spare mere end {fmt(transport)} kr. på indkøbet, før turen er tjent hjem. Tid og slid på
              bilen er ikke regnet med.
            </p>
          )}
        </div>

        {hasTransport && hasSaving && (
          <div
            className="rounded-2xl px-4 py-3 flex items-center justify-between gap-3"
            // "Does not pay" keeps the altidmad.dk amber: red is for errors on this site.
            style={{ backgroundColor: paysOff ? 'var(--forest)' : AMBER.wash }}
          >
            <div className="min-w-0">
              <p style={{ fontSize: 11, color: paysOff ? ON_FOREST_MUTED : AMBER.ink, marginBottom: 1 }}>
                Besparelse minus brændstof
              </p>
              <p className="font-bold text-[17px] leading-tight tabular-nums" style={{ color: paysOff ? '#ffffff' : AMBER.ink }}>
                {paysOff ? (
                  <>
                    Ca. <span style={{ color: SAGE }}>{fmt(net)} kr.</span> tilbage
                  </>
                ) : net === 0 ? (
                  'Det går præcis lige op'
                ) : (
                  `Turen koster ca. ${fmt(Math.abs(net))} kr. mere, end I sparer`
                )}
              </p>
            </div>
            <span
              className="shrink-0 font-semibold text-[11px] px-2 py-1"
              style={{ borderRadius: 8, backgroundColor: paysOff ? SAGE : 'transparent', border: paysOff ? 'none' : `1px solid ${AMBER.ink}`, color: paysOff ? FOREST : AMBER.ink }}
            >
              {paysOff ? 'På papiret: ja' : 'På papiret: nej'}
            </span>
          </div>
        )}
      </div>

      <p className="text-[11px] mt-3 leading-relaxed" style={{ color: 'var(--text-light)' }}>
        Benzinprisen er forudfyldt med Drivkraft Danmarks listepris for benzin (6. november 2026). Justér den
        til jeres egen pris. Besparelsen er jeres eget skøn; beregneren tager ikke stilling til, hvad I
        kan spare ved grænsen. Intet gemmes, når I beregner.
      </p>
    </div>
  )
}
