import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import AltidMad from '@/components/site/AltidMad'

// The one savings figure on the page stands only with its source.

describe('Altid Mad', () => {
  it('keeps the footnote and the report link next to 11.207 kr.', () => {
    render(<AltidMad />)
    const block = screen.getByText('Spar 11.207 kr. om året på dagligvarer*').closest('.am-number') as HTMLElement

    expect(block).toHaveTextContent('11.207 kr.')
    expect(block).toHaveTextContent(
      '*Altid Mad Q3-rapporten viser, at den samme ugentlige indkøbskurv til en familie på fire koster 21,6 % mindre i den billigste kæde end i den midterste af 13 kæder.',
    )
    const link = screen.getByRole('link', { name: 'Læs rapporten' })
    expect(block).toContainElement(link)
    expect(link).toHaveAttribute('href', 'https://altidmad.dk/altid-mad-kvartalsrapport-q3.pdf')
  })

  it('has the real figure in the first HTML, so nothing counts up to it', () => {
    expect(renderToString(<AltidMad />)).toContain('11.207 <span class="ah-unit">kr.</span>')
  })

  it('reads the dishes once, through the main plate, not twelve plates one by one', () => {
    render(<AltidMad />)
    const main = screen.getByRole('img', { name: /^Kylling i karry/ })
    expect(main.getAttribute('alt')).toContain('Burger med oksebøf')
    expect(screen.queryByRole('img', { name: /^Burger med oksebøf/ })).not.toBeInTheDocument()
  })
})
