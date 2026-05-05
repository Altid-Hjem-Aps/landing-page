import * as amplitude from '@amplitude/unified'

amplitude.initAll(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY!, {
  analytics: {
    serverUrl: 'https://api.eu.amplitude.com/2/httpapi',
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
  },
  sessionReplay: { sampleRate: 1 },
})
