import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://altidhjem.dk'
  return [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/spiir-alternativ`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/hvornar-er-strommen-billigst`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/hvad-koster-forsikring`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/billigste-mobilabonnement`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/hvad-koster-en-ladeboks`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/hvad-koster-en-tyverialarm`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/hvad-koster-indboforsikring`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/billigste-elselskab`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/opsig-abonnementer`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/gennemsnitligt-elforbrug`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/bedste-budget-app`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/skift-forsikringsselskab`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/kontakt`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/privatlivspolitik`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/slet-konto`, changeFrequency: 'monthly', priority: 0.5 },
  ]
}
