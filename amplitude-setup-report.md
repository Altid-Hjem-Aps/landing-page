<wizard-report>
# Amplitude post-wizard report

The wizard has completed a full Amplitude integration for Altid Hjem — a Next.js 16 App Router project. Both the browser SDK (`@amplitude/unified`) and server SDK (`@amplitude/analytics-node`) are installed and initialized.

## Integration summary

| Item | Detail |
|---|---|
| Browser SDK | `@amplitude/unified` v1.1.0 — initialized in `instrumentation-client.ts` |
| Server SDK | `@amplitude/analytics-node` v1.5.57 — initialized in `lib/amplitude.server.ts` |
| Data region | EU (`https://api.eu.amplitude.com/2/httpapi`) |
| Session Replay | Enabled — `sessionReplay: { sampleRate: 1 }` |
| Guides & Surveys | Enabled — `engagement: {}` |
| Autocapture | Full suite: page views, sessions, form interactions, element clicks, file downloads, frustration interactions, web vitals, network tracking |

## Files changed

| File | Change |
|---|---|
| `instrumentation-client.ts` | New — browser SDK init with `initAll()` |
| `lib/amplitude.server.ts` | New — server SDK helpers (`trackServer`, `identifyServer`, `flushAmplitude`) |
| `app/api/waitlist/route.ts` | Added `trackServer('Waitlist Signup Confirmed', ...)` + `identifyServer(userId, ...)` |
| `components/WaitlistForm.tsx` | Added 4 browser `amplitude.track()` calls |
| `components/Nav.tsx` | Added `amplitude.track('Waitlist CTA Clicked', { source: 'nav' })` |
| `components/sections/FounderVideo.tsx` | Added `amplitude.track('Founder Video Played')` |
| `.env.local` | `NEXT_PUBLIC_AMPLITUDE_API_KEY` set |

## Events instrumented

| Event | Description | File |
|---|---|---|
| `Waitlist CTA Clicked` | Hero or nav CTA clicked; `source: 'hero'` or `'nav'` | `components/WaitlistForm.tsx`, `components/Nav.tsx` |
| `Waitlist Step 1 Submitted` | Name/email/phone form submitted successfully | `components/WaitlistForm.tsx` |
| `Waitlist Step 1 Failed` | Step 1 submission failed; includes `error` and `status` props | `components/WaitlistForm.tsx` |
| `Waitlist Signup Confirmed` | Server-side — API confirmed the signup; includes `signup_id` | `app/api/waitlist/route.ts` |
| `Waitlist Step 2 Submitted` | Optional survey submitted; includes `has_age`, `has_household`, `has_why`, `electricity_provider` | `components/WaitlistForm.tsx` |
| `Waitlist Step 2 Skipped` | User clicked "Ikke nu" on the survey | `components/WaitlistForm.tsx` |
| `Founder Video Played` | User clicked play on the founder video | `components/sections/FounderVideo.tsx` |

User identity: when step 1 is confirmed server-side, `identifyServer(userId, { waitlist_signup: true })` is called so the API-assigned user ID links all subsequent events to the same Amplitude profile.

## Analytics dashboard

Dashboard: [Altid Hjem Analytics — 2026](https://app.eu.amplitude.com/analytics/altidhjem-692429/dashboard/e-1et4f6pk)

The dashboard includes:
- **Daily Active Users** chart — populates as soon as any event reaches Amplitude
- **Rich text funnel guides** — step-by-step instructions to build the Waitlist Signup Funnel, Post-Signup Survey Funnel, and Founder Video engagement charts once data starts flowing

**Autocapture charts** (populate immediately, no code changes needed):
- Page Views via `[Amplitude] Page Viewed` — available the moment the first user visits
- Form interactions, element clicks, session start/end — all captured automatically

**Custom event charts** (populate once users trigger those flows):
- Waitlist Signup Funnel: CTA Clicked → Step 1 Submitted → Signup Confirmed
- Survey Funnel: Signup Confirmed → Step 2 Submitted (or Skipped)
- Founder Video Plays over time

To add funnel charts directly in Amplitude: open the dashboard, click "Add Chart", select "Funnel", and add the event names exactly as listed in the table above.

## Next steps

### Environment variable for production

`NEXT_PUBLIC_AMPLITUDE_API_KEY` is set in `.env.local` (gitignored). Before deploying to production, add it to Vercel:

1. Go to [Vercel Dashboard](https://vercel.com) → your project → **Settings** → **Environment Variables**
2. Add `NEXT_PUBLIC_AMPLITUDE_API_KEY` with the value from `.env.local`
3. Set environment scope to **Production** (and optionally Preview)
4. Redeploy — Next.js will pick it up automatically

The same key is used for both browser and server SDKs (the `NEXT_PUBLIC_` prefix makes it available in both runtimes).

### Verifying data flows

After deploying, visit the site and open [Amplitude's Live event viewer](https://app.eu.amplitude.com/analytics/altidhjem-692429) to confirm events arrive in real time. Autocapture events (`[Amplitude] Page Viewed`, etc.) should appear within seconds of the first page load.

### Agent skill

The `.claude/skills/` folder contains the wizard's skill files. These are cleaned up automatically after the run — no action needed.

</wizard-report>
