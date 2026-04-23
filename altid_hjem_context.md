# Altid Hjem: Business Context for Claude Code

> This file provides full business context for an AI coding agent working on projects related to Altid Hjem. Read this before writing any code, making architectural decisions, or asking clarifying questions. Treat this as the source of truth for the business.

---

## Who Owns This

**Werner Valeur** is the founder and sole ultimate owner. He is a well-known Danish serial entrepreneur (founded Billy, Paperflow/Bilagscan, Salary, Wolfpack among others) with 20+ years of experience. His holding structure is:

```
WHSV ApS (master holding, Werner 100%)
  └── Altid Holding ApS
        ├── Altid Energi ApS (live, ~15,000 customers)
        ├── Altid Hjem ApS (early stage, no revenue yet)
        └── [future: AltidForsikring, AltidLadning, AltidMobil, etc.]
```

Werner controls all voting rights via A-class shares across the group.

**Alex Thorup** (the person you are coding for) is the incoming CEO of Altid Hjem ApS. He has a finance and startup background (former co-founder/COO/CFO of Memora ApS, which reached DKK 50M+ valuation before exit). He is a strong vibe-coder, comfortable with Claude Code, Cursor, Supabase, Vercel, Stripe, and modern TypeScript/React/Python stacks. Do not over-explain basic concepts to him.

---

## What Altid Hjem Is

Altid Hjem is Werner's vision for a **Danish household super-brand**: a single app and brand that bundles all major recurring household costs and services under one roof. The bet is that once a Danish family is a customer of one Altid product, they become a distribution channel for all others.

The brand logic is: _simple, fair, no hidden fees_ - the same positioning that made Altid Energi successful. Every sub-product should feel like the electricity product: transparent pricing, flat subscription, no bullshit.

### Confirmed Sub-Brands (planned or in-flight)

| Brand | Category | Status |
|---|---|---|
| Altid Energi | Electricity | Live, ~15k customers, top-rated by Forbrugerrådet |
| AltidForsikring | Insurance | Planned |
| AltidLadning | EV charging | Planned |
| AltidMobil | Mobile subscription | Planned |
| AltidIntelligens | AI household assistant | Concept stage (Alex's initiative) |

### The Core Commercial Logic

The cross-sell flywheel is the whole game. A customer paying for electricity is a warm lead for insurance, charging, and mobile. The app is the distribution layer that ties them together. Every product added to the portfolio increases LTV and reduces churn on all other products.

---

## AltidIntelligens: The AI Layer (Alex's Core Project)

This is the product Alex is most likely to be building in Claude Code sessions. It is a **proactive AI household assistant** that lives inside the AltidHjem app. The key distinction: it is simple to _use_, not simple to _build_.

### What It Does (feature scope)

**Household Economy**
- Tracks all fixed household costs: rent, aconto (utilities advance), insurance, leasing, subscriptions
- Tracks children's spending and allowances
- Real-time holiday budget tracking
- Alerts when home insurance does not cover a new purchase (cross-sell trigger)
- Notifies when the family can save money by switching insurance, mobile plan, or energy provider (natural referral to Altid products)

**Home & Maintenance**
- Books tradespeople (plumber, electrician, etc.) on demand
- Reminds about service intervals: heat pump, car, appliances
- Stores receipts and warranties with expiry alerts
- Reusable checklists (school start, holiday packing, etc.)

**Energy & Charging**
- Pushes alerts when electricity spot price is low
- Optimizes EV charging times automatically (integrates with AltidEnergi and AltidLadning)

**Shopping & Food**
- Generates weekly meal plan every Sunday
- Places grocery orders via Nemlig.com including recurring household supplies

**Family & Calendar**
- Reminders for birthdays, appointments, family calendar
- Wish list sharing between family members
- Per-member user profiles with role-based access levels (adults and children)

### Technical Constraints to Keep in Mind

This product requires real integrations: bank/PSD2 access, calendar APIs, insurance data, MitID/NemID, Nemlig.com API, and a trades marketplace or booking layer. Do not assume these integrations exist. Flag when a feature depends on an external integration that needs to be scoped or mocked.

---

## Tech Stack Preferences

Alex works in a modern full-stack setup. Default to these unless he specifies otherwise:

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Backend:** Supabase (Postgres + Auth + Realtime + Storage)
- **Hosting/Deploy:** Vercel
- **Payments:** Stripe
- **AI/LLM:** Anthropic Claude API (claude-sonnet-4-20250514 as default model)
- **Email:** Resend
- **Automation/Jobs:** GitHub Actions or Supabase Edge Functions
- **Project management:** Linear

Do not suggest Make, n8n, or similar no-code automation tools. Alex already knows these and has moved past them.

---

## Brand Identity

The Altid brand is built on: **simple, fair, no hidden fees, customer-first**. This should translate directly into product and UX decisions. When in doubt, the less complex the interface, the better.

No specific design tokens are established for Altid Hjem yet beyond the parent brand direction. When building UI, lean into clean Scandinavian minimalism. Avoid enterprise/SaaS aesthetics.

---

## Current Business Status (as of April 2026)

- Altid Hjem ApS: registered, no revenue, no product live
- Altid Energi: the operational proof of concept for the whole group
- Alex has just taken on the CEO role (no salary, year one)
- The business is in pre-product, pre-revenue phase
- Core task right now: define the MVP product and build it

---

## What the Coding Agent Should Know About Alex's Working Style

- He moves fast. Do not over-scaffold or over-abstract before there is something working.
- He prefers working code over perfect architecture in the early stages.
- He will iterate. Build for change, not for completeness.
- He uses Claude Code as a primary development environment alongside Cursor.
- He is security-aware and has done security audits on prior projects (Polymarket trading bot). Flag obvious security issues but do not block progress for theoretical ones.
- He is comfortable reading and debugging code himself. You do not need to over-comment.

---

## Questions to Ask When Scoping a New Feature

If Alex asks you to build something without full context, ask:

1. Is this a feature inside the AltidHjem app, or a standalone tool?
2. Does it require a live third-party integration, or can we mock the data source for now?
3. Is this for internal use (Alex/team) or customer-facing?
4. Does this need to plug into Supabase auth / existing user sessions?

Do not assume answers to these. They affect architecture significantly.
