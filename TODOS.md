# TODOS

## P2 — Launch-email queue position is a snapshot, not live
- **What:** `queue_position` written to the Resend contact is a point-in-time
  snapshot at signup. Supabase's `queue_position()` is the live truth and drifts
  as people climb the queue.
- **Why:** If the launch blast renders "du er #469" from the Resend tag, it will
  be wrong for anyone who moved since signup — undercutting trust at the worst
  possible moment.
- **Fix:** Recompute position at send time (or omit the number from the launch
  email).
- **Context:** Introduced in #26 (referral welcome Phase 2). See
  `lib/resend.ts` (`addAudienceContact`, snapshot) and `lib/db.ts`
  (`getQueuePosition`, live truth).
- **Priority:** P2 — resolve before the launch blast, not before merge.

## P1 — Keyboard focus invisible through the waitlist form (a11y, design-review 2026-06-10)
- **What:** `outline-none` / `outline: 'none'` on every waitlist field with no
  replacement focus indicator (`components/WaitlistForm.tsx:136,218,248-251,307,322,340,398`,
  `components/AddressAutocomplete.tsx:80`).
- **Why:** Keyboard users can't see where they are in the primary conversion flow.
  WCAG 2.4.7 failure on the page's one job.
- **Fix:** Add a visible `focus-visible` style (e.g. green ring on forest) wherever
  the default outline is suppressed.

## P2 — Lawyer-check retention wording on /slet-konto + /privatlivspolitik
- **What:** Both pages say bookkeeping records are kept "op til 5 år efter
  kundeforholdets/aftalens ophør". Bogføringsloven counts 5 years from the END
  OF THE FISCAL YEAR of the transaction — in practice up to ~6 years.
- **Why:** If records are ever held longer than the published promise, the
  stated policy is breached. Flagged by cross-model review 2026-06-10; left
  as-is deliberately (pages are mutually consistent; legal copy needs counsel).
- **Fix:** Have a lawyer confirm or reword to "5 år efter udgangen af det
  regnskabsår, materialet vedrører".
- **Also (operational):** /slet-konto now promises confirm-before-delete
  ("sletningen gennemføres først, når du har bekræftet"). The support runbook
  for hej@altidhjem.dk must actually enforce that confirmation round-trip —
  deleting on the first inbound email would make the published policy false
  AND enable spoofed-email deletions.

## P3 — Pre-existing lint errors block adding lint to CI (2026-06-10 /review)
- `npm run lint` fails with 6 errors (setState-in-effect in two components,
  `<a href="/">` in Nav.tsx:62 should be `<Link>`, a require() import in a
  script). Fix these, then add `npm run lint` to .github/workflows/test.yml.

## P3 — Design-review deferred findings (2026-06-10, /slet-konto audit)
- Tokenize white-alpha text tiers (~12 ad-hoc `rgba(255,255,255,X)` values across
  dark pages) so contrast fixes stop regenerating per page.
- `components/sections/Trust.tsx:11` — `py-28 sm:py-24` inverted responsive
  padding, likely typo (siblings use `py-16 sm:py-24`).
- Subpages (/slet-konto, /kontakt, /privatlivspolitik) have no footer — no path
  between legal pages except via home.
- Legal address blocks differ across the 3 pages (only /slet-konto carries CVR +
  c/o Mad House HQ); consider one shared component.
- No global `prefers-reduced-motion` fallback in `app/globals.css` (only Why.tsx
  checks it).
- Legal-page body text is 14px (`text-sm`); 16px is the usual floor — site-wide
  pattern call, contrast passes.
