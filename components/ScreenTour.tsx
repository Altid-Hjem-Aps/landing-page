'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react'
import { flushSync } from 'react-dom'
import PhoneShell from '@/components/PhoneShell'
import { SCREENS, STATUS_STRIP_HEIGHT, screenSrc, type Lift, type Scene, type ScreenId } from '@/lib/screen-captures'

// Real pictures of the app, with motion on top. One small component per repo,
// duplicated on purpose. All motion is Web Animations on transform and
// opacity, so pausing holds every piece exactly where it is.

const LOOPS = 2
const PUSH_MS = 300
const PUSH_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
// Ease in and out; panProgressToTime is the inverse of this sine curve.
const PAN_EASE = 'cubic-bezier(0.37, 0, 0.63, 1)'
const panProgressToTime = (p: number) => Math.acos(1 - 2 * p) / Math.PI
const LIFT_DELAY_MS = 700
const LIFT_UP_MS = 520
const LIFT_STAY_MS = 1500
const LIFT_DOWN_MS = 420
const LIFT_EASE = 'cubic-bezier(0.2, 0.9, 0.25, 1)'
const TAP_MS = 520
const PAN_START_MS = 1000
const PAN_AFTER_LIFT_MS = 150
const PAN_TAIL_MS = 400
const PAN_TAIL_BEFORE_TAP_MS = 700
const STORAGE_KEY = 'altid-tours-paused'
// The strip's lower edge melts into what scrolls under it, like the app's own top.
const STRIP_FADE = {
  maskImage: 'linear-gradient(black 72%, transparent)',
  WebkitMaskImage: 'linear-gradient(black 72%, transparent)',
}

// One pause state per page, across all tours, remembered between visits.
let pausedValue: boolean | null = null
const pausedListeners = new Set<() => void>()

function getPaused() {
  if (pausedValue === null) {
    try {
      pausedValue = window.localStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      pausedValue = false
    }
  }
  return pausedValue
}

function setPaused(next: boolean) {
  pausedValue = next
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
  } catch {
    // Storage blocked: the choice still holds for this page.
  }
  pausedListeners.forEach((l) => l())
}

function subscribePaused(listener: () => void) {
  pausedListeners.add(listener)
  return () => {
    pausedListeners.delete(listener)
  }
}

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'

function subscribeReduced(listener: () => void) {
  const mql = window.matchMedia(REDUCED_QUERY)
  mql.addEventListener('change', listener)
  return () => mql.removeEventListener('change', listener)
}

const getReduced = () => window.matchMedia(REDUCED_QUERY).matches
const never = () => false

function Picture({
  id,
  className,
  priority = false,
  lazy = false,
  style,
}: {
  id: ScreenId
  className?: string
  style?: CSSProperties
  priority?: boolean
  /** The first frame of a phone further down the page. Everything else only mounts when near. */
  lazy?: boolean
}) {
  const { width, height } = SCREENS[id]
  return (
    <Image
      src={screenSrc(id)}
      alt=""
      width={width}
      height={height}
      // The files are already sized and tuned for crisp text. Serving them
      // as they are keeps the weight what the budget measured.
      unoptimized
      draggable={false}
      preload={priority}
      loading={priority ? undefined : lazy ? 'lazy' : 'eager'}
      className={className}
      style={style}
    />
  )
}

function liftStyle(lift: Lift) {
  const { width: w, height: h } = SCREENS[lift.sceneId]
  return {
    box: {
      left: `${(lift.x / w) * 100}%`,
      top: `${(lift.y / h) * 100}%`,
      width: `${(lift.width / w) * 100}%`,
      height: `${(lift.height / h) * 100}%`,
      borderRadius: `${(lift.radius / w) * 100}cqw`,
    },
    image: {
      left: `${-(lift.x / lift.width) * 100}%`,
      top: `${-(lift.y / lift.height) * 100}%`,
      width: `${(w / lift.width) * 100}%`,
      maxWidth: 'none',
    },
  }
}

function required<T>(value: T | null | undefined, what: string): T {
  if (value === null || value === undefined) throw new Error(`ScreenTour: ${what} is not on the page`)
  return value
}

/**
 * Runs one tour's timeline. Everything that moves is an Animation in `anims`
 * or `pushAnims`, so pausing is pausing those; a scene ends when its timer
 * animation finishes, so a paused tour cannot advance.
 */
class TourEngine {
  private index = 0
  private loops = 0
  private anims: Animation[] = []
  private pushAnims: Animation[] = []
  /** A transition that was ready while the tour was paused. */
  private pending: (() => void) | null = null
  /** Bumped on stop, so a late decode cannot start anything. */
  private token = 0
  private playing = false
  private clock: HTMLElement | null = null
  private liftEl: HTMLElement | null = null
  private layers: (HTMLElement | null)[] = []

  setClock = (el: HTMLElement | null) => {
    this.clock = el
  }
  setLiftEl = (el: HTMLElement | null) => {
    this.liftEl = el
  }
  setLayer(i: number, el: HTMLElement | null) {
    this.layers[i] = el
  }

  constructor(
    private scenes: Scene[],
    private lift: Lift | undefined,
    private onPush: (to: number, from: number) => void,
    private onPushEnd: () => void,
    private onStopped: () => void,
  ) {}

  decode(i: number) {
    const imgs = required(this.layers[i], `layer ${i}`).querySelectorAll('img')
    return Promise.all(
      Array.from(imgs, (img) => {
        // A failed image stays failed until its source is set again.
        if (img.complete && img.naturalWidth === 0) img.src = img.currentSrc || img.src
        return img.decode()
      }),
    )
  }

  setPlaying(playing: boolean) {
    this.playing = playing
    const all = [...this.anims, ...this.pushAnims]
    if (!playing) {
      all.forEach((a) => a.playState === 'running' && a.pause())
      return
    }
    // Only what was paused: playing a finished animation would rewind it.
    all.forEach((a) => a.playState === 'paused' && a.play())
    if (this.pending) {
      const pending = this.pending
      this.pending = null
      // Not from inside React's effect: a transition commits state synchronously.
      queueMicrotask(pending)
    } else if (this.anims.length === 0 && this.pushAnims.length === 0) {
      this.whenDecoded(this.index, () => {
        if (this.playing && this.anims.length === 0) this.startScene(this.index)
      })
    }
  }

  /** After the two loops, or after a failed image: Play starts over. */
  rewindLoops() {
    this.loops = 0
  }

  /** Reduced motion turned on, or unmount: nothing keeps running. */
  stop() {
    this.token += 1
    this.pending = null
    const pushing = this.pushAnims.length > 0
    ;[...this.anims, ...this.pushAnims].forEach((a) => a.cancel())
    this.anims = []
    this.pushAnims = []
    if (pushing) this.onPushEnd()
  }

  private whenDecoded(i: number, then: () => void) {
    const token = this.token
    this.decode(i).then(
      () => {
        if (this.token === token) then()
      },
      (error) => {
        if (this.token !== token) return
        // Keep the current frame, also part way through a pan. Play tries again.
        console.error(`ScreenTour: could not decode ${this.scenes[i].id}`, error)
        this.pending = () => this.whenDecoded(i, then)
        this.onStopped()
      },
    )
  }

  private advance(from: number) {
    const to = (from + 1) % this.scenes.length
    if (to === 0) this.loops += 1
    this.whenDecoded(to, () => {
      const go = () => {
        // Read here: Play after a failed image has started the loops over.
        const last = to === 0 && this.loops >= LOOPS
        // The stop comes after the push: stopping pauses what is running.
        this.push(from, to, last ? this.onStopped : undefined)
        this.index = to
        if (!last) this.startScene(to)
      }
      if (this.playing) go()
      else this.pending = go
    })
  }

  private push(from: number, to: number, then?: () => void) {
    const oldLayer = required(this.layers[from], `layer ${from}`)
    const newLayer = required(this.layers[to], `layer ${to}`)
    const leavingAnims = this.anims
    this.anims = []
    this.onPush(to, from)
    const options = { duration: PUSH_MS, easing: PUSH_EASE }
    const incoming = newLayer.animate(
      [
        { transform: 'translateX(100%)', opacity: 0.6 },
        { transform: 'none', opacity: 1 },
      ],
      options,
    )
    const outgoing = oldLayer.animate(
      [
        { transform: 'none', opacity: 1 },
        { transform: 'translateX(-22%)', opacity: 0.5 },
      ],
      { ...options, fill: 'forwards' },
    )
    this.pushAnims = [incoming, outgoing, ...leavingAnims]
    incoming.onfinish = () => {
      this.pushAnims.forEach((a) => a.cancel())
      this.pushAnims = []
      this.onPushEnd()
      then?.()
    }
  }

  private startScene(i: number) {
    const scene = this.scenes[i]
    const layer = required(this.layers[i], `layer ${i}`)
    const clock = required(this.clock, 'clock')
    this.index = i
    const anims: Animation[] = []

    let panStart = PAN_START_MS
    if (this.lift?.sceneId === scene.id) {
      const total = LIFT_UP_MS + LIFT_STAY_MS + LIFT_DOWN_MS
      const raised = { transform: `translateY(-4cqw) scale(${this.lift.scale})`, opacity: 1 }
      anims.push(
        required(this.liftEl, 'lift').animate(
          [
            { offset: 0, transform: 'none', opacity: 0, easing: LIFT_EASE },
            { offset: LIFT_UP_MS / total, ...raised },
            { offset: (LIFT_UP_MS + LIFT_STAY_MS) / total, ...raised, easing: 'ease-in-out' },
            { offset: 0.98, transform: 'none', opacity: 1 },
            { offset: 1, transform: 'none', opacity: 0 },
          ],
          { delay: LIFT_DELAY_MS, duration: total },
        ),
      )
      panStart = LIFT_DELAY_MS + total + PAN_AFTER_LIFT_MS
    }

    const pan = scene.panTo
    if (pan) {
      const full = required(layer.querySelector('[data-pan]'), 'pan image')
      const darkStrip = required(layer.querySelector('[data-strip-dark]'), 'dark strip')
      const paperStrip = required(layer.querySelector('[data-strip-paper]'), 'paper strip')
      const panMs = scene.holdMs - panStart - (scene.tap ? PAN_TAIL_BEFORE_TAP_MS : PAN_TAIL_MS)
      const show = (el: Element) => el.animate([{ opacity: 1 }, { opacity: 1 }], { delay: panStart, duration: 1, fill: 'forwards' })
      const foldTime = panProgressToTime(Math.min(1, (pan.foldY - STATUS_STRIP_HEIGHT) / pan.y))
      anims.push(
        show(full),
        full.animate([{ transform: 'none' }, { transform: `translateY(${-(pan.y / SCREENS[pan.image].height) * 100}%)` }], {
          delay: panStart,
          duration: panMs,
          easing: PAN_EASE,
          fill: 'forwards',
        }),
        show(darkStrip),
        paperStrip.animate(
          [
            { offset: 0, opacity: 0 },
            { offset: Math.max(0, foldTime - 0.02), opacity: 0 },
            { offset: Math.min(1, foldTime + 0.02), opacity: 1 },
            { offset: 1, opacity: 1 },
          ],
          { delay: panStart, duration: panMs, fill: 'forwards' },
        ),
      )
    }

    const dot = layer.querySelector('[data-tap]')
    if (dot) {
      anims.push(
        dot.animate(
          [
            { offset: 0, opacity: 0, transform: 'translate(-50%, -50%) scale(0.6)' },
            { offset: 0.42, opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
            { offset: 0.8, opacity: 0.9, transform: 'translate(-50%, -50%) scale(0.86)' },
            { offset: 1, opacity: 0, transform: 'translate(-50%, -50%) scale(0.86)' },
          ],
          { delay: scene.holdMs - TAP_MS, duration: TAP_MS, easing: 'ease-out' },
        ),
      )
    }

    const timer = clock.animate([{ opacity: 0 }, { opacity: 0 }], { duration: scene.holdMs })
    timer.onfinish = () => this.advance(i)
    anims.push(timer)
    this.anims = anims
  }
}

export default function ScreenTour({
  scenes,
  label,
  lift,
  priority = false,
  tone = 'tint',
  windowClassName = '',
  phoneClassName = '',
}: {
  scenes: Scene[]
  label: string
  lift?: Lift
  /** The page's first phone: its first frame is the LCP image. */
  priority?: boolean
  tone?: 'tint' | 'forest'
  /** Height of the part of the phone that shows: the rest runs off the band. */
  windowClassName?: string
  phoneClassName?: string
}) {
  const paused = useSyncExternalStore(subscribePaused, getPaused, never)
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, never)

  const [near, setNear] = useState(false)
  const [inView, setInView] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const [finished, setFinished] = useState(false)
  const [active, setActive] = useState(0)
  const [leaving, setLeaving] = useState<number | null>(null)
  const [stepped, setStepped] = useState(0)
  // Frames beyond the first load only for a visitor who will see them: not
  // while paused or with reduced motion, until Play or a dot asks for them.
  const [framesWanted, setFramesWanted] = useState(false)
  if (!framesWanted && near && !paused && !reduced) setFramesWanted(true)

  const lastStep = useRef(0)
  const windowRef = useRef<HTMLDivElement>(null)
  const [engine] = useState(
    () =>
      new TourEngine(
        scenes,
        lift,
        (to, from) =>
          flushSync(() => {
            setActive(to)
            setLeaving(from)
          }),
        () => setLeaving(null),
        () => setFinished(true),
      ),
  )

  const playing = near && inView && pageVisible && !paused && !finished && !reduced

  useEffect(() => {
    const el = windowRef.current
    if (!el) return
    const nearObserver = new IntersectionObserver((entries) => entries.at(-1)?.isIntersecting && setNear(true), {
      rootMargin: '300px 0px',
    })
    const viewObserver = new IntersectionObserver((entries) => setInView(entries.at(-1)?.isIntersecting ?? false), {
      threshold: 0.25,
    })
    nearObserver.observe(el)
    viewObserver.observe(el)
    return () => {
      nearObserver.disconnect()
      viewObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    const sync = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', sync)
    return () => document.removeEventListener('visibilitychange', sync)
  }, [])

  useEffect(() => engine.setPlaying(playing), [engine, playing])

  useEffect(() => {
    if (reduced) engine.stop()
  }, [engine, reduced])

  useEffect(() => () => engine.stop(), [engine])

  function onPauseButton() {
    if (paused) {
      setPaused(false)
    } else if (!finished) {
      setPaused(true)
      return
    }
    if (finished) {
      engine.rewindLoops()
      setFinished(false)
    }
  }

  function step(i: number) {
    lastStep.current = i
    flushSync(() => setFramesWanted(true))
    engine.decode(i).then(
      () => {
        if (lastStep.current === i) setStepped(i)
      },
      (error) => console.error(`ScreenTour: could not decode ${scenes[i].id}`, error),
    )
  }

  const shown = reduced ? stepped : active
  const showPlay = paused || finished
  const onForest = tone === 'forest'
  const liftBox = lift ? liftStyle(lift) : null

  return (
    <div className="flex w-full flex-col items-center">
      <div className={`flex h-11 w-full items-center justify-end ${phoneClassName}`}>
        {reduced ? (
          <div className="flex">
            {scenes.map((scene, i) => (
              <button
                key={scene.id}
                type="button"
                aria-label={`Vis ${scene.alt}`}
                aria-current={i === shown ? 'true' : undefined}
                onClick={() => step(i)}
                className="group grid h-11 w-11 place-items-center rounded-full"
              >
                <span
                  aria-hidden
                  className={`rounded-full ${onForest ? 'bg-[var(--app-paper)]' : 'bg-[var(--app-forest)]'} ${i === shown ? 'h-2.5 w-2.5' : 'h-2 w-2 opacity-60 group-hover:opacity-100'}`}
                />
              </button>
            ))}
          </div>
        ) : (
          <button
            type="button"
            aria-label={showPlay ? 'Afspil animationerne' : 'Sæt animationerne på pause'}
            onClick={onPauseButton}
            className={`group grid h-11 w-11 place-items-center rounded-full ${onForest ? 'text-[var(--app-paper)]' : 'text-[var(--app-forest)]'}`}
          >
            <span
              aria-hidden
              className={`grid h-8 w-8 place-items-center rounded-full ${onForest ? 'bg-white/15 group-hover:bg-white/25' : 'bg-[rgba(22,50,35,0.1)] group-hover:bg-[rgba(22,50,35,0.18)]'}`}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                {showPlay ? (
                  <path d="M3 1.4v9.2c0 .4.4.6.7.4l7-4.6c.3-.2.3-.6 0-.8l-7-4.6C3.4.8 3 1 3 1.4Z" />
                ) : (
                  <>
                    <rect x="2" y="1" width="3" height="10" rx="1" />
                    <rect x="7" y="1" width="3" height="10" rx="1" />
                  </>
                )}
              </svg>
            </span>
          </button>
        )}
      </div>

      {/* Clips the bottom only: the shadow and a lifted crop may leave the phone's sides. */}
      <div
        ref={windowRef}
        role="img"
        aria-label={label}
        className={`relative w-full ${windowClassName} ${phoneClassName}`}
        style={{ clipPath: 'inset(-100px -100px 0 -100px)' }}
      >
        <span ref={(el) => engine.setClock(el)} aria-hidden className="hidden" />
        <PhoneShell
          tone={tone}
          overlay={
            framesWanted && lift && liftBox && !reduced ? (
              <div
                ref={(el) => engine.setLiftEl(el)}
                aria-hidden
                className="absolute overflow-hidden opacity-0"
                style={{ ...liftBox.box, boxShadow: '0 22px 44px rgba(10,28,18,0.42), 0 4px 10px rgba(10,28,18,0.2)' }}
              >
                <Picture id={lift.sceneId} className="absolute h-auto" style={liftBox.image} />
              </div>
            ) : undefined
          }
        >
          {scenes.map((scene, i) => {
            // Only the first frame is in the server's HTML.
            if (i > 0 && !framesWanted) return null
            const image = scene.panTo ? SCREENS[scene.panTo.image] : SCREENS[scene.id]
            const panY = scene.panTo?.y ?? 0
            return (
              <div
                key={scene.id}
                ref={(el) => engine.setLayer(i, el)}
                aria-hidden={i === shown ? undefined : true}
                className="absolute inset-0"
                style={{ visibility: i === shown || i === leaving ? 'visible' : 'hidden', zIndex: i === shown ? 2 : 1 }}
              >
                <Picture id={scene.id} priority={priority && i === 0} lazy={i === 0} className="absolute left-0 top-0 h-auto w-full" />
                {framesWanted && !reduced && scene.panTo && (
                  <>
                    <div data-pan className="absolute left-0 top-0 w-full opacity-0">
                      <Picture id={scene.panTo.image} className="h-auto w-full" />
                    </div>
                    <div
                      data-strip-dark
                      className="absolute inset-x-0 top-0 overflow-hidden opacity-0"
                      style={{ height: `${(STATUS_STRIP_HEIGHT / SCREENS[scene.id].height) * 100}%`, ...STRIP_FADE }}
                    >
                      <Picture id={scene.id} className="h-auto w-full" />
                    </div>
                    <div data-strip-paper className="absolute inset-x-0 top-0 opacity-0" style={STRIP_FADE}>
                      <Picture id="statusbar.paper" className="h-auto w-full" />
                    </div>
                  </>
                )}
                {scene.tap && !reduced && (
                  <span
                    data-tap
                    aria-hidden
                    className="absolute rounded-full opacity-0"
                    style={{
                      left: `${(scene.tap.x / image.width) * 100}%`,
                      top: `${((scene.tap.y - panY) / SCREENS[scene.id].height) * 100}%`,
                      width: '13cqw',
                      height: '13cqw',
                      background: 'rgba(22,50,35,0.28)',
                      boxShadow: '0 0 0 1.5px rgba(255,255,255,0.75)',
                    }}
                  />
                )}
              </div>
            )
          })}
        </PhoneShell>
      </div>
    </div>
  )
}
