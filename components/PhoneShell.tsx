import type { ReactNode } from 'react'

// A plain phone around a real capture. The captures already hold the status
// bar and the island, so the shell only draws the body. Everything is sized
// from the shell's own width (cqw), so it scales with the column it sits in.
// `overlay` sits on the screen without its clipping, so a lifted crop can
// break the phone's edge.
const SCREEN_ASPECT = '1179 / 2556'

export default function PhoneShell({
  children,
  overlay,
  tone = 'tint',
}: {
  children: ReactNode
  overlay?: ReactNode
  /** `forest`: a lighter rim, so a dark screen top still reads as a phone on a dark card. */
  tone?: 'tint' | 'forest'
}) {
  return (
    <div style={{ containerType: 'inline-size' }}>
      <div
        style={{
          padding: '2.4cqw',
          borderRadius: '15cqw',
          background: 'linear-gradient(150deg, #33352f 0%, #161715 45%, #111210 100%)',
          boxShadow:
            tone === 'forest'
              ? '0 0 0 1.5px rgba(253,250,244,0.34), 0 24px 60px rgba(0,0,0,0.38)'
              : 'inset 0 1px 0 rgba(255,255,255,0.14), 0 22px 48px rgba(22,50,35,0.26)',
        }}
      >
        <div className="relative" style={{ aspectRatio: SCREEN_ASPECT }}>
          <div className="absolute inset-0 isolate overflow-hidden bg-[var(--app-paper)]" style={{ borderRadius: '12.6cqw' }}>
            {children}
          </div>
          {overlay && <div className="absolute inset-0">{overlay}</div>}
        </div>
      </div>
    </div>
  )
}
