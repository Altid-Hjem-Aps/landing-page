import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import Nav from '@/components/Nav'
import KeepJsClass from '@/components/site/primitives/KeepJsClass'
import { MOTION_SCRIPT } from '@/lib/platform'

vi.mock('@amplitude/analytics-browser', () => ({ track: vi.fn() }))

// WCAG 2.2.2: the visitor can stop every loop, and the choice is still there on
// the next page load. The CSS rule on html[data-motion] does the stopping.

afterEach(() => {
  delete document.documentElement.dataset.motion
  localStorage.clear()
})

const FrontPageNav = () => <Nav motionControl />

describe('Pause control', () => {
  // Risk: the control is dropped from the pill, or shows on pages with nothing to stop.
  it('sits in the nav pill only where the page asks for it', () => {
    const { unmount } = render(<FrontPageNav />)
    const pill = screen.getByRole('navigation', { name: 'Hovedmenu' })
    expect(within(pill).getByRole('button', { name: 'Stop bevægelse' })).toBeInTheDocument()
    unmount()

    render(<Nav />)
    expect(screen.queryByRole('button', { name: 'Stop bevægelse' })).toBeNull()
  })

  it('stops and starts the loops, and says which it will do', () => {
    render(<FrontPageNav />)
    const stop = screen.getByRole('button', { name: 'Stop bevægelse' })
    expect(stop).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(stop)
    expect(document.documentElement.dataset.motion).toBe('paused')
    const start = screen.getByRole('button', { name: 'Start bevægelse' })
    expect(start).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(start)
    expect(document.documentElement.dataset.motion).toBeUndefined()
    expect(screen.getByRole('button', { name: 'Stop bevægelse' })).toBeInTheDocument()
  })

  it('still works for this visit when storage is blocked', () => {
    const blocked = Object.getOwnPropertyDescriptor(window, 'localStorage')
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('blocked')
      },
    })
    try {
      render(<FrontPageNav />)
      fireEvent.click(screen.getByRole('button', { name: 'Stop bevægelse' }))
      expect(document.documentElement.dataset.motion).toBe('paused')
    } finally {
      if (blocked) Object.defineProperty(window, 'localStorage', blocked)
    }
  })
})

describe('KeepJsClass', () => {
  // Risk: React regenerates the root, the class goes and every pin dies with it.
  it('puts the class back when the root has lost it', () => {
    document.documentElement.classList.remove('js')
    render(<KeepJsClass />)
    expect(document.documentElement).toHaveClass('js')
    document.documentElement.classList.remove('js')
  })
})

describe('MOTION_SCRIPT, on the next page load', () => {
  const run = (storage: { getItem: (key: string) => string | null }) => {
    const classes: string[] = []
    const fakeDocument = { documentElement: { dataset: {} as Record<string, string>, classList: { add: (c: string) => classes.push(c) } } }
    new Function('document', 'localStorage', MOTION_SCRIPT)(fakeDocument, storage)
    return { classes, motion: fakeDocument.documentElement.dataset.motion }
  }

  it('keeps the loops stopped after a click on the button', () => {
    render(<FrontPageNav />)
    fireEvent.click(screen.getByRole('button', { name: 'Stop bevægelse' }))
    expect(run(localStorage)).toEqual({ classes: ['js'], motion: 'paused' })
  })

  it('leaves them running otherwise', () => {
    expect(run(localStorage)).toEqual({ classes: ['js'], motion: undefined })
  })

  it('turns the pins on even when storage is blocked', () => {
    const blocked = {
      getItem: () => {
        throw new Error('blocked')
      },
    }
    expect(run(blocked)).toEqual({ classes: ['js'], motion: undefined })
  })
})
