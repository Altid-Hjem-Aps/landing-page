import { ReactNode } from 'react'

/** Width of the screen inside the shell: 270 less the 8 px bezel on each side. */
export const PHONE_SCREEN_WIDTH = 254

// The phone around a picture of the app. The frames carry their own status bar,
// island and tab bar, so the shell draws none of them.
export default function PhoneShell({
  children,
  variant = 'foreground',
  sheen = true,
  softShadow = false,
}: {
  children: ReactNode
  variant?: 'foreground' | 'back'
  /** The glass reflection overlay tints everything under it toward white —
   *  turn it off where exact brand colours matter. */
  sheen?: boolean
  /** Gentler halo — used by the hero's single-phone mobile layout. */
  softShadow?: boolean
}) {
  const isBack = variant === 'back'

  return (
    <div className="mx-auto select-none cursor-default">
      <div style={{ position: 'relative', width: 270, height: 560 }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 52,
            padding: 8,
            background: 'linear-gradient(150deg, #2e2e2e 0%, #141414 45%, #111111 100%)',
            // Drop-shadow halo via box-shadow instead of a blurred sibling
            // <div>. CSS `filter: blur()` is clipped by the nearest ancestor
            // with a transform (the IPhoneMockup foreground wrapper has
            // translateX(-50%)), which was cutting the halo at a hard
            // vertical line ~37px from each viewport edge. box-shadow renders
            // outside the element box and isn't subject to transform-induced
            // containing-block clipping, so the halo bleeds smoothly.
            boxShadow: [
              'inset 0 1px 0 rgba(255,255,255,0.13)',
              'inset 2px 0 0 rgba(255,255,255,0.07)',
              'inset -1px 0 0 rgba(0,0,0,0.6)',
              'inset 0 -1px 0 rgba(0,0,0,0.5)',
              isBack
                ? '0 24px 39px 4px rgba(0,0,0,0.16)'
                : softShadow
                  ? '0 18px 36px 2px rgba(0,0,0,0.13)'
                  : '0 32px 50px 6px rgba(0,0,0,0.25)',
            ].join(', '),
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 44,
              background: '#000',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'var(--cream)',
                borderRadius: 44,
                overflow: 'hidden',
              }}
            >
              {children}
            </div>

            {sheen && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 44,
                  background:
                    'linear-gradient(130deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 30%, transparent 55%)',
                  pointerEvents: 'none',
                  zIndex: 10,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
