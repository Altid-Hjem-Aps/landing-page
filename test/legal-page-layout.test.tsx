import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import LegalPageLayout, { LegalAddress } from '@/components/LegalPageLayout'
import Kontakt from '@/app/kontakt/page'
import Privatlivspolitik from '@/app/privatlivspolitik/page'
import { privacyPolicy } from '@/lib/privacyPolicy'

// Nav is a client component with scroll listeners and Amplitude — irrelevant here.
vi.mock('@/components/Nav', () => ({ default: () => null }))
// /kontakt and the legal pages are in the new site's look (like /presse): the nav and footer are
// stand-ins that only say they are there, and the scroll reveal is left out, so only the page
// itself is tested.
vi.mock('@/components/site/SiteNav', () => ({ default: () => <nav aria-label="Site nav" /> }))
vi.mock('@/components/site/SiteFooter', () => ({ default: () => <footer aria-label="Site footer" /> }))
vi.mock('@/components/site/Reveal', () => ({ default: () => null }))

describe('LegalPageLayout', () => {
  it('renders title, entity line and the "Senest opdateret" line when given', () => {
    render(
      <LegalPageLayout title="Testside" meta="Altid Hjem ApS · CVR 45637476" updated="september 2026">
        <p>Indhold</p>
      </LegalPageLayout>,
    )
    expect(screen.getByRole('heading', { level: 1, name: 'Testside' })).toBeInTheDocument()
    expect(screen.getByText('Altid Hjem ApS · CVR 45637476')).toBeInTheDocument()
    expect(screen.getByText('Senest opdateret: september 2026')).toBeInTheDocument()
    expect(screen.getByText('Indhold')).toBeInTheDocument()
  })

  it('omits the "Senest opdateret" line when no date is given', () => {
    render(
      <LegalPageLayout title="Testside" meta="Altid Hjem ApS">
        <p>Indhold</p>
      </LegalPageLayout>,
    )
    expect(screen.queryByText(/Senest opdateret/)).not.toBeInTheDocument()
  })

  // The new site's shell (Thor 15/11), like /presse and /kontakt: its nav (whose logo leads
  // home, so no "Tilbage" link) and footer around the page, inside the .site wrapper that gives
  // the cream surface.
  it('sits in the new site with its nav and footer', () => {
    const { container } = render(
      <LegalPageLayout title="Testside" meta="Altid Hjem ApS">
        <p>Indhold</p>
      </LegalPageLayout>,
    )
    expect(container.firstElementChild).toHaveClass('site')
    expect(screen.getByRole('navigation', { name: 'Site nav' })).toBeInTheDocument()
    expect(screen.getByRole('contentinfo', { name: 'Site footer' })).toBeInTheDocument()
    expect(within(screen.getByRole('main')).getByText('Indhold')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Tilbage/ })).not.toBeInTheDocument()
  })
})

describe('LegalAddress', () => {
  it('renders the entity name and the address lines it is given', () => {
    render(
      <LegalAddress name="Datatilsynet">
        <p>Carl Jacobsens Vej 35, 2500 Valby</p>
      </LegalAddress>,
    )
    expect(screen.getByText('Datatilsynet')).toBeInTheDocument()
    expect(screen.getByText('Carl Jacobsens Vej 35, 2500 Valby')).toBeInTheDocument()
  })
})

describe('/kontakt', () => {
  it('has a primary mailto action and the FAQ', () => {
    render(<Kontakt />)
    expect(screen.getByRole('heading', { level: 1, name: 'Support' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Skriv til hej@altidhjem.dk' })).toHaveAttribute('href', 'mailto:hej@altidhjem.dk')
    expect(screen.getByRole('heading', { level: 2, name: 'Ofte stillede spørgsmål' })).toBeInTheDocument()
    expect(screen.getByText('Jeg kan ikke logge ind')).toBeInTheDocument()
  })

  // Risk: Altid Energi questions land at hej@altidhjem.dk because the page gives no way to reach them.
  it('gives the Altid Energi mail, phone and phone hours from hej@ answer 8', () => {
    const { container } = render(<Kontakt />)
    const main = container.querySelector('main')!.textContent
    expect(screen.getByRole('link', { name: 'hej@altidenergi.dk' })).toHaveAttribute('href', 'mailto:hej@altidenergi.dk')
    expect(screen.getByRole('link', { name: '44 440 440' })).toHaveAttribute('href', 'tel:+4544440440')
    expect(main).toContain('mandag til fredag fra kl. 9.00 til 15.30')
    expect(main).not.toMatch(/[–—]/)
  })
})

describe('/privatlivspolitik', () => {
  it('renders all twelve numbered sections and the Datatilsynet complaint block', () => {
    render(<Privatlivspolitik />)
    const h2s = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(h2s).toHaveLength(12)
    expect(h2s[0]).toBe('1. Vi er den dataansvarlige')
    expect(h2s[7]).toBe('8. Datasikkerhed')
    expect(h2s[10]).toBe('11. Cookies')
    expect(h2s[11]).toBe('12. Ændringer')
    expect(screen.getByRole('link', { name: 'dt@datatilsynet.dk' })).toHaveAttribute('href', 'mailto:dt@datatilsynet.dk')
  })

  it('renders every section title and the update date from the policy data', () => {
    render(<Privatlivspolitik />)
    const h2s = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(h2s).toEqual(privacyPolicy.sections.map((s) => s.title))
    expect(screen.getByText('Senest opdateret: 27. november 2026')).toBeInTheDocument()
  })

  // ALT-2171: Alexander approved these two sentences word for word (27/11) for small questions
  // and the daily economy check. Risk: the wording drifts, or lands outside the section that
  // lists what is stored.
  it('states the two approved sentences verbatim, once each, in section 3', () => {
    render(<Privatlivspolitik />)
    const approved = [
      'Når du svarer på et lille spørgsmål i appen, gemmer vi svaret for at gøre tallene rigtige og appen bedre. Siger du, hvorfor du stopper, gemmer vi grunden uden dit navn. Vi kigger kun på samlede tal, aldrig på dig.',
      'En gang om dagen tjekker appen sine egne tal og sender kun ja eller nej til os, uden beløb eller butiksnavne, så vi kan finde og rette fejl.',
    ]
    const section3 = screen.getByRole('heading', { level: 2, name: '3. Hvilke oplysninger behandler vi?' }).closest('section') as HTMLElement
    const main = screen.getByRole('main')
    for (const sentence of approved) {
      expect(within(section3).getByText(sentence)).toBeInTheDocument()
      expect(within(main).getAllByText(sentence)).toHaveLength(1)
    }
  })

  it('lists every cookie and storage key the site sets, and lets the visitor change the choice', () => {
    render(<Privatlivspolitik />)
    const section = document.getElementById('cookies')
    expect(section).not.toBeNull()
    // Review 16/11: the list names what the new site really stores (the pop-ups' keys), and no
    // longer the old waitlist's keys, which nothing sets any more.
    for (const name of ['ah-cookie-consent:', 'am_confirm:', 'ah-leave-popup-shown:', 'ah-offer-popup-shown:', 'ah-offer-popup-closed:', 'norlys_auth:', 'tryg_demo_auth:', 'AMP_* (Amplitude):']) {
      expect(section).toHaveTextContent(name)
    }
    expect(within(section as HTMLElement).getByRole('button', { name: 'Cookieindstillinger' })).toBeInTheDocument()
  })

  it('lists every GDPR right as a run-in label', () => {
    render(<Privatlivspolitik />)
    for (const right of ['Indsigt:', 'Berigtigelse:', 'Sletning:', 'Begrænsning:', 'Dataportabilitet:', 'Indsigelse:', 'Tilbagetrækning af samtykke:']) {
      expect(screen.getByText(right)).toBeInTheDocument()
    }
  })

  it('says push messages are service messages and how to turn them off', () => {
    render(<Privatlivspolitik />)
    expect(screen.getByText(/De er ikke reklame/)).toBeInTheDocument()
    expect(screen.getByText(/Du slår notifikationer fra under Profil › Notifikationer i appen eller i din telefons indstillinger/)).toBeInTheDocument()
  })

  it('identifies Altid Hjem as data controller for Altid Forsikring', () => {
    render(<Privatlivspolitik />)
    expect(screen.getByText(/Altid Forsikring er en tjeneste under Altid Hjem ApS og ikke et selvstændigt selskab/)).toBeInTheDocument()
    expect(screen.queryByText(/Altid Mad og Altid Forsikring er selvstændige selskaber/)).not.toBeInTheDocument()
  })

  it('no longer lists storage keys that nothing sets', () => {
    render(<Privatlivspolitik />)
    const section = document.getElementById('cookies') as HTMLElement
    expect(section).not.toHaveTextContent('ah-waitlist-joined')
    expect(section).not.toHaveTextContent('ah-exit-intent-shown')
  })

  // Review 16/11: the newsletter and the anonymous counts on the site are described.
  it('describes the newsletter and the anonymous counts on the site', () => {
    render(<Privatlivspolitik />)
    expect(screen.getByText('Nyhedsbrev')).toBeInTheDocument()
    expect(screen.getByText(/tilmelde dig vores nyhedsbrev med din e-mailadresse/)).toBeInTheDocument()
    expect(screen.getByText('Optælling af klik og besøg på vores websteder')).toBeInTheDocument()
    expect(screen.getByText(/også hvis du har sagt nej til statistikcookies/)).toBeInTheDocument()
  })
})
