import { describe, expect, it } from 'vitest'
import { DEFAULT_VIA, SHARE_TEXT, SHARE_URL, sanitizeVia, shareChannelLinks } from '@/lib/share-page'

// /del (ALT-605). Risks: an unsanitised ?via= reaches Amplitude; a
// mis-encoded message sends people to a broken compose screen; Android
// Messages ignores the iOS `sms:?&body=` form.
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
  it('shares the short /app link, without UTM, on every channel, fully encoded', () => {
    expect(SHARE_URL).toBe('https://www.altidhjem.dk/app')
    const links = shareChannelLinks()
    const message = `${SHARE_TEXT} https://www.altidhjem.dk/app`
    expect(decodeURIComponent(links.whatsapp.replace('https://wa.me/?text=', ''))).toBe(message)
    expect(decodeURIComponent(links.sms.replace('sms:?&body=', ''))).toBe(message)
    const mail = new URL(links.mail)
    expect(mail.searchParams.get('subject')).toBe('Prøv Altid Hjem')
    expect(mail.searchParams.get('body')).toBe(message)
    expect(links.mail.startsWith('mailto:?subject=Pr%C3%B8v%20Altid%20Hjem&body=')).toBe(true)
  })

  it('uses sms:?&body= by default and sms:?body= on Android', () => {
    expect(shareChannelLinks().sms.startsWith('sms:?&body=')).toBe(true)
    expect(shareChannelLinks({ android: true }).sms.startsWith('sms:?body=')).toBe(true)
  })
})
