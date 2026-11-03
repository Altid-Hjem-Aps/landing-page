import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import InvitationPage, { metadata } from '@/app/invitation/page'
import { rememberInviteToken } from '@/lib/invite-token'
import { GET as getAppSiteAssociation } from '@/app/.well-known/apple-app-site-association/route'

const TOKEN = 'A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8S9t0U_-'
const IPHONE =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
const ANDROID =
  'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36'
const MAC = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15'

const APP_STORE = 'Hent i App Store'
const GOOGLE_PLAY = 'Hent den på Google Play'

function openOn(userAgent: string, maxTouchPoints = 0) {
  vi.stubGlobal('navigator', { userAgent, maxTouchPoints })
  render(<InvitationPage />)
}

afterEach(() => {
  vi.unstubAllGlobals()
  rememberInviteToken('')
})

describe('partner invitation page', () => {
  it('sends an iPhone to the App Store only and tells the partner to sign up with their number', () => {
    openOn(IPHONE, 5)

    expect(screen.getByRole('heading', { name: 'Du er inviteret' })).toBeInTheDocument()
    expect(
      screen.getByText(/Hent appen, og opret dig med dit mobilnummer\. Så finder vi jer\./),
    ).toBeInTheDocument()
    const appStore = screen.getByRole('link', { name: APP_STORE })
    expect(appStore).toHaveAttribute('href', 'https://apps.apple.com/dk/app/altid-hjem/id6794330094')
    expect(within(appStore).getByRole('img', { name: APP_STORE })).toHaveAttribute(
      'src',
      '/store-badges/app-store-da.svg',
    )
    expect(screen.queryByRole('link', { name: GOOGLE_PLAY })).toBeNull()
  })

  it('treats an iPad that reports as a Mac like an iPhone', () => {
    openOn(MAC, 5)

    expect(screen.getByRole('link', { name: APP_STORE })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: GOOGLE_PLAY })).toBeNull()
  })

  it('sends Android to Google Play only, with the invite in the install referrer', () => {
    rememberInviteToken(`#${TOKEN}`)
    openOn(ANDROID, 5)

    expect(screen.getByText(/Hent appen, så bliver I forbundet\./)).toBeInTheDocument()
    const googlePlay = screen.getByRole('link', { name: GOOGLE_PLAY })
    expect(googlePlay).toHaveAttribute(
      'href',
      `https://play.google.com/store/apps/details?id=dk.altidhjem.app&referrer=invite_token%3D${TOKEN}`,
    )
    expect(within(googlePlay).getByRole('img', { name: GOOGLE_PLAY })).toHaveAttribute(
      'src',
      '/store-badges/google-play-da.png',
    )
    expect(screen.queryByRole('link', { name: APP_STORE })).toBeNull()
  })

  it('links plain Google Play when the link carried no valid token', () => {
    rememberInviteToken('#not-a-token')
    openOn(ANDROID, 5)

    expect(screen.getByRole('link', { name: GOOGLE_PLAY })).toHaveAttribute(
      'href',
      'https://play.google.com/store/apps/details?id=dk.altidhjem.app',
    )
  })

  it('asks a desktop visitor to open the link on the phone and shows both stores without the invite', () => {
    rememberInviteToken(`#${TOKEN}`)
    openOn(MAC)

    expect(screen.getByText(/Åbn linket på din telefon for at hente appen\./)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: APP_STORE })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: GOOGLE_PLAY })).toHaveAttribute(
      'href',
      'https://play.google.com/store/apps/details?id=dk.altidhjem.app',
    )
    expect(document.body).not.toHaveTextContent('tryk på linket')
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
