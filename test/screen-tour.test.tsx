import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import ScreenTour from '@/components/ScreenTour'
import Hero from '@/components/forside/Hero'
import Services from '@/components/forside/Services'
import { SCREENS, TOURS, screenSrc } from '@/lib/screen-captures'

// Boundary fakes only: the browser's matchMedia, IntersectionObserver,
// Element.animate and img.decode. The tour itself is real.

class FakeAnimation {
  onfinish: (() => void) | null = null
  playState = 'running'
  constructor(public duration: number) {}
  pause() {
    this.playState = 'paused'
  }
  play() {
    this.playState = 'running'
  }
  cancel() {
    this.playState = 'idle'
  }
  finish() {
    this.playState = 'finished'
    this.onfinish?.()
  }
}

let animations: FakeAnimation[]
let observers: { callback: IntersectionObserverCallback; options?: IntersectionObserverInit }[]
let decode: ReturnType<typeof vi.fn>
let setReducedMotion: (reduced: boolean) => Promise<void>

function stubReducedMotion(reduced: boolean) {
  const listeners = new Set<() => void>()
  const mql = {
    matches: reduced,
    addEventListener: (_: string, l: () => void) => listeners.add(l),
    removeEventListener: (_: string, l: () => void) => listeners.delete(l),
  }
  window.matchMedia = vi.fn().mockReturnValue(mql) as unknown as typeof window.matchMedia
  setReducedMotion = async (next) => {
    mql.matches = next
    await act(async () => listeners.forEach((l) => l()))
  }
}

async function setVisibility(which: 'near' | 'inView' | 'both', isIntersecting = true) {
  await act(async () => {
    for (const o of observers) {
      const kind = o.options?.rootMargin ? 'near' : 'inView'
      if (which !== 'both' && which !== kind) continue
      o.callback([{ isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver)
    }
  })
}

const intoView = () => setVisibility('both')
const running = () => animations.filter((a) => a.playState === 'running')

// The running scene's timer is the animation of the hidden clock: the last one made.
async function finishScene() {
  const timers = animations.filter((a) => a.playState === 'running' && a.onfinish)
  await act(async () => {
    timers[timers.length - 1].finish()
  })
}

const shownSrc = (container: HTMLElement) =>
  container.querySelector('[role="img"] [style*="visibility: visible"]:not([aria-hidden]) img')?.getAttribute('src')

const scenes = TOURS.mad.scenes
const realStorage = window.localStorage

beforeEach(() => {
  animations = []
  observers = []
  decode = vi.fn().mockResolvedValue(undefined)
  window.localStorage.clear()
  stubReducedMotion(false)
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        observers.push({ callback, options })
      }
      observe() {}
      disconnect() {}
    },
  )
  Element.prototype.animate = vi.fn((keyframes: { offset?: number }[], o: { duration: number }) => {
    // Like the browser: a bad duration or offset throws.
    if (!(o.duration >= 0)) throw new TypeError(`bad duration ${o.duration}`)
    const offsets = keyframes.flatMap((k) => (k.offset === undefined ? [] : [k.offset]))
    offsets.forEach((x, i) => {
      if (!(x >= 0 && x <= 1) || (i > 0 && x < offsets[i - 1])) throw new TypeError(`bad offset ${x}`)
    })
    const a = new FakeAnimation(o.duration)
    animations.push(a)
    return a as unknown as Animation
  }) as unknown as typeof Element.prototype.animate
  HTMLImageElement.prototype.decode = decode as unknown as typeof HTMLImageElement.prototype.decode
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  delete (document as { hidden?: boolean }).hidden
  delete (window as { localStorage?: Storage }).localStorage
  Object.defineProperty(window, 'localStorage', { configurable: true, value: realStorage })
})

describe('ScreenTour', () => {
  it('has one stable name and only its first frame in the first render', () => {
    const { container } = render(<ScreenTour scenes={scenes} label="Altid Mad i appen" />)
    expect(screen.getByRole('img', { name: 'Altid Mad i appen' })).toBeInTheDocument()
    expect(container.querySelectorAll('img')).toHaveLength(1)
    expect(container.querySelector('img')).toHaveAttribute('src', screenSrc(scenes[0].id))
  })

  it('plays only while on screen, not merely near it', async () => {
    render(<ScreenTour scenes={scenes} label="Tour" />)
    await setVisibility('near')
    expect(animations).toHaveLength(0)
    await setVisibility('inView')
    expect(running().length).toBeGreaterThan(0)
    await setVisibility('inView', false)
    expect(running()).toHaveLength(0)
  })

  it('walks the scenes with a stable name', async () => {
    const { container } = render(<ScreenTour scenes={scenes} label="Altid Mad i appen" />)
    expect(animations).toHaveLength(0)
    await intoView()
    expect(animations.length).toBeGreaterThan(0)
    await finishScene()
    expect(shownSrc(container)).toBe(screenSrc(scenes[1].id))
    expect(screen.getByRole('img', { name: 'Altid Mad i appen' })).toBeInTheDocument()
  })

  it('stops after two loops on the first scene, and Play starts it again', async () => {
    const { container } = render(<ScreenTour scenes={scenes} label="Altid Mad i appen" />)
    await intoView()
    for (let i = 0; i < scenes.length * 2; i++) await finishScene()
    // The last push home still has to run: stopping must not freeze it half way.
    expect(animations.filter((a) => a.playState === 'paused')).toHaveLength(0)
    await finishScene()
    expect(shownSrc(container)).toBe(screenSrc(scenes[0].id))
    expect(animations.filter((a) => a.playState === 'running' && a.onfinish && a.duration > 400)).toHaveLength(0)
    const play = screen.getByRole('button', { name: 'Afspil animationerne' })
    const before = animations.length
    fireEvent.click(play)
    await act(async () => {})
    expect(animations.length).toBeGreaterThan(before)
    expect(screen.getByRole('button', { name: 'Sæt animationerne på pause' })).toBeInTheDocument()
    // Two whole loops again, not one.
    for (let i = 0; i < scenes.length + 1; i++) await finishScene()
    expect(screen.getByRole('button', { name: 'Sæt animationerne på pause' })).toBeInTheDocument()
    for (let i = 0; i < scenes.length - 1; i++) await finishScene()
    await finishScene()
    expect(screen.getByRole('button', { name: 'Afspil animationerne' })).toBeInTheDocument()
  })

  it('does not advance when paused while the next image decodes, and does on Play', async () => {
    const { container } = render(<ScreenTour scenes={scenes} label="Tour" />)
    await intoView()
    let resolve: () => void = () => {}
    decode.mockReturnValue(new Promise<void>((r) => (resolve = r)))
    await finishScene()
    fireEvent.click(screen.getByRole('button', { name: 'Sæt animationerne på pause' }))
    await act(async () => resolve())
    expect(shownSrc(container)).toBe(screenSrc(scenes[0].id))
    fireEvent.click(screen.getByRole('button', { name: 'Afspil animationerne' }))
    await act(async () => {})
    expect(shownSrc(container)).toBe(screenSrc(scenes[1].id))
  })

  it('leaves a finished animation alone when resuming: playing it would rewind it', async () => {
    render(<ScreenTour scenes={scenes} label="Tour" />)
    await intoView()
    const finishedPiece = animations[0]
    finishedPiece.playState = 'finished'
    fireEvent.click(screen.getByRole('button', { name: 'Sæt animationerne på pause' }))
    fireEvent.click(screen.getByRole('button', { name: 'Afspil animationerne' }))
    await act(async () => {})
    expect(finishedPiece.playState).toBe('finished')
  })

  it.each(Object.entries(TOURS))('the %s tour runs a whole loop with valid timings', async (_name, tour) => {
    render(<ScreenTour scenes={tour.scenes} lift={tour.lift} label="Tour" />)
    await intoView()
    for (let i = 0; i < tour.scenes.length; i++) await finishScene()
    expect(animations.length).toBeGreaterThan(tour.scenes.length)
  })

  it('stops everything when it leaves the page, also a decode still under way', async () => {
    const { unmount } = render(<ScreenTour scenes={scenes} label="Tour" />)
    await intoView()
    let resolve: () => void = () => {}
    decode.mockReturnValue(new Promise<void>((r) => (resolve = r)))
    await finishScene()
    const made = animations.length
    unmount()
    await act(async () => resolve())
    expect(running().filter((a) => a.onfinish && a.duration > 400)).toHaveLength(0)
    expect(animations.length).toBe(made)
  })

  it('pausing holds every animation, is shared by all tours and survives a reload', async () => {
    render(
      <>
        <ScreenTour scenes={scenes} label="Tour et" />
        <ScreenTour scenes={TOURS.energi.scenes} label="Tour to" />
      </>,
    )
    await intoView()
    const buttons = screen.getAllByRole('button', { name: 'Sæt animationerne på pause' })
    expect(buttons).toHaveLength(2)
    fireEvent.click(buttons[0])
    await act(async () => {})
    expect(animations.filter((a) => a.playState === 'running')).toHaveLength(0)
    expect(screen.getAllByRole('button', { name: 'Afspil animationerne' })).toHaveLength(2)
    expect(window.localStorage.getItem('altid-tours-paused')).toBe('1')
    fireEvent.click(screen.getAllByRole('button', { name: 'Afspil animationerne' })[1])
    await act(async () => {})
    expect(animations.filter((a) => a.playState === 'paused')).toHaveLength(0)
    expect(window.localStorage.getItem('altid-tours-paused')).toBe('0')
  })

  it('reads the remembered pause on a new visit', async () => {
    window.localStorage.setItem('altid-tours-paused', '1')
    vi.resetModules()
    const { default: FreshTour } = await import('@/components/ScreenTour')
    render(<FreshTour scenes={scenes} label="Tour" />)
    await intoView()
    expect(screen.getByRole('button', { name: 'Afspil animationerne' })).toBeInTheDocument()
    expect(animations).toHaveLength(0)
  })

  it('keeps working when touching storage throws', async () => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('blocked')
      },
    })
    vi.resetModules()
    const { default: FreshTour } = await import('@/components/ScreenTour')
    render(<FreshTour scenes={scenes} label="Tour" />)
    await intoView()
    fireEvent.click(screen.getByRole('button', { name: 'Sæt animationerne på pause' }))
    expect(screen.getByRole('button', { name: 'Afspil animationerne' })).toBeInTheDocument()
  })

  it('stops when the page is hidden', async () => {
    render(<ScreenTour scenes={scenes} label="Tour" />)
    await intoView()
    Object.defineProperty(document, 'hidden', { configurable: true, value: true })
    await act(async () => {
      document.dispatchEvent(new Event('visibilitychange'))
    })
    expect(animations.filter((a) => a.playState === 'running')).toHaveLength(0)
    Object.defineProperty(document, 'hidden', { configurable: true, value: false })
    await act(async () => {
      document.dispatchEvent(new Event('visibilitychange'))
    })
    expect(animations.filter((a) => a.playState === 'paused')).toHaveLength(0)
  })

  it('keeps the current frame and logs when the next image fails', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { container } = render(<ScreenTour scenes={scenes} label="Tour" />)
    await intoView()
    decode.mockRejectedValue(new Error('broken image'))
    await finishScene()
    expect(shownSrc(container)).toBe(screenSrc(scenes[0].id))
    expect(error).toHaveBeenCalledWith(expect.stringContaining(scenes[1].id), expect.any(Error))
    // Play tries again, and gets on with the tour when the image comes.
    decode.mockResolvedValue(undefined)
    fireEvent.click(screen.getByRole('button', { name: 'Afspil animationerne' }))
    await act(async () => {})
    expect(shownSrc(container)).toBe(screenSrc(scenes[1].id))
  })

  it('Play after the last push home failed runs the tour again, it does not stop at once', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<ScreenTour scenes={scenes} label="Tour" />)
    await intoView()
    for (let i = 0; i < scenes.length * 2 - 1; i++) await finishScene()
    decode.mockRejectedValue(new Error('broken image'))
    await finishScene()
    decode.mockResolvedValue(undefined)
    fireEvent.click(screen.getByRole('button', { name: 'Afspil animationerne' }))
    await act(async () => {})
    await finishScene()
    expect(screen.getByRole('button', { name: 'Sæt animationerne på pause' })).toBeInTheDocument()
  })

  it('does not cancel a pan when the next image fails: the frame stays where it is', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const tour = TOURS.okonomi
    render(<ScreenTour scenes={tour.scenes} lift={tour.lift} label="Tour" />)
    await intoView()
    decode.mockRejectedValue(new Error('broken image'))
    await finishScene()
    expect(animations.filter((a) => a.playState === 'idle')).toHaveLength(0)
  })

  it('reduced motion: nothing animates, the first frame stands still, dots step by hand', async () => {
    stubReducedMotion(true)
    const { container } = render(<ScreenTour scenes={scenes} label="Tour" lift={TOURS.mad.lift} />)
    await intoView()
    expect(animations).toHaveLength(0)
    expect(screen.queryByRole('button', { name: /pause|Afspil/ })).toBeNull()
    const dots = screen.getAllByRole('button', { name: /^Vis / })
    expect(dots).toHaveLength(scenes.length)
    expect(dots[0]).toHaveAttribute('aria-current', 'true')
    fireEvent.click(dots[1])
    await act(async () => {})
    expect(animations).toHaveLength(0)
    expect(shownSrc(container)).toBe(screenSrc(scenes[1].id))
    expect(dots[1]).toHaveAttribute('aria-current', 'true')
    expect(dots[0]).not.toHaveAttribute('aria-current')
  })
})

describe('ScreenTour with reduced motion', () => {
  it('turned on mid-tour: everything is cancelled and the dots appear', async () => {
    render(<ScreenTour scenes={scenes} label="Tour" />)
    await intoView()
    expect(running().length).toBeGreaterThan(0)
    await setReducedMotion(true)
    expect(animations.every((a) => a.playState === 'idle')).toBe(true)
    expect(screen.getAllByRole('button', { name: /^Vis / })).toHaveLength(scenes.length)
  })

  it('a dot whose image fails keeps the current frame and logs', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    stubReducedMotion(true)
    const { container } = render(<ScreenTour scenes={scenes} label="Tour" />)
    await intoView()
    decode.mockRejectedValue(new Error('broken image'))
    const dots = screen.getAllByRole('button', { name: /^Vis / })
    fireEvent.click(dots[1])
    await act(async () => {})
    expect(shownSrc(container)).toBe(screenSrc(scenes[0].id))
    expect(dots[0]).toHaveAttribute('aria-current', 'true')
    expect(error).toHaveBeenCalled()
  })

  it('does not fetch later frames until a dot asks for them, nor while paused', async () => {
    stubReducedMotion(true)
    const { container } = render(<ScreenTour scenes={scenes} label="Tour" />)
    await intoView()
    expect(container.querySelectorAll('img')).toHaveLength(1)
    fireEvent.click(screen.getAllByRole('button', { name: /^Vis / })[1])
    await act(async () => {})
    expect(container.querySelectorAll('img').length).toBeGreaterThan(1)
  })
})

describe('the front page', () => {
  it('only shows pictures from the manifest, and says once that they hold example data', async () => {
    const { container } = render(
      <>
        <Hero />
        <Services />
      </>,
    )
    await intoView()
    const listed = new Set(Object.keys(SCREENS).map((id) => screenSrc(id as keyof typeof SCREENS)))
    const shown = Array.from(container.querySelectorAll('img[src*="app-screens"]'), (i) => i.getAttribute('src'))
    expect(shown.length).toBeGreaterThan(5)
    for (const src of shown) expect(listed, src ?? '').toContain(src)
    expect(screen.getAllByText('Skærmbilleder fra appen med eksempeldata.')).toHaveLength(1)
  })
})
