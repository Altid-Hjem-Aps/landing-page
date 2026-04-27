'use client'

import { motion, type MotionValue, useMotionValue, useTransform } from 'framer-motion'
import { VICTORIOUS_SERVICES, VICTORIOUS_TOTAL } from './cards'

type Props = {
  onCtaClick?: () => void
  /** When provided, total counts up driven by this scroll progress (0..1).
   *  Counter ramps from 0 → VICTORIOUS_TOTAL between countRange[0] → countRange[1]. */
  countProgress?: MotionValue<number>
  countRange?: [number, number]
  style?: React.CSSProperties
}

const SERVICE_ICONS: Record<string, string> = {
  'Strøm': 'M20.83,25.03c0,.16-.06.31-.18.42-.11.11-.27.18-.42.18h-6.01c-.16,0-.31-.06-.42-.18-.11-.11-.18-.27-.18-.42s.06-.31.18-.42c.11-.11.27-.18.42-.18h6.01c.16,0,.31.06.42.18.11.11.18.27.18.42ZM23.83,15.42c0,1-.22,1.99-.66,2.89-.44.9-1.08,1.69-1.87,2.31-.15.11-.27.26-.35.43-.08.17-.13.35-.13.54v.45c0,.32-.13.62-.35.85-.23.23-.53.35-.85.35h-4.81c-.32,0-.62-.13-.85-.35-.23-.23-.35-.53-.35-.85v-.45c0-.18-.04-.36-.12-.53-.08-.16-.2-.31-.34-.42-.79-.61-1.42-1.4-1.86-2.29-.44-.9-.67-1.88-.67-2.88-.02-3.58,2.87-6.56,6.45-6.65.88-.02,1.76.13,2.58.46.82.32,1.57.81,2.2,1.42.63.62,1.13,1.35,1.47,2.16.34.81.52,1.69.52,2.57Z',
  'Mobil': 'M20.92,8.6h-7.39c-.49,0-.96.19-1.31.54-.35.35-.54.82-.54,1.31v13.55c0,.49.19.96.54,1.31.35.35.82.54,1.31.54h7.39c.49,0,.96-.19,1.31-.54s.54-.82.54-1.31v-13.55c0-.49-.19-.96-.54-1.31-.35-.35-.82-.54-1.31-.54ZM12.91,12.29h8.62v9.85h-8.62v-9.85Z',
  'Forsikring': 'M26.02,16.98c-.14-1.62-.73-3.17-1.71-4.46-.98-1.3-2.3-2.3-3.81-2.89-1.52-.59-3.16-.74-4.76-.43-1.6.3-3.08,1.05-4.27,2.15-1.59,1.46-2.58,3.48-2.76,5.63-.01.17,0,.34.06.5.06.16.14.31.26.44.12.13.26.23.41.3.16.07.33.1.5.1h6.8v4.33c0,.66.26,1.29.72,1.75.46.46,1.09.72,1.75.72s1.29-.26,1.75-.72c.46-.46.72-1.09.72-1.75,0-.16-.07-.32-.18-.44-.12-.12-.27-.18-.44-.18s-.32.07-.44.18c-.12.12-.18.27-.18.44,0,.33-.13.64-.36.87-.23.23-.55.36-.87.36s-.64-.13-.87-.36c-.23-.23-.36-.55-.36-.87v-4.33h6.8c.17,0,.34-.03.5-.1.16-.07.3-.17.42-.3.12-.13.21-.28.26-.44.06-.16.08-.33.06-.51Z',
}

export function VictoriousCard({ onCtaClick, countProgress, countRange = [0.75, 0.95], style }: Props) {
  // Counter — driven by external scroll progress when provided, otherwise static.
  // Hooks must run unconditionally, so use a fallback motion value at full total.
  const fallback = useMotionValue(1)
  const source = countProgress ?? fallback
  const counter = useTransform(source, (p: number) => {
    if (!countProgress) return VICTORIOUS_TOTAL
    const [a, b] = countRange
    if (p <= a) return 0
    if (p >= b) return VICTORIOUS_TOTAL
    const t = (p - a) / (b - a)
    return Math.round(VICTORIOUS_TOTAL * t)
  })
  const counterText = useTransform(counter, (n: number) => `${n.toLocaleString('da-DK')} kr.`)

  return (
    <div
      className="relative"
      style={{
        width: 380,
        maxWidth: '92vw',
        ...style,
      }}
    >
      {/* Outer sage glow ring — pulses subtly */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(168,224,99,0.35) 0%, rgba(168,224,99,0) 70%)',
          filter: 'blur(28px)',
          transform: 'scale(1.15)',
          animation: 'victorious-glow 2.4s ease-in-out infinite',
        }}
      />

      <div
        className="relative rounded-2xl p-7"
        style={{
          background: 'var(--forest)',
          border: '1px solid rgba(168,224,99,0.25)',
          boxShadow: '0 32px 80px rgba(15,55,30,0.45), 0 0 0 1px rgba(168,224,99,0.15)',
        }}
      >
        {/* AKTIV pill */}
        <div className="flex items-center justify-between mb-5">
          <span
            className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full"
            style={{
              background: 'rgba(168,224,99,0.18)',
              border: '1px solid rgba(168,224,99,0.35)',
              color: 'var(--sage)',
            }}
          >
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
              <path d="M3 8.5l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Aktiv
          </span>
          <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>1 regning</span>
        </div>

        <h3 className="text-xl font-extrabold text-white mb-1">Dit hjem, samlet</h3>
        <p className="text-[12px] mb-5" style={{ color: 'rgba(255,255,255,0.55)' }}>Alle faste udgifter ét sted</p>

        <div className="space-y-2">
          {VICTORIOUS_SERVICES.map((row) => (
            <div
              key={row.label}
              className="flex items-center gap-3.5 px-4 py-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <svg className="w-9 h-9 shrink-0" viewBox="0 0 34.44 34.44">
                <circle cx="17.22" cy="17.22" r="17.22" fill={row.bg} />
                <path fill="#003c16" d={SERVICE_ICONS[row.label]} />
              </svg>
              <div className="flex-1">
                <p className="text-[13px] font-medium text-white">{row.label}</p>
                <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.45)' }}>{row.sub}</p>
              </div>
              <span className="text-[13px] font-semibold tabular-nums" style={{ color: 'var(--sage)' }}>{row.price} kr.</span>
            </div>
          ))}
        </div>

        {/* Total — emotional payoff */}
        <div
          className="flex justify-between items-center px-4 py-4 rounded-xl mt-4"
          style={{ background: 'var(--sage)' }}
        >
          <span className="text-[13px] font-semibold" style={{ color: 'var(--forest)' }}>Samlet månedligt</span>
          <motion.span
            className="font-bold tabular-nums"
            style={{ color: 'var(--forest)', fontSize: 28, lineHeight: 1 }}
          >
            {counterText}
          </motion.span>
        </div>

        {/* Inline CTA — filled sage to read as the primary action at the
            emotional peak. Forest text on sage matches the Samlet månedligt
            pill's contrast pattern. */}
        <button
          type="button"
          onClick={onCtaClick}
          className="w-full mt-5 py-3.5 rounded-xl text-sm font-bold transition-all hover:translate-y-[-1px] hover:shadow-xl"
          style={{
            background: 'var(--sage)',
            border: '1px solid rgba(168,224,99,0.6)',
            color: 'var(--forest)',
            boxShadow: '0 4px 14px rgba(168,224,99,0.25)',
          }}
        >
          Tilmeld ventelisten →
        </button>
      </div>
    </div>
  )
}
