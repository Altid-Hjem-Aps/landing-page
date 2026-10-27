import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import InvitationPage, { metadata } from '@/app/invitation/page'
import { GET as getAppSiteAssociation } from '@/app/.well-known/apple-app-site-association/route'

describe('partner invitation page', () => {
  it('tells the invited partner what to do and links both stores', () => {
    render(<InvitationPage />)

    expect(screen.getByRole('heading', { name: 'Du er inviteret' })).toBeInTheDocument()
    expect(
      screen.getByText(
        'Din partner har inviteret dig til jeres fælles hjem i Altid Hjem. Hent appen, og tryk på linket i beskeden igen, så bliver I forbundet.',
      ),
    ).toBeInTheDocument()
    const appStore = screen.getByRole('link', { name: 'Hent i App Store' })
    expect(appStore).toHaveAttribute('href', 'https://apps.apple.com/dk/app/altid-hjem/id6794330094')
    expect(within(appStore).getByRole('img', { name: 'Hent i App Store' })).toHaveAttribute(
      'src',
      '/store-badges/app-store-da.svg',
    )
    const googlePlay = screen.getByRole('link', { name: 'Hent den på Google Play' })
    expect(googlePlay).toHaveAttribute(
      'href',
      'https://play.google.com/store/apps/details?id=dk.altidhjem.app',
    )
    expect(within(googlePlay).getByRole('img', { name: 'Hent den på Google Play' })).toHaveAttribute(
      'src',
      '/store-badges/google-play-da.png',
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
