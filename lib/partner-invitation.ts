export const PARTNER_INVITATION = {
  title: 'Du er inviteret til Altid Hjem',
  description: 'Din partner har inviteret dig til jeres fælles hjem i Altid Hjem.',
  heading: 'Du er inviteret',
  intro: 'Din partner har inviteret dig til jeres fælles hjem i Altid Hjem.',
  privacy: 'Dine egne konti og din egen opsparing ser din partner aldrig.',
  // What to do next, per device. Only Android carries the invite through the
  // store (the Play install referrer); an iPhone, and Android without the
  // token, opens it by tapping the link again once the app is there.
  next: {
    tapAgain: 'Hent appen, og tryk på linket i invitationen igen. Så bliver I forbundet.',
    androidCarried: 'Hent appen, så bliver I forbundet.',
    desktopScan: 'Scan koden med kameraet på din telefon. Så åbner invitationen der.',
    desktopNoLink: 'Åbn linket i invitationen på din telefon.',
  },
  qrAlt: 'QR-kode, der åbner invitationen på din telefon',
} as const
