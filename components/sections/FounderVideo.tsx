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
        background: 'rgba(15,55,30,0.04)',
      }}
    />
  )
}

export default function FounderVideo() {
  return (
    <section className="bg-white py-20 sm:py-28 px-6 sm:px-10 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <p
            className="text-xs font-semibold tracking-[0.12em] uppercase mb-4"
            style={{ color: 'var(--text-light)' }}
          >
            Mød grundlæggeren
          </p>
          <h2
            className="font-extrabold leading-[1.2] tracking-tight"
            style={{ fontSize: 'clamp(24px, 3.4vw, 40px)', color: 'var(--forest)' }}
          >
            <span style={{ color: 'var(--text-mid)', fontWeight: 600 }}>
              “Der er gebyrer overalt. Og det er noget af det,
            </span>{' '}
            <em className="not-italic" style={{ color: 'var(--forest)' }}>
              vi danskere hader allermest
            </em>
            <span style={{ color: 'var(--text-mid)', fontWeight: 600 }}>.”</span>
          </h2>
        </div>

        <div
          className="rounded-2xl overflow-hidden relative"
          style={{ boxShadow: '0 32px 64px rgba(15,55,30,0.18)' }}
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
          style={{ color: 'var(--text-light)' }}
        >
          Werner Valeur · Stifter og serieiværksætter · 1 min
        </p>
      </div>
    </section>
  )
}
