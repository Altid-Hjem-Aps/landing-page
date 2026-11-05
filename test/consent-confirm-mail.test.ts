import { describe, expect, it } from 'vitest'
import { confirmHeading, confirmIntro, renderConsentConfirmEmail } from '@/emails/consent-confirm'
import { consentSentences } from 'altid-consent'

// The group consent on the shared waitlist is the package's `mad` group sentence:
// "Altid Hjem og resten af familien: Forsikring, Energi og Mobil". The heading
// used to name the old set (Altid Hjem, Altid Forsikring og Altid Mobil), which
// left Energi out.
describe('confirmHeading', () => {
  it('names the group scope the way the consent sentence does', () => {
    expect(confirmHeading({ mad: false, group: true })).toBe('Vil du høre nyt fra Altid Hjem og resten af familien?')
    expect(consentSentences('mad').group).toContain('Altid Hjem og resten af familien')
  })

  it('leaves the other two headings unchanged', () => {
    expect(confirmHeading({ mad: true, group: true })).toBe('Vil du høre nyt fra Altid?')
    expect(confirmHeading({ mad: true, group: false })).toBe('Vil du høre nyt om Altid Mad?')
  })
})

// The newsletter sends this mail to people the form may know nothing about, and to
// rows with no first name.
describe('the mail for an address already on file', () => {
  it('does not talk about a list or a launch', () => {
    for (const pending of [{ mad: true, group: true }, { mad: false, group: true }, { mad: true, group: false }]) {
      expect(confirmIntro(pending)).toMatch(/^Du har netop bedt om/)
    }
  })

  it('greets without a name when there is none', () => {
    const vars = { confirmUrl: 'https://altidhjem.dk/c', unsubscribeUrl: 'https://altidhjem.dk/u', pending: { mad: true, group: true } }
    expect(renderConsentConfirmEmail({ ...vars, firstName: '' })).toContain('>Hej</p>')
    expect(renderConsentConfirmEmail({ ...vars, firstName: 'Ida' })).toContain('>Hej Ida</p>')
  })
})
