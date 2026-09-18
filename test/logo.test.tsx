import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Logo } from '@/components/Logo'

describe('Logo', () => {
  // The wordmark fills its viewBox edge to edge, so a clipped root <svg> shaves
  // the right leg of the "m" in "hjem" at fractional device-pixel sizes.
  it('does not clip the artwork to the svg box', () => {
    const { container } = render(<Logo variant="forest" />)
    expect(container.querySelector('svg')).toHaveStyle({ overflow: 'visible' })
  })

  it('keeps the caller’s style alongside the overflow fix', () => {
    const { container } = render(<Logo variant="dark" style={{ width: 48, height: 'auto' }} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveStyle({ overflow: 'visible', width: '48px' })
  })
})
