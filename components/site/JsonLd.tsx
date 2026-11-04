// What search engines read about the company and the app. No rating: we have
// none to show.

const SITE = 'https://www.altidhjem.dk'

// The same profiles as the footer.
const SOCIAL_PROFILES = [
  'https://www.linkedin.com/company/altid-hjem/',
  'https://www.instagram.com/altidhjem/',
  'https://www.facebook.com/profile.php?id=61590767814024',
]

/** A < in the data must not be able to close the script tag. */
export function jsonLdHtml(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, '\\u003c') }
}

export default function JsonLd() {
  const data = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Altid Hjem',
      legalName: 'Altid Hjem ApS',
      url: SITE,
      sameAs: SOCIAL_PROFILES,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'MobileApplication',
      name: 'Altid Hjem',
      url: SITE,
      operatingSystem: 'iOS, Android',
      applicationCategory: 'LifestyleApplication',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'DKK' },
    },
  ]
  return <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(data)} />
}
