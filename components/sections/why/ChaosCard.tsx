'use client'

import { motion } from 'framer-motion'
import type { ChaosBill } from './cards'

type Props = {
  bill: ChaosBill
}

// One stylized paper invoice — off-white sheet, FAKTURA header, mock
// line-item rows, total at bottom. The chaos pile reads as a stack of
// physical bills at a glance, not as plastic cards. Hover lifts the
// sheet so the visitor wants to "pick it up" off the pile.
export function ChaosCard({ bill }: Props) {
  return (
    <motion.div
      whileHover={{
        y: -10,
        scale: 1.06,
        boxShadow: '0 22px 48px rgba(15,55,30,0.18), 0 4px 10px rgba(15,55,30,0.10)',
        transition: { type: 'spring', stiffness: 280, damping: 22 },
      }}
      style={{
        width: 150,
        height: 200,
        borderRadius: 3,
        background: '#fefdf8',
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 12px 32px rgba(15,55,30,0.10), 0 2px 6px rgba(15,55,30,0.06)',
        padding: '14px 14px 12px',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
      }}
    >
      {/* Header: FAKTURA tag + due date */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[8px] font-bold tracking-[0.14em] uppercase" style={{ color: 'rgba(15,55,30,0.45)' }}>
          Faktura
        </span>
        <span className="text-[8px]" style={{ color: 'rgba(15,55,30,0.45)' }}>{bill.due}</span>
      </div>

      {/* Category name — the "issuer" line */}
      <div className="text-[13px] font-semibold leading-tight mb-3" style={{ color: 'rgba(15,55,30,0.88)' }}>
        {bill.type}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(15,55,30,0.12)' }} />

      {/* Mock line-item rows — gray bars implying invoice details */}
      <div className="flex flex-col gap-[6px] py-[10px] flex-1">
        {[0.78, 0.6, 0.7, 0.55, 0.66].map((w, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <span style={{ height: 4, width: `${w * 100}%`, background: 'rgba(15,55,30,0.18)', borderRadius: 1 }} />
            <span style={{ height: 4, width: 18, background: 'rgba(15,55,30,0.18)', borderRadius: 1 }} />
          </div>
        ))}
      </div>

      {/* Total row */}
      <div className="flex items-baseline justify-between pt-[8px]" style={{ borderTop: '1px solid rgba(15,55,30,0.18)' }}>
        <span className="text-[9px] font-semibold tracking-wider uppercase" style={{ color: 'rgba(15,55,30,0.55)' }}>I alt</span>
        <span className="text-[14px] font-bold tabular-nums" style={{ color: 'rgba(15,55,30,0.88)' }}>
          {bill.amount} kr.
        </span>
      </div>
    </motion.div>
  )
}
