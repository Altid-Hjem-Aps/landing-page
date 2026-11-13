import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Psst, type PsstLevel } from '@/components/site/Steps'

// The Psst icon in the steps (Thor 13/11): level 1 while step 03 is open brings the icon and
// its bubble a second later, level 2 on step 04 brings the partner icon once the first has had
// two seconds, level 0 sends them away. The CSS animates on data-state and data-pair, so these
// are the whole contract. Risk: something hops out of a page that has just opened, or the
// partner lands before the first icon has.

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

const wait = (ms: number) => act(() => vi.advanceTimersByTime(ms))

function mount(level: PsstLevel) {
  const view = render(<Psst level={level} />)
  const box = () => view.container.querySelector('.st-psst') as HTMLElement
  return {
    box,
    state: () => box().getAttribute('data-state'),
    pair: () => box().getAttribute('data-pair'),
    to: (next: PsstLevel) => view.rerender(<Psst level={next} />),
  }
}

describe('Psst', () => {
  it('shows nothing on a fresh page, and nothing hops out of it', () => {
    const psst = mount(0)
    expect(psst.state()).toBeNull()
    expect(psst.pair()).toBeNull()
    wait(10000)
    expect(psst.state()).toBeNull()
    expect(psst.pair()).toBeNull()
  })

  it('brings the icon in one second after level 1, and measures its hop', () => {
    const psst = mount(1)
    wait(999)
    expect(psst.state()).toBeNull()
    wait(1)
    expect(psst.state()).toBe('in')
    expect(psst.box().style.getPropertyValue('--hop')).toMatch(/^-?\d+px$/)
    expect(psst.pair()).toBeNull()
  })

  it('says the line in the bubble', () => {
    const psst = mount(1)
    expect(psst.box().querySelector('.st-psst-bubble')).toHaveTextContent('Psst ... vi lancerer løbende flere tjenester. Snart kommer mobil, opladning og alarm.')
  })

  it('goes out only after it was in: a level 1 shorter than a second leaves no trace', () => {
    const psst = mount(1)
    wait(500)
    psst.to(0)
    expect(psst.state()).toBeNull()
    wait(5000)
    expect(psst.state()).toBeNull()
    psst.to(1)
    wait(1000)
    expect(psst.state()).toBe('in')
    psst.to(0)
    expect(psst.state()).toBe('out')
    psst.to(1)
    expect(psst.state()).toBe('out')
    wait(1000)
    expect(psst.state()).toBe('in')
  })

  it('brings the partner in on level 2 no sooner than two seconds after the icon came in', () => {
    const psst = mount(1)
    wait(1000)
    expect(psst.state()).toBe('in')
    psst.to(2)
    wait(1999)
    expect(psst.pair()).toBeNull()
    wait(1)
    expect(psst.pair()).toBe('in')
    expect(psst.state()).toBe('in')
  })

  it('waits at least 300 ms for the partner when the icon has been in for long', () => {
    const psst = mount(1)
    wait(1000)
    wait(5000)
    psst.to(2)
    wait(299)
    expect(psst.pair()).toBeNull()
    wait(1)
    expect(psst.pair()).toBe('in')
  })

  it('brings the icon, then the partner, when the page goes straight to level 2', () => {
    const psst = mount(0)
    psst.to(2)
    wait(1000)
    expect(psst.state()).toBe('in')
    expect(psst.pair()).toBeNull()
    wait(2000)
    expect(psst.pair()).toBe('in')
  })

  it('sends the partner back out on level 1 and keeps the icon', () => {
    const psst = mount(1)
    wait(1000)
    psst.to(2)
    wait(2000)
    expect(psst.pair()).toBe('in')
    psst.to(1)
    expect(psst.pair()).toBe('out')
    expect(psst.state()).toBe('in')
    psst.to(2)
    wait(299)
    expect(psst.pair()).toBe('out')
    wait(1)
    expect(psst.pair()).toBe('in')
  })

  it('sends both out on level 0', () => {
    const psst = mount(1)
    wait(1000)
    psst.to(2)
    wait(2000)
    psst.to(0)
    expect(psst.state()).toBe('out')
    expect(psst.pair()).toBe('out')
    wait(10000)
    expect(psst.state()).toBe('out')
    expect(psst.pair()).toBe('out')
  })

  it('keeps the partner out of the accessibility tree', () => {
    const psst = mount(2)
    expect(psst.box().querySelector('.st-pair')).toHaveAttribute('aria-hidden', 'true')
    for (const img of Array.from(psst.box().querySelectorAll('img'))) expect(img).toHaveAttribute('alt', '')
  })
})
