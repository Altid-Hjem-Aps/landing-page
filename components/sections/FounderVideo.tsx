'use client'

import { useEffect, useRef, useState } from 'react'
import * as amplitude from '@amplitude/unified'
import dynamic from 'next/dynamic'

const PLAYBACK_ID = 'DyDNFoKamidSWoQJTmOPUc02utl7gORPYm7HycdeFZVU'
const POSTER_TIME = 8
const POSTER_URL = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.jpg?time=${POSTER_TIME}&fit_mode=preserve`

const MuxPlayer = dynamic(() => import('@mux/mux-player-react'), {
  ssr: false,
  loading: () => <PlayerSkeleton />,
})

// Skeleton renders the real Mux poster as a plain <img> so users on iOS
// Safari see the founder while @mux/mux-player-react's chunk loads (or if
// it fails to load at all). Without this, the skeleton was an empty tinted
// box and looked broken on slow networks / strict-privacy iOS.
function PlayerSkeleton() {
  return (
    <div
      className="w-full relative"
      style={{
        aspectRatio: '16 / 9',
        background: 'rgba(15,55,30,0.04)',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={POSTER_URL}
        alt="Werner Valeur"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  )
}

function PlayButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Afspil video"
      className="absolute inset-0 flex items-center justify-center group"
      style={{
        background: 'rgba(15,55,30,0.0)',
        transition: 'background 0.2s ease',
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
      }}
    >
      <span
        className="flex items-center justify-center rounded-full transition-transform"
        style={{
          width: 84,
          height: 84,
          background: 'rgba(15,55,30,0.85)',
          boxShadow: '0 10px 32px rgba(0,0,0,0.35)',
          backdropFilter: 'blur(6px)',
          transform: 'translateZ(0)',
        }}
      >
        <svg width="28" height="32" viewBox="0 0 28 32" fill="none" aria-hidden>
          <path d="M4 3 L24 16 L4 29 Z" fill="#a8e063" />
        </svg>
      </span>
    </button>
  )
}

export default function FounderVideo() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(true)

  // Watch the underlying mux-player custom element for play/pause events
  // and toggle our overlay accordingly. We poll for the element because
  // it's lazy-loaded via next/dynamic.
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    let detach: (() => void) | null = null

    const attach = () => {
      const player = wrapper.querySelector('mux-player') as
        | (HTMLElement & { paused?: boolean; play?: () => Promise<void> })
        | null
      if (!player) return false
      const onPlay = () => setPaused(false)
      const onPause = () => setPaused(true)
      const onEnded = () => setPaused(true)
      player.addEventListener('play', onPlay)
      player.addEventListener('pause', onPause)
      player.addEventListener('ended', onEnded)
      // Sync initial state.
      setPaused(player.paused !== false)
      detach = () => {
        player.removeEventListener('play', onPlay)
        player.removeEventListener('pause', onPause)
        player.removeEventListener('ended', onEnded)
      }
      return true
    }

    if (!attach()) {
      const interval = setInterval(() => {
        if (attach()) clearInterval(interval)
      }, 200)
      return () => {
        clearInterval(interval)
        detach?.()
      }
    }

    return () => detach?.()
  }, [])

  function handlePlay() {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const player = wrapper.querySelector('mux-player') as
      | (HTMLElement & { play?: () => Promise<void> })
      | null
    amplitude.track('Founder Video Played')
    setPaused(false)
    void player?.play?.()?.catch(() => {
      // Swallow autoplay rejection — user can tap again.
      setPaused(true)
    })
  }

  return (
    <section
      className="py-20 sm:py-28 px-6 sm:px-10 lg:px-12"
      style={{ background: 'var(--cream)' }}
    >
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
          ref={wrapperRef}
          className="rounded-2xl overflow-hidden relative"
          style={{ boxShadow: '0 32px 64px rgba(15,55,30,0.18)' }}
        >
          <MuxPlayer
            playbackId={PLAYBACK_ID}
            streamType="on-demand"
            accentColor="#a8e063"
            poster={POSTER_URL}
            playsInline
            preload="metadata"
            metadata={{
              video_title: 'Altid Hjem — Werner Valeur',
              video_id: 'founder-manifesto',
            }}
            style={{ width: '100%', aspectRatio: '16 / 9', display: 'block' }}
          />
          {paused && <PlayButton onClick={handlePlay} />}
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
