import { describe, expect, it } from 'vitest'
import { DEFAULT_VIA, SHARE_TEXT, sanitizeVia, shareChannelLinks, shareUrl } from '@/lib/share-page'

// /del (ALT-605). Risks: an unsanitised ?via= lands in utm_campaign and in
// Amplitude; a mis-encoded message sends people to a broken compose screen;
// Android Messages ignores the iOS `sms:?&body=` form.
describe('sanitizeVia', () => {
  it.each([
    ['hjem-welcome', 'hjem-welcome'],
    ['app2', 'app2'],
    ['a'.repeat(32), 'a'.repeat(32)],
    [undefined, DEFAULT_VIA],
    ['', DEFAULT_VIA],
    ['a'.repeat(33), DEFAULT_VIA],
    ['Hjem', DEFAULT_VIA],
    ['hjem welcome', DEFAULT_VIA],
    ['x&utm_source=evil', DEFAULT_VIA],
    [['hjem-welcome'], DEFAULT_VIA],
  ])('%j -> %s', (raw, expected) => {
    expect(sanitizeVia(raw)).toBe(expected)
  })
})

describe('shareChannelLinks', () => {
  const url = 'https://www.altidhjem.dk/?utm_source=invite&utm_medium=share&utm_campaign=hjem-welcome'

  it('puts the via into utm_campaign of the shared url', () => {
    expect(shareUrl('hjem-welcome')).toBe(url)
  })

  it('carries the share text plus the url, fully encoded, on every channel', () => {
    const links = shareChannelLinks('hjem-welcome')
    const message = `${SHARE_TEXT} ${url}`
    expect(decodeURIComponent(links.whatsapp.replace('https://wa.me/?text=', ''))).toBe(message)
    expect(decodeURIComponent(links.sms.replace('sms:?&body=', ''))).toBe(message)
    const mail = new URL(links.mail)
    expect(mail.searchParams.get('subject')).toBe('Prøv Altid Hjem')
    expect(mail.searchParams.get('body')).toBe(message)
    expect(links.mail.startsWith('mailto:?subject=Pr%C3%B8v%20Altid%20Hjem&body=')).toBe(true)
    // The url's own & and = must not split the outer link.
    expect(links.whatsapp).not.toContain('&utm_medium')
  })

  it('uses sms:?&body= by default and sms:?body= on Android', () => {
    expect(shareChannelLinks('del').sms.startsWith('sms:?&body=')).toBe(true)
    expect(shareChannelLinks('del', { android: true }).sms.startsWith('sms:?body=')).toBe(true)
  })
})
