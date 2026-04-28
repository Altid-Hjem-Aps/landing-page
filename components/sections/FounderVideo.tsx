'use client'

import dynamic from 'next/dynamic'

const MuxPlayer = dynamic(() => import('@mux/mux-player-react'), {
  ssr: false,
  loading: () => <PlayerSkeleton />,
})

const PLAYBACK_ID = 'DyDNFoKamidSWoQJTmOPUc02utl7gORPYm7HycdeFZVU'
const POSTER_TIME = 8

function PlayerSkeleton() {
  return (
    <div
      className="w-full"
      style={{
        aspectRatio: '16 / 9',
        background: 'rgba(255,255,255,0.04)',
      }}
    />
  )
}

export default function FounderVideo() {
  return (
    <section
      className="pt-20 sm:pt-28 pb-10 sm:pb-14 px-6 sm:px-10 lg:px-12 relative overflow-hidden"
      style={{ background: 'var(--forest)' }}
    >
      {/* Sage ambient glow behind player */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: '50%',
          left: '50%',
          width: 800,
          height: 800,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(168,224,99,0.09) 0%, transparent 60%)',
        }}
      />

      {/* Glow that bleeds into the next forest section so the seam dissolves */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          bottom: -260,
          left: '50%',
          width: 900,
          height: 520,
          transform: 'translateX(-50%)',
          background: 'radial-gradient(ellipse at center top, rgba(168,224,99,0.07) 0%, transparent 65%)',
        }}
      />

      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <p
            className="text-xs font-semibold tracking-[0.12em] uppercase mb-4"
            style={{ color: 'rgba(168,224,99,0.7)' }}
          >
            Mød grundlæggeren
          </p>
          <h2
            className="font-extrabold leading-[1.2] tracking-tight text-white"
            style={{ fontSize: 'clamp(24px, 3.4vw, 40px)' }}
          >
            <span style={{ color: 'rgba(255,255,255,0.55)' }}>“Der er gebyrer overalt — og det er noget af det,</span>{' '}
            <em className="not-italic" style={{ color: 'var(--sage)' }}>
              vi danskere hader allermest
            </em>
            <span style={{ color: 'rgba(255,255,255,0.55)' }}>.”</span>
          </h2>
        </div>

        <div
          className="rounded-2xl overflow-hidden relative"
          style={{
            boxShadow: '0 32px 64px rgba(0,0,0,0.45)',
            border: '1px solid rgba(168,224,99,0.18)',
          }}
        >
          <MuxPlayer
            playbackId={PLAYBACK_ID}
            streamType="on-demand"
            accentColor="#a8e063"
            poster={`https://image.mux.com/${PLAYBACK_ID}/thumbnail.jpg?time=${POSTER_TIME}&fit_mode=preserve`}
            metadata={{
              video_title: 'Altid Hjem — Werner Valeur',
              video_id: 'founder-manifesto',
            }}
            style={{ width: '100%', aspectRatio: '16 / 9', display: 'block' }}
          />
        </div>

        <p
          className="text-sm text-center mt-6"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          Werner Valeur · Stifter og serieiværksætter · 1 min
        </p>

        {/* Sage hairline — connective tissue into the savings counter below */}
        <div
          aria-hidden
          className="mx-auto mt-14 sm:mt-16"
          style={{
            maxWidth: 320,
            height: 1,
            background:
              'linear-gradient(90deg, transparent 0%, rgba(168,224,99,0.28) 50%, transparent 100%)',
          }}
        />
      </div>
    </section>
  )
}
