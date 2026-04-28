'use client'

import { motion } from 'framer-motion'
import type { ChaosBill } from './cards'

type Props = {
  bill: ChaosBill
}

// One stylized bill envelope — muted off-whites, faux barcode strip,
// tiny meta line so the chaos pile reads as physical mail at a glance.
// On hover, the card lifts and brightens its shadow — invites the
// visitor to mentally "pick up" the piece of paper.
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
        width: 220,
        height: 130,
        borderRadius: 12,
        background: `linear-gradient(135deg, #fafaf6 0%, ${bill.tint} 220%)`,
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 12px 32px rgba(15,55,30,0.10), 0 2px 6px rgba(15,55,30,0.06)',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
      }}
    >
      {/* Top row: invoice category (e.g. "Elregning") + due date */}
      <div className="flex items-center justify-between" style={{ color: 'rgba(15,55,30,0.55)' }}>
        <span className="text-[13px] font-semibold leading-tight" style={{ color: 'rgba(15,55,30,0.85)' }}>
          {bill.type}
        </span>
        <span className="text-[10px]" style={{ color: 'rgba(15,55,30,0.45)' }}>{bill.due}</span>
      </div>

      {/* Faux barcode — middle of card */}
      <div className="flex gap-[2px] items-end" style={{ height: 12 }}>
        {Array.from({ length: 22 }).map((_, i) => (
          <span
            key={i}
            style={{
              width: i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1,
              height: i % 4 === 0 ? 12 : 9,
              background: 'rgba(15,55,30,0.5)',
            }}
          />
        ))}
      </div>

      {/* Bottom row: amount */}
      <div className="flex items-end justify-between">
        <span className="text-[9px] tracking-wider uppercase" style={{ color: 'rgba(15,55,30,0.4)' }}>Beløb</span>
        <span className="text-[15px] font-bold tabular-nums" style={{ color: 'rgba(15,55,30,0.85)' }}>
          {bill.amount} kr.
        </span>
      </div>
    </motion.div>
  )
}
