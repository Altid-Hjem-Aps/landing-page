import { APP_STORE_URL, PLAY_STORE_URL } from '@/lib/store-links'
import { FAQ, META } from './copy'
import { SOCIAL } from './social'

const SITE = 'https://www.altidhjem.dk'

// One graph. The FAQ answers come from the same data the page shows, no rating and no
// offers, so expect no rich result: this only describes the page honestly.
export function jsonLdGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE}/#organization`,
        name: 'Altid Hjem ApS',
        alternateName: 'Altid Hjem',
        url: SITE,
        logo: `${SITE}/icon.svg`,
        vatID: 'DK45637476',
        sameAs: SOCIAL.map((s) => s.href),
      },
      {
        '@type': 'MobileApplication',
        '@id': `${SITE}/#app`,
        name: 'Altid Hjem',
        description: META.description,
        operatingSystem: 'iOS, Android',
        applicationCategory: 'FinanceApplication',
        inLanguage: 'da',
        installUrl: [APP_STORE_URL, PLAY_STORE_URL],
        publisher: { '@id': `${SITE}/#organization` },
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE}/#faq`,
        mainEntity: FAQ.items.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  }
}

/** Safe inside a script tag: no `<` reaches the HTML parser. */
export function serializeForScript(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

export function jsonLdScript(): string {
  return serializeForScript(jsonLdGraph())
}
