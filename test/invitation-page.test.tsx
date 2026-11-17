import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import InvitationPage, { metadata } from '@/app/invitation/page'
import { rememberInviteToken } from '@/lib/invite-token'
import { qrPath } from '@/lib/qr-path'
import { GET as getAppSiteAssociation } from '@/app/.well-known/apple-app-site-association/route'

const TOKEN = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQ'
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)'
const ANDROID = 'Mozilla/5.0 (Linux; Android 15; Pixel 9)'
const MAC = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)'

function onDevice(userAgent: string) {
  vi.stubGlobal('navigator', { ...navigator, userAgent, maxTouchPoints: 0 })
}

afterEach(() => {
  vi.unstubAllGlobals()
  rememberInviteToken('')
})

describe('partner invitation page', () => {
  it('says outright that the partner never sees your own accounts', () => {
    onDevice(IPHONE)
    render(<InvitationPage />)

    expect(screen.getByRole('heading', { name: 'Du er inviteret' })).toBeInTheDocument()
    expect(screen.getByText('Dine egne konti og din egen opsparing ser din partner aldrig.')).toBeInTheDocument()
  })

  it('on an iPhone links only the App Store and asks to tap the link again', () => {
    onDevice(IPHONE)
    rememberInviteToken(`#${TOKEN}`)
    render(<InvitationPage />)

    expect(screen.getByText(/Hent appen, og tryk på linket i invitationen igen\./)).toBeInTheDocument()
    const appStore = screen.getByRole('link', { name: 'Hent i App Store' })
    expect(appStore).toHaveAttribute('href', 'https://apps.apple.com/dk/app/altid-hjem/id6794330094')
    expect(within(appStore).getByRole('img', { name: 'Hent i App Store' })).toHaveAttribute(
      'src',
      '/store-badges/app-store-da.svg',
    )
    expect(screen.queryByRole('link', { name: 'Hent den på Google Play' })).toBeNull()
  })

  it('on Android carries the invite through Google Play to the app', () => {
    onDevice(ANDROID)
    rememberInviteToken(`#${TOKEN}`)
    render(<InvitationPage />)

    expect(screen.getByText(/Hent appen, så bliver I forbundet\./)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Hent den på Google Play' })).toHaveAttribute(
      'href',
      `https://play.google.com/store/apps/details?id=dk.altidhjem.app&referrer=invite_token%3D${TOKEN}`,
    )
    expect(screen.queryByRole('link', { name: 'Hent i App Store' })).toBeNull()
  })

  it('on Android passes nothing but a link token on to Google Play', () => {
    onDevice(ANDROID)
    rememberInviteToken(`#${TOKEN}&utm_source=x`)
    render(<InvitationPage />)

    expect(screen.getByRole('link', { name: 'Hent den på Google Play' })).toHaveAttribute(
      'href',
      'https://play.google.com/store/apps/details?id=dk.altidhjem.app',
    )
    expect(screen.getByText(/tryk på linket i invitationen igen/)).toBeInTheDocument()
  })

  it('on a computer shows the invite link as a QR code for the phone, not the stores', () => {
    onDevice(MAC)
    rememberInviteToken(`#${TOKEN}`)
    render(<InvitationPage />)

    expect(screen.getByText(/Scan koden med kameraet på din telefon\./)).toBeInTheDocument()
    const qr = screen.getByRole('img', { name: 'QR-kode, der åbner invitationen på din telefon' })
    expect(qr.querySelector('path')).toHaveAttribute(
      'd',
      qrPath(`https://altidhjem.dk/invitation#${TOKEN}`).d,
    )
    expect(screen.queryByRole('link', { name: 'Hent i App Store' })).toBeNull()
  })

  it('on a computer without the link asks to open it on the phone and links both stores', () => {
    onDevice(MAC)
    render(<InvitationPage />)

    expect(screen.getByText(/Åbn linket i invitationen på din telefon\./)).toBeInTheDocument()
    expect(screen.queryByRole('img', { name: 'QR-kode, der åbner invitationen på din telefon' })).toBeNull()
    expect(screen.getByRole('link', { name: 'Hent i App Store' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Hent den på Google Play' })).toHaveAttribute(
      'href',
      'https://play.google.com/store/apps/details?id=dk.altidhjem.app',
    )
  })

  it('shares as an invitation, not as the waitlist', () => {
    expect(metadata.title).toBe('Du er inviteret til Altid Hjem')
    expect(metadata.openGraph?.title).toBe('Du er inviteret til Altid Hjem')
  })
})

describe('apple-app-site-association', () => {
  it('opens both the waitlist and the invitation page in the app', async () => {
    const body = await getAppSiteAssociation().json()

    expect(body.applinks.details[0].components).toEqual(
      expect.arrayContaining([{ '/': '/inviter' }, { '/': '/invitation' }]),
    )
  })

  it('lets iOS AutoFill use altidhjem.dk logins in the app', async () => {
    const body = await getAppSiteAssociation().json()

    expect(body.webcredentials.apps).toEqual(['4W5RBP3T94.dk.altidhjem.app'])
  })
})
