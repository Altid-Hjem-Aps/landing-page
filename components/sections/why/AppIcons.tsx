'use client'

import { motion, useTransform, type MotionValue } from 'framer-motion'
import { badgeFactor, badgeRemaining, openLocal } from './cards'

// The two "inbox overload" app icons in the sources scene: e-Boks and mail.
// The badge count equals EXACTLY the number of bills inside the inbox and
// ticks down one by one as each bill flies out. (Removal of the emptied icon
// is handled by the scene wrapper.)

const RED = '#ff3b30'

function Glyph({ kind }: { kind: 'eboks' | 'mail' }) {
  if (kind === 'eboks') {
    return <span className="text-white font-medium" style={{ fontSize: 19, letterSpacing: '-0.02em' }}>e-Boks</span>
  }
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <rect x="5" y="10" width="30" height="21" rx="4" stroke="#fff" strokeWidth="2.4" />
      <path d="M6.5 12.5 L20 22 L33.5 12.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function AppIcon({
  kind,
  progress,
}: {
  kind: 'eboks' | 'mail'
  progress: MotionValue<number>
}) {
  const count = useTransform(progress, (p) => badgeRemaining(p, kind))
  const countText = useTransform(count, (c) => `${c}`)
  const badgeScale = useTransform(count, (c) => (c > 0 ? 1 : 0))
  const dotOpacity = useTransform(progress, (p) => badgeFactor(p, kind))
  // A gentle "being opened" pulse while its bills fly out.
  const tileScale = useTransform(progress, (p) => 1 + 0.05 * Math.sin(Math.PI * openLocal(p, kind)))

  return (
    <motion.div className="relative" style={{ scale: tileScale }}>
      <div
        className="flex items-center justify-center"
        style={{
          width: 86,
          height: 86,
          borderRadius: 22,
          background: kind === 'eboks' ? '#c8102e' : '#1e73e8',
          boxShadow: '0 14px 30px rgba(15,55,30,0.16), 0 3px 8px rgba(15,55,30,0.10)',
        }}
      >
        <Glyph kind={kind} />
      </div>

      {/* Unread-count badge — always the exact number of bills left inside */}
      <motion.div
        className="absolute flex items-center justify-center tabular-nums"
        style={{
          top: -9,
          right: -9,
          minWidth: 27,
          height: 27,
          padding: '0 7px',
          borderRadius: 999,
          background: RED,
          color: '#fff',
          fontSize: 13,
          fontWeight: 500,
          boxShadow: '0 4px 10px rgba(255,59,48,0.4)',
          scale: badgeScale,
        }}
      >
        <motion.span>{countText}</motion.span>
      </motion.div>

      {/* Extra stray notification dots — pure overload set-dressing */}
      <motion.span className="absolute rounded-full" style={{ width: 10, height: 10, background: RED, left: -13, top: 20, opacity: dotOpacity }} />
      <motion.span className="absolute rounded-full" style={{ width: 7, height: 7, background: RED, right: -15, bottom: 26, opacity: dotOpacity }} />
      <motion.span className="absolute rounded-full" style={{ width: 6, height: 6, background: RED, left: 16, bottom: -12, opacity: dotOpacity }} />
    </motion.div>
  )
}
