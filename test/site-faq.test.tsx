import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import Spoergsmaal from '@/components/site/Spoergsmaal'

type Faq = { '@type': string; mainEntity: { name: string; acceptedAnswer: { text: string } }[] }

function setup() {
  const { container } = render(<Spoergsmaal />)
  const script = container.querySelector('script[type="application/ld+json"]') as HTMLScriptElement
  return { container, data: JSON.parse(script.textContent ?? '') as Faq }
}

describe('Spørgsmål', () => {
  // Risk: search engines read answers the page does not show.
  it('the structured data holds exactly the visible questions and answers', () => {
    const { container, data } = setup()
    expect(data['@type']).toBe('FAQPage')
    const visible = [...container.querySelectorAll('details')]
    expect(data.mainEntity.map((q) => q.name)).toEqual(visible.map((d) => d.querySelector('summary')?.textContent))
    data.mainEntity.forEach((q, i) => expect(visible[i].querySelector('p')?.textContent).toBe(q.acceptedAnswer.text))
  })

  it('opens with the first question, and the rest stay closed', () => {
    const { container } = setup()
    expect([...container.querySelectorAll('details')].map((d) => d.open)).toEqual([true, ...Array(9).fill(false)])
  })

  // Risk: the one savings figure on the site loses its source.
  it('11.207 kr. stands with what it compares and a link to the report', () => {
    setup()
    const answer = screen.getByText(/11\.207 kr\./)
    expect(answer.textContent).toContain('21,6 % mindre i den billigste kæde end i den midterste af 13 kæder')
    const details = answer.closest('details') as HTMLElement
    expect(within(details).getByRole('link', { name: 'Læs rapporten', hidden: true })).toHaveAttribute(
      'href',
      'https://altidmad.dk/altid-mad-kvartalsrapport-q3.pdf',
    )
  })

  // Risk: clicks from the answer count as another spot on the page.
  it('counts a store click from the answer as faq', async () => {
    const sendBeacon = vi.fn((url: string, data: Blob) => {
      void url
      void data
      return true
    })
    vi.stubGlobal('navigator', { ...navigator, sendBeacon })
    setup()
    fireEvent.click(screen.getByRole('link', { name: 'Hent i App Store', hidden: true }))
    expect(JSON.parse(await sendBeacon.mock.calls[0][1].text())).toEqual({ store: 'appstore', position: 'faq' })
    vi.unstubAllGlobals()
  })

  it('links to the page about deleting an account', () => {
    setup()
    expect(screen.getByRole('link', { name: 'Sådan sletter du din konto', hidden: true })).toHaveAttribute('href', '/slet-konto')
  })
})
