import { init } from '@amplitude/analytics-browser'

init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY!, {
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
