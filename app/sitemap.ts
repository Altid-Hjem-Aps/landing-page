import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://altidhjem.dk'
  return [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/spiir-alternativ`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/hvad-koster-forsikring`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/kontakt`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/privatlivspolitik`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/slet-konto`, changeFrequency: 'monthly', priority: 0.5 },
  ]
}
