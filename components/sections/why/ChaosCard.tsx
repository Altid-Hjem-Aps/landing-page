'use client'

import { motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion'
import { Logo } from '@/components/Logo'
import type { SourceKind } from './cards'

type Source = SourceKind

// Subtle source tint — mail (blue), e-Boks (its official red). Bills from the
// physical letters carry NO badge (a paper bill is self-evidently paper).
const SOURCE_TINT: Record<Source, string> = {
  mail: '#3b6fd4',
  letter: '#8a7350',
  eboks: '#c8102e',
}
const SOURCE_LABEL: Record<Source, string> = {
  mail: 'Mail',
  letter: '',
  eboks: 'e-Boks',
}

export const CHAOS_W = 196
export const CHAOS_H = 250

function SourceBadge({ source }: { source: Source }) {
  const tint = SOURCE_TINT[source]
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-medium tracking-[0.02em] px-1.5 py-0.5 rounded"
      style={{ color: tint, background: `${tint}1f` }}
    >
      <span style={{ width: 5, height: 5, borderRadius: 999, background: tint }} />
      {SOURCE_LABEL[source]}
    </span>
  )
}

// Current month name, cached per runtime. Read lazily at render (NOT module
// scope) so the static prerender doesn't bake the build month into the HTML;
// the span carries suppressHydrationWarning for the server/client delta.
let cachedMonth: string | null = null
const currentMonth = () =>
  (cachedMonth ??= new Intl.DateTimeFormat('da-DK', { month: 'long', timeZone: 'Europe/Copenhagen' }).format(new Date()))

// One stylized paper invoice — off-white sheet with a source badge, the
// provider it comes from, mock body lines and the monthly amount. The chaos
// pile reads as a stack of physical bills at a glance.
export function ChaosCard({ name, provider, amount, dueDay, source }: {
  name: string
  provider?: string
  amount?: number
  dueDay?: number
  source: Source
}) {
  return (
    <div
      style={{
        width: CHAOS_W,
        height: CHAOS_H,
        borderRadius: 4,
        background: '#fefdf8',
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 12px 32px rgba(15,55,30,0.10), 0 2px 6px rgba(15,55,30,0.06)',
        padding: '16px 18px 15px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header: source badge (digital sources only) + due date */}
      <div className="flex items-center justify-between mb-2.5">
        {source !== 'letter' ? <SourceBadge source={source} /> : <span />}
        {dueDay != null && <span suppressHydrationWarning className="text-[10px]" style={{ color: 'rgba(15,55,30,0.45)' }}>{dueDay}. {currentMonth()}</span>}
      </div>

      <span className="text-[10px] font-medium tracking-[0.14em] uppercase mb-1" style={{ color: 'rgba(15,55,30,0.42)' }}>
        Faktura
      </span>

      {/* Document name + issuing provider */}
      <div className="text-[15px] font-medium leading-tight" style={{ color: 'rgba(15,55,30,0.88)' }}>
        {name}
      </div>
      {provider && (
        <div className="text-[11px] mt-0.5 mb-2.5" style={{ color: 'rgba(15,55,30,0.55)' }}>
          {provider}
        </div>
      )}

      <div style={{ height: 1, background: 'rgba(15,55,30,0.12)' }} />

      {/* Mock line-item rows */}
      <div className="flex flex-col gap-[8px] py-[12px] flex-1">
        {[0.78, 0.6, 0.7, 0.55].map((w, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <span style={{ height: 5, width: `${w * 100}%`, background: 'rgba(15,55,30,0.16)', borderRadius: 2 }} />
            <span style={{ height: 5, width: 24, background: 'rgba(15,55,30,0.16)', borderRadius: 2 }} />
          </div>
        ))}
      </div>

      {/* Total row */}
      <div className="flex items-baseline justify-between pt-[10px]" style={{ borderTop: '1px solid rgba(15,55,30,0.18)' }}>
        <span className="text-[11px] font-medium tracking-wider uppercase" style={{ color: 'rgba(15,55,30,0.55)' }}>Pr. måned</span>
        <span className="text-[18px] font-medium tabular-nums" style={{ color: 'rgba(15,55,30,0.88)' }}>
          {amount?.toLocaleString('da-DK')} kr.
        </span>
      </div>
    </div>
  )
}

export const ENVELOPE_W = 180
export const ENVELOPE_H = 116

// A physical letter with a REAL flap: closed it covers the top half; when the
// letter is opened (`flap` 0→1) it swings up around its top edge in 3D and the
// bill slides out over it. `logoStamp` swaps the postage stamp for the Altid
// Hjem wordmark — used ONLY by the exit-intent dialog's big delivery letter;
// the scene envelopes keep the anonymous stamp (they're the OLD bills).
export function Envelope({ flap, logoStamp = false }: { flap?: MotionValue<number>; logoStamp?: boolean }) {
  const fallback = useMotionValue(0)
  const f = flap ?? fallback
  const rotateX = useTransform(f, (v) => -168 * v)
  // Past 90° we see the flap's inside — a slightly lighter paper tone.
  const flapBg = useTransform(f, (v) => (v > 0.55 ? '#f7f3ea' : '#f0ebde'))

  return (
    <div
      className="relative"
      style={{ width: ENVELOPE_W, height: ENVELOPE_H, perspective: 500 }}
    >
      {/* Body */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: 5,
          background: '#fbf8f1',
          border: '1px solid rgba(0,0,0,0.09)',
          boxShadow: '0 10px 26px rgba(15,55,30,0.10), 0 2px 5px rgba(15,55,30,0.06)',
        }}
      >
        {/* Shadow hinting the opening behind the flap */}
        <div
          className="absolute"
          style={{ top: 0, left: 4, right: 4, height: 12, background: 'linear-gradient(180deg, rgba(15,55,30,0.10), transparent)' }}
        />
        {/* Stamp — or the sender's wordmark on the dialog's delivery letter */}
        {logoStamp ? (
          <Logo variant="dark" className="absolute" style={{ bottom: 12, right: 10, width: 48, height: 'auto' }} />
        ) : (
          <div
            className="absolute"
            style={{
              bottom: 12,
              right: 10,
              width: 26,
              height: 30,
              borderRadius: 3,
              background: 'rgba(144,255,124,0.35)',
              border: '1px dashed rgba(15,55,30,0.3)',
            }}
          />
        )}
        {/* Address lines */}
        <div className="absolute left-4 bottom-4 flex flex-col gap-[6px]">
          <span style={{ height: 5, width: 84, background: 'rgba(15,55,30,0.2)', borderRadius: 2 }} />
          <span style={{ height: 5, width: 62, background: 'rgba(15,55,30,0.14)', borderRadius: 2 }} />
        </div>
      </div>

      {/* Flap — a triangle hinged on the envelope's top edge */}
      <motion.div
        aria-hidden
        className="absolute"
        style={{
          top: 0,
          left: 0,
          right: 0,
          height: ENVELOPE_H * 0.52,
          clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
          background: flapBg,
          borderRadius: '5px 5px 0 0',
          boxShadow: 'inset 0 -1px 0 rgba(15,55,30,0.18), inset 0 1px 0 rgba(0,0,0,0.06)',
          transformOrigin: 'top center',
          rotateX,
          zIndex: 2,
        }}
      />
    </div>
  )
}
