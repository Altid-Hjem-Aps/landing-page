import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'

vi.mock('@/components/Nav', () => ({ default: () => null }))
vi.mock('@/components/sections/BottomCta', () => ({ default: () => null }))
vi.mock('@/components/Footer', () => ({ default: () => null }))

import ElprisAppMockup from '@/components/ElprisAppMockup'
import IPhoneMockup from '@/components/IPhoneMockup'
import EtHjemStage from '@/components/sections/why/EtHjemStage'
import Abonnementer from '@/app/opsig-abonnementer/page'
import Alarm from '@/app/hvad-koster-en-tyverialarm/page'
import Elselskab from '@/app/billigste-elselskab/page'
import Forsikring from '@/app/hvad-koster-forsikring/page'
import Indbo from '@/app/hvad-koster-indboforsikring/page'
import Mobil from '@/app/billigste-mobilabonnement/page'
import Skift from '@/app/skift-forsikringsselskab/page'
import { SAVINGS_DISCLAIMER, SCREENSHOT_CAPTION } from '@/lib/copy'
import { HERO_FRAMES, SEO_FRAMES, STORY_SCENES, screenSrc } from '@/lib/screen-captures'

let decodeOk = true
let reducedMotion = false
let decodeGate: Record<string, Promise<void>> = {}
let intersect: (isIntersecting: boolean) => void = () => {}

beforeEach(() => {
  decodeOk = true
  reducedMotion = false
  decodeGate = {}
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('reduced-motion') && reducedMotion,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia
  vi.stubGlobal(
    'Image',
    class {
      src = ''
      decode = () => decodeGate[this.src] ?? (decodeOk ? Promise.resolve() : Promise.reject(new Error('404')))
    },
  )
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(private callback: IntersectionObserverCallback) {
        intersect = (isIntersecting) =>
          act(() => this.callback([{ isIntersecting } as IntersectionObserverEntry], this as unknown as IntersectionObserver))
      }
      observe() {}
      disconnect() {}
      unobserve() {}
    },
  )
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} unobserve() {} })
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true })
})

describe('the hero phones', () => {
  it('show the three board frames and the caption once', () => {
    const { container } = render(<IPhoneMockup />)
    const srcs = [...container.querySelectorAll('img')].map((img) => img.getAttribute('src'))
    expect(new Set(srcs)).toEqual(new Set(HERO_FRAMES.map((f) => screenSrc(f.id))))
    expect(screen.getAllByText(SCREENSHOT_CAPTION)).toHaveLength(1)
  })

  const activeSlideSrc = (container: HTMLElement) =>
    container.querySelector('[aria-hidden="false"] img')?.getAttribute('src')

  it('moves to the slide a dot asks for', async () => {
    const { container } = render(<IPhoneMockup />)
    fireEvent.click(screen.getByRole('button', { name: 'Skærm 2' }))
    await waitFor(() => expect(activeSlideSrc(container)).toBe(screenSrc(HERO_FRAMES[1].id)))
  })

  // Risk: a failed image blanks the phone.
  it('keeps the current frame and logs when the next one fails', async () => {
    decodeOk = false
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { container } = render(<IPhoneMockup />)
    fireEvent.click(screen.getByRole('button', { name: 'Skærm 3' }))
    await act(async () => {})
    await waitFor(() => expect(error).toHaveBeenCalled())
    expect(activeSlideSrc(container)).toBe(screenSrc(HERO_FRAMES[0].id))
  })
})

describe('the hero carousel on its own', () => {
  const activeSlideSrc = (container: HTMLElement) =>
    container.querySelector('[aria-hidden="false"] img')?.getAttribute('src')
  const secondFrame = screenSrc(HERO_FRAMES[1].id)
  const firstFrame = screenSrc(HERO_FRAMES[0].id)
  const passTimer = () => act(async () => { await vi.advanceTimersByTimeAsync(6100) })

  it('advances while it is on screen', async () => {
    vi.useFakeTimers()
    const { container } = render(<IPhoneMockup />)
    intersect(true)
    await passTimer()
    expect(activeSlideSrc(container)).toBe(secondFrame)
  })

  it('does not advance off screen', async () => {
    vi.useFakeTimers()
    const { container } = render(<IPhoneMockup />)
    intersect(false)
    await passTimer()
    expect(activeSlideSrc(container)).toBe(firstFrame)
  })

  it('does not advance on a hidden tab', async () => {
    vi.useFakeTimers()
    Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true })
    const { container } = render(<IPhoneMockup />)
    intersect(true)
    await passTimer()
    expect(activeSlideSrc(container)).toBe(firstFrame)
  })

  it('does not advance under reduced motion', async () => {
    vi.useFakeTimers()
    reducedMotion = true
    const { container } = render(<IPhoneMockup />)
    intersect(true)
    await passTimer()
    expect(activeSlideSrc(container)).toBe(firstFrame)
  })

  // Risk: one failed frame stops the carousel for good.
  it('tries again after a failed frame', async () => {
    vi.useFakeTimers()
    decodeOk = false
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { container } = render(<IPhoneMockup />)
    intersect(true)
    await passTimer()
    expect(activeSlideSrc(container)).toBe(firstFrame)
    decodeOk = true
    await passTimer()
    expect(activeSlideSrc(container)).toBe(secondFrame)
  })

  // Risk: a slow frame undoes a later tap.
  it('lets the last tap win over a slower frame', async () => {
    let releaseSlow = () => {}
    decodeGate[screenSrc(HERO_FRAMES[2].id)] = new Promise((resolve) => { releaseSlow = resolve })
    const { container } = render(<IPhoneMockup />)
    fireEvent.click(screen.getByRole('button', { name: 'Skærm 3' }))
    fireEvent.click(screen.getByRole('button', { name: 'Skærm 2' }))
    await waitFor(() => expect(activeSlideSrc(container)).toBe(secondFrame))
    await act(async () => { releaseSlow() })
    expect(activeSlideSrc(container)).toBe(secondFrame)
  })
})

describe('the WhatIs story under reduced motion', () => {
  // Risk: the dots exist only on the client, and React throws the page's HTML away.
  it('hydrates without a mismatch, then offers dots', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const host = document.createElement('div')
    document.body.append(host)
    // A server cannot know the visitor's setting; the browser does from the first render.
    host.innerHTML = renderToString(<EtHjemStage />)
    reducedMotion = true
    const recoverable = vi.fn()
    const root = hydrateRoot(host, <EtHjemStage />, { onRecoverableError: recoverable })
    await act(async () => {})
    expect(recoverable).not.toHaveBeenCalled()
    expect(error.mock.calls.filter(([m]) => String(m).includes('ydrat'))).toEqual([])
    expect(host.querySelectorAll('button')).toHaveLength(STORY_SCENES.length)
    act(() => root.unmount())
    host.remove()
  })

  it('has no dots when motion is allowed', async () => {
    render(<EtHjemStage />)
    await act(async () => {})
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('marks the frame a dot asks for', async () => {
    reducedMotion = true
    render(<EtHjemStage />)
    await act(async () => {})
    const dots = screen.getAllByRole('button')
    expect(dots[STORY_SCENES.length - 1].getAttribute('aria-current')).toBe('true')
    fireEvent.click(dots[0])
    expect(dots[0].getAttribute('aria-current')).toBe('true')
    expect(dots[STORY_SCENES.length - 1].getAttribute('aria-current')).toBe('false')
  })
})

describe('the SEO pages', () => {
  // Risk: a page drops its picture or still calls a real screen an illustration.
  it.each([
    ['/billigste-elselskab', Elselskab, SEO_FRAMES.elselskab],
    ['/opsig-abonnementer', Abonnementer, SEO_FRAMES.abonnementer],
    ['/hvad-koster-en-tyverialarm', Alarm, SEO_FRAMES.alarm],
    ['/hvad-koster-indboforsikring', Indbo, SEO_FRAMES.indbo],
    ['/hvad-koster-forsikring', Forsikring, SEO_FRAMES.forsikring],
    ['/billigste-mobilabonnement', Mobil, SEO_FRAMES.mobil],
    ['/skift-forsikringsselskab', Skift, SEO_FRAMES.skift],
  ])('%s shows its frame with the caption', (_path, Page, frame) => {
    const { container } = render(<Page />)
    const img = screen.getByAltText(frame.alt)
    expect(img.getAttribute('src')).toBe(screenSrc(frame.id))
    expect(container.textContent).toContain(SCREENSHOT_CAPTION)
    expect(container.textContent).not.toContain('Illustration, ikke et')
  })

  // Risk: the Consumer Ombudsman's notice of 9 Sep: this frame says "spar 2.028 kr.".
  it('/opsig-abonnementer carries the source footnote with its saving figure', () => {
    const { container } = render(<Abonnementer />)
    const caption = [...container.querySelectorAll('p')].find((p) => p.textContent?.includes(SCREENSHOT_CAPTION))
    expect(caption?.textContent).toContain(SAVINGS_DISCLAIMER)
  })

  it('/hvornar-er-strommen-billigst shows its frame with the caption', () => {
    render(<ElprisAppMockup />)
    expect(screen.getByAltText(SEO_FRAMES.elpris.alt).getAttribute('src')).toBe(screenSrc(SEO_FRAMES.elpris.id))
    expect(screen.getByText(SCREENSHOT_CAPTION)).toBeInTheDocument()
  })
})
