import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.altidhjem.dk'
  return [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/spiir-alternativ`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/hvornar-er-strommen-billigst`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/hvad-koster-forsikring`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/billigste-mobilabonnement`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/hvad-koster-en-husforsikring`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/hvad-koster-en-bilforsikring`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/fastpris-eller-variabel-el`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/hvad-koster-bredbaand`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/hvad-koster-en-ladeboks`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/hvad-koster-en-tyverialarm`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/hvad-koster-indboforsikring`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/billigste-elselskab`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/opsig-abonnementer`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/gennemsnitligt-elforbrug`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/bedste-budget-app`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/skift-forsikringsselskab`, changeFrequency: 'monthly', priority: 0.6 },
    // Altid Mad's guides, moved from altidmad.dk on 16 Nov 2026 with the same paths and priorities.
    { url: `${base}/madbudget`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/billigste-supermarked`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/madbudget-familie-paa-4`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/mad-for-3000-om-maaneden`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/madplan-efter-tilbud`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/madpakker-paa-budget`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/spar-penge-paa-dagligvarer`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/graensehandel-beregner`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/jul-paa-budget`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/presse`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/kontakt`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/privatlivspolitik`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/slet-konto`, changeFrequency: 'monthly', priority: 0.5 },
  ]
}
