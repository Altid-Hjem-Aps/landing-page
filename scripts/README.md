# Scripts

One-off operational scripts. The TypeScript ones run with `npx tsx`.

## Python mail scripts (moved from ThorFraAltid/altid-dashboard, Sep 2026)

`send-mad-rollout.py` and `send-referral-launch.py` send the Altid Mad rollout mail and the referral launch mail. Standard library only, Python 3.9+.

- Keys: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY` from `.env` / `.env.local` next to the script.
- Idempotency state (who already got the mail) lives in `~/Library/Application Support/altid-dashboard` on the machine that ran the send. Copy that folder before re-running from another machine; the scripts also check Resend for prior sends as a second guard.
- Run `python3 <script> --help` for the flags (test send, schedule, split rollout).
