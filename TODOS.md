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
