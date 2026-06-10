@AGENTS.md

# Altid Hjem — Claude Code Context

Full business context lives in `altid_hjem_context.md`. Read it before making architectural decisions.

## Current Task

Build the **Altid Hjem landing page**.
- Pre-launch: waitlist signup CTA
- Post-launch: switch CTA to "download app"

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Backend:** External API at `api.altidhjem.dk` (waitlist + signup endpoints). This landing page does not own its own database.
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
- Backend calls go through `lib/api.ts` (proxy to `api.altidhjem.dk`)
- Environment variables in `.env.local`, never committed

## Testing

- Run: `npm test` (vitest, tests in `test/`). See `TESTING.md` for conventions.
- 100% test coverage is the goal — tests make vibe coding safe.
- When writing new functions, write a corresponding test.
- When fixing a bug, write a regression test.
- When adding error handling, write a test that triggers the error.
- When adding a conditional (if/else, switch), write tests for BOTH paths.
- Never commit code that makes existing tests fail.

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
- Author a backlog-ready spec/issue → invoke /spec
