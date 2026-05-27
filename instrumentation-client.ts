import { init } from '@amplitude/analytics-browser'

const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY

if (apiKey) {
  init(apiKey, {
    serverUrl: 'https://api.eu.amplitude.com/2/httpapi',
    fetchRemoteConfig: false,
    autocapture: {
      attribution: true,
      pageViews: true,
      sessions: true,
      formInteractions: true,
      fileDownloads: true,
      elementInteractions: true,
      frustrationInteractions: true,
      pageUrlEnrichment: true,
      networkTracking: true,
      webVitals: true,
    },
  })
}
