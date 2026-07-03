'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import * as amplitude from '@amplitude/analytics-browser'
import dynamic from 'next/dynamic'
import { fluid } from '@/lib/fluid'
import { H2, EYEBROW, BODY } from '@/lib/typography'

const PLAYBACK_ID = 'DyDNFoKamidSWoQJTmOPUc02utl7gORPYm7HycdeFZVU'
const POSTER_TIME = 8
const POSTER_URL = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.jpg?time=${POSTER_TIME}&fit_mode=preserve`

const MuxPlayer = dynamic(() => import('@mux/mux-player-react'), {
  ssr: false,
  loading: () => <PlayerSkeleton />,
})

// Skeleton renders the real Mux poster as a plain <img> so users see the
// founder while @mux/mux-player-react's chunk loads (or if it fails entirely).
function PlayerSkeleton() {
  return (
    <div className="absolute inset-0" style={{ background: 'rgba(15,55,30,0.06)' }}>
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


type PlayerEl = HTMLElement & {
  muted?: boolean
  paused?: boolean
  currentTime?: number
  play?: () => Promise<void>
  pause?: () => void
}

export default function FounderVideo() {
  const router = useRouter()
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Two modes: ambient (muted autoplay when scrolled into view) and sound mode
  // — pressing the video restarts it from 0:00 with sound on. After that the
  // observer only pauses off-screen and resumes on return; it never re-mutes
  // or restarts a video the user chose to hear.
  const [soundMode, setSoundMode] = useState(false)
  const soundModeRef = useRef(false)

  const getPlayer = () => wrapperRef.current?.querySelector('mux-player') as PlayerEl | null

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    if (typeof IntersectionObserver !== 'function') return // no ambient autoplay without it
    // Reduced motion: no ambient autoplay — the poster + controls (and the
    // "Se med lyd" press) still work on demand.
    const reduced = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let inView = false
    let tracked = false
    let pausedByUs = false

    const sync = () => {
      const p = getPlayer()
      if (!p) return
      if (inView) {
        if (soundModeRef.current) {
          // Only resume what WE paused — respect a manual pause via the controls.
          if (pausedByUs) { pausedByUs = false; p.play?.().catch(() => {}) }
        } else if (!reduced) {
          p.muted = true
          p.play?.()
            .then(() => { if (!tracked) { tracked = true; amplitude.track('Founder Video Autoplayed') } })
            .catch(() => {})
        }
      } else {
        if (p.paused === false) pausedByUs = true
        p.pause?.()
      }
    }

    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync() }, { threshold: 0.4 })
    io.observe(wrapper)
    // The player is lazy-loaded — poll until it exists, then sync and stop.
    const poll = setInterval(() => { if (getPlayer()) { clearInterval(poll); sync() } }, 250)
    const stopPoll = setTimeout(() => clearInterval(poll), 8000)
    return () => { io.disconnect(); clearInterval(poll); clearTimeout(stopPoll) }
  }, [])

  // Press on the video (ambient mode): restart from the beginning with sound.
  // Runs in the click's gesture context, so unmuted play() is allowed.
  function handleWatchWithSound() {
    const p = getPlayer()
    if (!p) return
    soundModeRef.current = true
    setSoundMode(true)
    p.currentTime = 0
    p.muted = false
    p.play?.().catch(() => {})
    amplitude.track('Founder Video Sound On')
  }

  // Same signup flow as nav/hero: scroll to the bottom form, otherwise expand
  // the hero form, otherwise navigate home with #venteliste.
  function handleCTA() {
    amplitude.track('Waitlist CTA Clicked', { source: 'founder' })
    const onPageForm = document.getElementById('venteliste2')
    if (onPageForm) { onPageForm.scrollIntoView({ behavior: 'smooth', block: 'center' }); return }
    if (window.location.pathname !== '/') { router.push('/#venteliste'); return }
    window.dispatchEvent(new CustomEvent('expand-waitlist'))
  }

  return (
    <section className="relative overflow-hidden" style={{ background: '#193d23' }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">

        {/* Left: text + CTA */}
        <div
          className="flex flex-col justify-center py-16 lg:py-20 pr-6 sm:pr-10 lg:pr-14 max-w-[880px]"
          style={{ paddingLeft: fluid(140, 32) }}
        >
          <p className={EYEBROW} style={{ color: '#90ff7c' }}>
            Mød grundlæggeren
          </p>

          {/* Hanging quote mark: text-indent pulls the opening " into the
              margin so the first words align with the subtext + button. Fixed
              line breaks match the Figma frame. */}
          <h2
            className={`mt-6 ${H2} text-white`}
            style={{ textIndent: '-0.42em' }}
          >
            &ldquo;Der er gebyrer overalt.<br />
            Og det er noget af det,<br />
            <span style={{ color: '#90ff7c' }}>vi danskere hader allermest.&rdquo;</span>
          </h2>

          <p className={`mt-7 max-w-[520px] ${BODY} text-white`}>
            Altid Hjem er udviklet af teamet bag Altid Energi. Nu tager vi samme opgør med skjulte gebyrer videre til resten af hjemmets aftaler.
          </p>

          <button
            type="button"
            onClick={handleCTA}
            className="mt-9 inline-flex w-fit items-center justify-center font-medium rounded-[20px] px-8 py-[18px] xl:p-0 xl:w-[clamp(200px,15.83vw,304px)] xl:h-[clamp(52px,3.65vw,70px)] text-[16px] transition-opacity hover:opacity-90"
            style={{ background: '#90ff7c', color: '#003c16', cursor: 'pointer', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
          >
            Skriv dig på ventelisten
          </button>
        </div>

        {/* Right: video, fills the entire right half (cover) */}
        <div
          ref={wrapperRef}
          // Phones get a 1:1 frame — the 16:9 source is centre-cropped by the
          // player's object-fit:cover, which keeps the (centred) subtitles and
          // trims the sides. Tablets show the full 16:9; desktop fills the
          // right half as before.
          className="relative w-full aspect-square sm:aspect-video lg:aspect-auto lg:h-full lg:min-h-[460px] self-stretch"
        >
          <MuxPlayer
            playbackId={PLAYBACK_ID}
            streamType="on-demand"
            accentColor="#90ff7c"
            poster={POSTER_URL}
            playsInline
            muted
            // metadata only: the section is below the fold and the poster <img>
            // covers first paint — preload="auto" would buffer HLS segments for
            // every visitor, including those who never scroll here.
            preload="metadata"
            metadata={{ video_title: 'Altid Hjem — Werner Valeur', video_id: 'founder-manifesto' }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', '--media-object-fit': 'cover', display: 'block' }}
          />

          {/* Ambient mode: pressing the video restarts it with sound. The
              overlay stops above the Mux control bar (~56px) so the native
              controls stay usable; it unmounts once sound mode is on. */}
          {!soundMode && (
            <button
              type="button"
              onClick={handleWatchWithSound}
              aria-label="Afspil videoen forfra med lyd"
              // Pill sits top-left below lg — on the narrow crops the burned-in
              // subtitles own the bottom of the frame; desktop has room at the
              // bottom-left.
              className="absolute inset-x-0 top-0 bottom-14 z-10 flex items-start lg:items-end justify-start p-5 cursor-pointer"
              style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
            >
              <span
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium text-white"
                style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M3 9v6h4l5 5V4L7 9H3z" />
                  <line x1="16" y1="9" x2="22" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="22" y1="9" x2="16" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Se med lyd
              </span>
            </button>
          )}
        </div>

      </div>
    </section>
  )
}
