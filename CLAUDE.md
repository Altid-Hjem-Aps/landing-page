@AGENTS.md

# Altid Hjem — Claude Code Context

Full business context lives in `altid_hjem_context.md`. Read it before making architectural decisions.

## Current Task

Build the **Altid Hjem landing page**.
- Pre-launch: waitlist signup CTA
- Post-launch: switch CTA to "download app"

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Backend/DB:** Supabase (Postgres + Auth + Storage)
- **Deploy:** Vercel
- **Email:** Resend
- **Payments:** Stripe (not needed for landing page)
- **AI:** Anthropic Claude API (claude-sonnet-4-6 default)

## Brand

Simple, fair, no hidden fees. Clean Scandinavian minimalism — not SaaS, not enterprise. When in doubt, go simpler.

## Design Assets

`Design Assets/` in project root:
- `LOGO/` — SVG and PNG versions of the Altid Hjem logo
- `Diverse logoer og ikoner/` — sub-brand icons (energi, forsikring, mobil, opladning, alarm, mad)
- `Altid hjem_INSPIRATION.svg` — visual inspiration
- `OVERBLIK.pdf` — brand overview

## Project Conventions

- App Router only — no Pages Router
- No `src/` directory
- Tailwind for all styling — no CSS modules unless unavoidable
- TypeScript strict mode
- Supabase client initialized once in `lib/supabase.ts`
- Environment variables in `.env.local`, never committed
