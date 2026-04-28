'use client'

import { useState } from 'react'
import PhoneShell from '@/components/iphone/PhoneShell'
import SubbrandsScreen from '@/components/iphone/SubbrandsScreen'
import SmartTipsScreen from '@/components/iphone/SmartTipsScreen'
import HomeScreen from '@/components/iphone/HomeScreen'
import IPhoneMockup from '@/components/IPhoneMockup'

export default function Alt87Preview() {
  return (
    <main className="min-h-screen py-16 px-6" style={{ background: 'var(--forest)' }}>
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-white">
          <p
            className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-2"
            style={{ color: 'var(--sage)' }}
          >
            ALT-87 preview
          </p>
          <h1 className="text-3xl font-bold mb-3">Two new screens at full fidelity</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 640 }} className="text-base leading-relaxed">
            Sections 1 and 2 show the new screens straight-on. Section 3 is the existing Hjem for
            reference. <strong>Section 4 is the final composition</strong> — Hjem in front, Subbrands
            and Smart tips tilted behind. Hover anywhere on the composition to play all three
            animations together.
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-white text-lg font-semibold mb-1">1. Subbrands overview</h2>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
            6 of 7 services activated. Streaming is the only one not yet on.{' '}
            <strong>Hover the phone</strong> to see Streaming activate.
          </p>
          <div className="flex justify-center">
            <PhoneShell>{(hovered) => <SubbrandsScreen hovered={hovered} />}</PhoneShell>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-white text-lg font-semibold mb-1">2. Smart tips (AI cost insights)</h2>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Three AI-suggested savings tips. <strong>Hover the phone</strong> to play the counter,
            slot the new tip in, and pulse the Aktivér buttons.
          </p>
          <div className="flex justify-center">
            <PhoneShell>{(hovered) => <SmartTipsScreen hovered={hovered} />}</PhoneShell>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-white text-lg font-semibold mb-1">3. Hjem (existing — reference)</h2>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
            The current foreground screen, unchanged. Hover to see its animation.
          </p>
          <div className="flex justify-center">
            <IPhoneMockup />
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-white text-lg font-semibold mb-1">4. Final composition</h2>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Hjem in front, Subbrands tilted -10° back-left, Smart tips tilted +10° back-right. Back
            phones at 0.85x scale with reduced opacity. <strong>Hover anywhere</strong> on the
            composition to trigger all three animations in sync.
          </p>
          <Composition />
        </section>

        <section className="text-white">
          <h2 className="text-lg font-semibold mb-3">Once you approve...</h2>
          <ol style={{ color: 'rgba(255,255,255,0.7)' }} className="list-decimal pl-6 space-y-1.5 text-sm">
            <li>Replace the current IPhoneMockup.tsx in Hero with this Composition layout</li>
            <li>Adjust Hero column width so all three phones fit (probably grid-cols-[2fr_3fr])</li>
            <li>Hide back phones below `lg` breakpoint — single-phone fallback on mobile</li>
            <li>Visual polish: tune tilts, scale, opacity, shadows in browser at 1280 / 1440 / 1920</li>
          </ol>
        </section>
      </div>
    </main>
  )
}

function Composition() {
  const [hovered, setHovered] = useState(false)

  return (
    <div className="flex justify-center">
      <div
        style={{
          position: 'relative',
          width: 580,
          height: 570,
          maxWidth: '100%',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Back-left: Subbrands */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 30,
            transform: hovered
              ? 'translateX(-50%) translateX(-185px) translateY(-6px) rotate(-11deg) scale(0.85)'
              : 'translateX(-50%) translateX(-175px) translateY(0) rotate(-10deg) scale(0.85)',
            transformOrigin: 'center bottom',
            zIndex: 1,
            opacity: 0.94,
            filter: 'saturate(0.92)',
            transition: 'transform 0.6s cubic-bezier(0.34, 1.2, 0.64, 1), opacity 0.4s ease',
          }}
        >
          <PhoneShell variant="back" hovered={hovered}>
            <SubbrandsScreen hovered={hovered} />
          </PhoneShell>
        </div>

        {/* Back-right: Smart tips */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 30,
            transform: hovered
              ? 'translateX(-50%) translateX(185px) translateY(-6px) rotate(11deg) scale(0.85)'
              : 'translateX(-50%) translateX(175px) translateY(0) rotate(10deg) scale(0.85)',
            transformOrigin: 'center bottom',
            zIndex: 1,
            opacity: 0.94,
            filter: 'saturate(0.92)',
            transition: 'transform 0.6s cubic-bezier(0.34, 1.2, 0.64, 1), opacity 0.4s ease',
          }}
        >
          <PhoneShell variant="back" hovered={hovered}>
            <SmartTipsScreen hovered={hovered} />
          </PhoneShell>
        </div>

        {/* Foreground: Hjem */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            transform: hovered ? 'translateX(-50%) translateY(-10px)' : 'translateX(-50%) translateY(0)',
            zIndex: 2,
            transition: hovered
              ? 'transform 0.7s cubic-bezier(0.34, 1.2, 0.64, 1)'
              : 'transform 0.5s ease',
          }}
        >
          <PhoneShell hovered={hovered}>
            <HomeScreen hovered={hovered} />
          </PhoneShell>
        </div>
      </div>
    </div>
  )
}
