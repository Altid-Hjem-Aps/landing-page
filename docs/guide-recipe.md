# The guide page recipe (ALT-1714)

How to choose, write, build and check one guide page on www.altidhjem.dk, so an agent can make a
new one without asking Thor how. One page per search question. Every guide answers a pain point
people search for, then shows how Altid Hjem helps with it, and ends at the app.

This file is the one source. It replaces the old start prompt ("Block 0" in Thor's
`seo-prompts/altid-hjem-seo-prompts.md`) and the page order that lived in `SEO-PLAN-*.md`,
`HANDOFF-seo-*.md` and `drafts/ALT-1519-google-seo-setup.html` in Thor's work folder. Where those
files disagree with this one, this one wins.

Status words used below: **Built** (in the code today), **To build** (the recipe needs it, the
code lacks it; see section 8), **Decision** (Thor decides, open).

## 1. The method

1. **Start from a pain point people search for, per service.** Energi, Forsikring, Mad and
   Økonomi each have bills people want to cut or understand. The page title is the question in
   their words ("Hvad koster en indboforsikring?"), not ours ("faste udgifter" and "overblik"
   are words nobody searches).
2. **Answer it honestly and fully first.** The number, its source, what it depends on, a worked
   example. The page has to be the best answer on Google even for someone who never downloads.
3. **Then show how Altid Hjem helps with exactly that pain point**, with what the app does today.
   No promised features, no savings claims except the sourced Mad figure (section 5).
4. **Start close to the service, then move up the funnel.** Y Combinator's SEO advice (Eli
   Schwartz, SurveyMonkey, on the YC blog, 2018): first the topic closest to what you sell, then
   the problem behind it, then how to choose and buy. For us: "billigste elselskab" before
   "hvorfor er min elregning så høj".
5. **Battle-test, do not guess.** Publish, then read per page which ones get seen and which ones
   bring app downloads (section 7). Impressions without clicks means the title or answer is
   wrong; clicks without store taps means the page is wrong. Fix the page or drop the topic.
6. **Expect months, not weeks.** Organic search on a new domain can take about a year (same
   source). SEO is the channel that keeps working after paid and press stop, so it runs always,
   with checks instead of a person reading every page (marketing plan, SEO row).

## 2. Choosing a topic

A topic goes on the list only when all of these hold:

- **A pain point people search for.** Evidence is written next to it, with its kind and date:
  Search Console queries for www.altidhjem.dk (best, from about 2 weeks after 16 Nov 2026),
  Google Keyword Planner volume, or Google Trends for Denmark (relative only, never written as a
  volume). No evidence: the topic waits.
- **Close to one of the four services**, so the page can honestly end in "this is what the app
  does about it". Name the service.
- **Planning intent beats curiosity.** A search with a household size, a time span or "skift",
  "opsig", "billigste" is a good lead; a single brand name or one dish is a trap (Mad plan).
- **Not batterioglader.dk's ground.** Werner's shop owns batteries, solar, heat pumps and the
  price of 1 kWh. We take the household bill angle and link to him where it helps the reader.
- **Not already a page.** The 21 live guides are `GUIDE_PATHS` in `lib/site-counts.ts`. A
  closer variant of a live page makes that page better (a new H2 or FAQ answer), not a new page.
- **Season decides the order** among topics that pass (jul, elpris in winter, forsikring at
  renewal time).

## 3. The page, top to bottom

Order and contents are taken from batterioglader.dk's guides (5 articles read on 16 Nov 2026,
one template across all) and the old Altid Hjem guides, in the new site's look
(`components/site/Guide.tsx`, design B, approved by Thor 15 Nov 2026).

| # | Part | What it holds | Where in the code |
|---|---|---|---|
| 1 | Address | `/<the search phrase>`, shortened to its core words: lower case, Danish letters as ae/oe/aa, **29 characters or less** (the campaign is `ah_1_guide_` plus the slug and must fit Apple's 40 characters; `test/store-links.test.ts` fails otherwise). Add the year for price questions (`-2026`) only when the year is part of the search. | `app/<slug>/page.tsx` |
| 2 | Breadcrumb | Forside › page title (there is no guide hub page yet; add "Guider" in the middle once one exists) | `page` (Built) |
| 3 | Title (H1) | The search question, word for word. 60 characters or less. | `title` (Built) |
| 3b | Meta line | One small line under the short answer, e.g. "Opdateret november 2026 · Kilde: Tænk". Until the dates and Kilder parts are built, this is where they go. | `meta` (Built, required) |
| 4 | Short answer | 2 to 3 sentences: the number first, with its source named in the sentence. The same text is the meta description (cut to 155 characters). | `lead` (Built) |
| 5 | Answer card | The key number with its unit and one line of context; a range bar for price ranges. | `answer` (Built) |
| 6 | Dates | "Udgivet" and "Opdateret" dates. No named author (Thor, 16 Nov 2026): the guides are Altid Hjem's. | `page.published`, `page.updated` (Built) |
| 7 | What it depends on | 3 to 5 factors as short cards. | `factors` (Built) |
| 8 | Body | 6 to 9 sections, 60 to 200 words each, about 900 to 1,300 words in all. At least 4 of 5 headings are questions people ask. One table or figure where a comparison helps. | children: `<section>` with `<h2>`, `GuideFigure`, `.gd-table` (Built) |
| 9 | Worked example | One "Regneeksempel" with its assumptions as a list, and the line that it is an example, not the reader's bill. | children (Built) |
| 10 | How Altid Hjem helps | One section, heading "Hvordan kan Altid Hjem hjælpe?", that ties the pain point to what the app does today, in the words the live guides already use. It ends with the app card (`<GuideApp tone src alt caption />`): the landing page's proof (stars and "+N danskere har allerede appen", read live like the front page) over its store buttons, beside a real app screen in the landing page's phone frame captioned "I appen: ...". The buttons are pills with a QR code each on a computer and one button to the visitor's own store on a phone, counted under position `help` with the guide's own campaign. A guide without an app screen uses `<GuideStores />` alone, with an illustration in a `GuideFigure` captioned "Eksempel: ... Illustration, ikke et skærmbillede fra appen." | `GuideApp`, `GuideStores`, `GuideFigure` (Built) |
| 11 | Kilder | "Senest tjekket <dato>", then every source: publisher, title, link, the dataset and its date, "Egne beregninger på baggrund af data fra ..." where we computed. | `sources` (Built) |
| 12 | Questions | 5 to 7 questions people ask, 1 to 3 sentences each. The first restates the title question. The visible text is the FAQ data, word for word. | `faq` (Built) |
| 13 | Læs også | After the questions, before the download panel: 3 related guides as the front page's blog cards, same service first. Their title and text come from `POSTS`, so a guide needs a card before it can be picked. | `related` (Built) |
| 14 | Call to action | The dark store panel: one button to the visitor's own store on a phone, QR pills on a computer, carrying the guide's own campaign. Its eyebrow, heading and one line are the page's own, about this page's pain point. | `cta` (Built, required; links and campaign from ALT-1713) |

Nothing else asks for the download inside the article. The nav button, the offer pop-up at half
way and the footer QR are site-wide and stay.

**Data for Google** (JSON-LD): FAQPage (Built); Article with headline, description, author and
publisher both the organisation Altid Hjem ApS (no person), datePublished, dateModified and
citation (the Kilder list); and BreadcrumbList. All three are Built: Article and BreadcrumbList come
from `page` (and `sources` for the citations).

**Metadata** (Built pattern; copy the `metadata` block of `app/hvad-koster-forsikring/page.tsx`, not
the rest of that page, which predates this recipe: its description is 187 characters and it has 8
questions): `title` ending
` | Altid Hjem`, `description`, `alternates.canonical` and `openGraph.url` as the absolute www
address, `openGraph.type: 'article'`.

## 4. Building it, step by step

1. `app/<slug>/page.tsx`: export `metadata` and render `<Guide>` from
   `'@/components/site/Guide'` (the tests find guides by that import). A tool (calculator,
   chart) is an existing named component; an agent may use one, never invent one. Existing:
   `LadeboksCalculator`, `GraensehandelCalculator`, `ElprisChart`, `ElforbrugBenchmark`,
   `MadbudgetBenchmark`, `BudgetAppSammenligning`.
2. `lib/site-counts.ts`: add `'/<slug>'` to `GUIDE_PATHS`, in alphabetical order. This gives the
   page its counts, its campaign (`ah_1_guide_` plus the slug with `_` for `-`, e.g.
   `ah_1_guide_billigste_elselskab`) and its row in the admin's guide table (admin repo).
3. `app/sitemap.ts`: add the address; update the list in `test/seo.test.ts` to match.
4. `components/sections/blogPosts.ts`: add a card to `POSTS` so the page is linked from the site
   (no page without a link to it). Use one of the existing categories (Mad, Forsikring, Energi,
   Overblik, Mobil, Opladning, Alarm). Keep `test/blog-order.test.ts` green: the first cards are one
   of every category, and no two cards of the same category sit side by side. A new category must
   also go into that opening run.
5. Add the new page to the `related` of 2 or 3 related guides, so it gets links back.
6. `python scripts/site-assets.py guide-qr` (in a venv with `qrcode`, `numpy`, `pillow` and
   `scipy`; the script imports all four): makes the guide's four QR codes and
   `test/fixtures/guide-qr-links.json`.
7. Add the page to the smoke tests: `PAGES` in `test/tjenester-pages.test.tsx` (Energi,
   Forsikring, Økonomi guides) or in `test/mad-guides.test.tsx` (Mad guides). Only listed pages get
   the FAQ, canonical and "én regning" tests. `test/tjenester-pages.test.tsx` expects exactly 7
   questions today; change that to the recipe's 5 to 7 when the first new guide lands, and name the
   change in the pull request.
8. A Mad guide uses the `MAD_REPORT_*` constants from `components/mad/madGuide.ts` and links its
   report figures to `/madrapport`. Its call to action is `MAD_GUIDE_CTA`, which says "Altid Mad":
   Mad's copy moved from altidmad.dk word for word and Thor and Alex own it, so it is the one
   exception to the brand rule in section 5.

## 5. Writing rules

- **Danish, written by ChatGPT (codex), one run per page with the full brief; then a separate
  codex language pass** on all copy, short labels included: invented words, anglicisms, wrong
  trade terms, words split wrong, du or I kept the same through the page. Afterwards diff every
  number and name against the brief. Team words stay English only in team text, never on the page.
- **Brand names:** Mad, Energi, Forsikring, Økonomi in customer copy. "Altid Hjem" always full.
  "Altid Energi" when it means the company.
- **No em dash or en dash** anywhere (a test fails on them).
- **Never** "én regning" or "one bill"; say "ét overblik, ét login".
- **No waitlist words, no "kommer snart"** about something in the app (a test fails on them).
- **Every price, statistic and market claim links its source on the page**, and the source is in
  Kilder. Prices as ranges, with what they depend on. A number without a source is not written;
  in a table it is "Ikke oplyst".
- **Savings:** the only savings figure is Mad's 11.207 kr. from the report, word for word, linked
  to `/madrapport`. No savings figure for Energi, Forsikring or the household as a whole. No
  running counters or "saved in total".
- **Markedsføringsloven:** nothing misleading (§5 and §6). A superlative ("billigste",
  "første") only as a named outside source's claim, with the source on file. Counts kept current
  ("mere end 15.000" Altid Energi customers).
- **Visuals:** every visual is labelled "I appen" (a real screen) or "Eksempel" (an
  illustration). An example never shows a feature the app does not have. Kroner in an example
  only beside the line that it is an example. No real company names in examples ("Selskab A").
- **No partner names** in copy unless Thor says so.
- **Sans serif only.**
- **Tone:** say it like a knowledgeable friend: short sentences, the number first, no filler. The
  page is non-salesy until the "How Altid Hjem helps" section.

## 6. The checks

Each check passes or fails. A failed check stops the page. "Test" means the repo's tests already
enforce it; "Agent" means the agent checks it and writes the result in the pull request (ALT-1715
turns these into tests).

| Check | How |
|---|---|
| The page is in `GUIDE_PATHS` (test/site-counts-pages.test.ts) and has its four QR codes (test/guide-qr.test.ts) | Test |
| The page is in the sitemap; every sitemap page has a Blog card (test/footer.test.tsx) | Agent for the sitemap, Test for the card |
| The slug is 29 characters or less, so the campaign fits 40 (test/store-links.test.ts) | Test |
| Canonical and og:url are the absolute www address; title ends in ` \| Altid Hjem` | Test once listed in a smoke test (step 7); title suffix only in test/mad-guides.test.tsx |
| FAQ data equals the visible questions, `<` escaped, 5 to 7 questions | Test once listed (step 7); the count rule differs per test file today |
| No em or en dash; no waitlist or "kommer snart" words | Test, every page (test/no-waitlist-wording.test.ts) |
| No "én regning" | Test once listed in test/tjenester-pages.test.tsx; Agent for the rest |
| Store links carry `ah_1_guide_` plus the slug; counts carry the slug | Test, from `GUIDE_PATHS` |
| Internal links point to pages that exist | Test (Mad guides), Agent (others) |
| Every number in the text has a source link and is in Kilder | Agent |
| Every visual is labelled "I appen" or "Eksempel" | Agent |
| No savings claim except the Mad figure; no superlative without a named source | Agent |
| Codex language pass run; numbers and names unchanged after it | Agent |
| Title is a search question of 60 characters or less; short answer starts with the number | Agent |
| Body is 900 to 1,300 words, at least 4 of 5 headings are questions | Agent |
| Exactly 3 Læs også guides, each with a card, not the page itself (test/guide-parts.test.tsx); 2 or 3 guides link back | Test, Agent for the links back |
| `page`, `sources` and `related` are passed; Article, BreadcrumbList and FAQPage data parse | Agent; the data's shape and the date and link rules are Test (test/guide-parts.test.tsx) |
| `npm test` and `npm run build` pass (CI runs both) | Test |
| `tsc` and `eslint` on the changed files have no errors (CI does not run them) | Agent |
| Phone (390 wide) and computer (1440 wide): no horizontal scroll, no console errors | Agent |

## 7. Process and measuring

1. Pick a topic from the approved list (section 9).
2. Research: the top 5 Google results for the question, the official sources (Danmarks Statistik,
   Forsyningstilsynet, Energistyrelsen, Skat, Tænk, Forbrugerrådet), and what the app does today.
3. Write the brief, run codex for the copy, then the codex language pass.
4. Build the page (section 4), run every check (section 6).
5. `/review` and `/qa`, then a draft pull request with the check results. One commit.
6. Thor approves the page on a phone and a computer. Nothing is merged without Thor's word.
7. **Measure every 4 weeks, per page** (admin, Vækst, Hjemmesiden, Guiderne; Search Console for
   www.altidhjem.dk):
   - Search Console views and clicks: views without clicks, rewrite the title and short answer.
   - Visits, store taps and QR scans per guide: visits without taps, rewrite the page.
   - Queries on page 2 of Google (positions 11 to 20) are the next H2s and FAQ answers, or new
     topics (prompt #2 in Thor's `seo-prompts` file).
   - Update the numbers and "Opdateret" on every page at least every quarter, and when a source
     publishes new figures.

## 8. The recipe's parts in the component, and what is still to build

Built (16 Nov 2026, `components/site/Guide.tsx`, tests in `test/guide-parts.test.tsx`). Optional in
the code, so the 21 guides from before still render, but **every new guide passes all three**:

- `page: { path, description, published, updated }`: the breadcrumb, the dates under the short
  answer, and the Article and BreadcrumbList data. Dates as YYYY-MM-DD; a date that does not exist,
  or "updated" before "published", throws at build.
- `sources: { checked, items: [{ publisher, title, href, note? }] }`: the Kilder block before the
  questions, and the Article's citations. Every `href` a full address; needs `page`.
- `related: ['/a', '/b', '/c']`: exactly 3 guides, shown as their blog cards (`POSTS` in
  `components/sections/blogPosts.ts`) after the questions, before the download panel. Each needs a
  card; the page itself and repeats throw.

Still to build before ALT-1715 (Homebase writing pages) can start:

- The visual labels from ALT-1712.
- Tests that turn the "Agent" checks in section 6 into code where they can be (word count,
  question headings, sources present, labels present).

## 9. Topics

Approved by Thor on 16 Nov 2026, build in this order (slug in brackets):

1. Hvad koster en husforsikring? (Forsikring, `/hvad-koster-en-husforsikring`)
2. Hvad koster en bilforsikring? (Forsikring, `/hvad-koster-en-bilforsikring`)
3. Fastpris eller variabel elaftale? (Energi, `/fastpris-eller-variabel-el`)
4. Hvad koster bredbånd om måneden? (Økonomi, `/hvad-koster-bredbaand`)

Topics 1 and 2 are one FAQ answer each on `/hvad-koster-forsikring` today. They get pages of their
own because each is a search of its own with a full answer to give, as `/hvad-koster-indboforsikring`
already is; the general page then links to them (the "closer variant" rule in section 2 is for a
question one page already answers in full).

Waiting for Search Console numbers (about 2 weeks after 16 Nov 2026): Hvilke forsikringer har en
familie brug for?, Hvorfor er min elregning så høj?, Hvad er elafgiften i 2026? (check the 2026
rate first: it may have been cut to almost nothing, which changes the angle), and Hvad bruger en
familie om måneden?. /opsig-abonnementer is improved rather than repeated. "Hvad koster 1 kWh strøm?" is
batterioglader.dk's. The full list with its evidence: `drafts/ALT-1714-guide-topics.html` in Thor's
work folder. No topic has a measured search volume yet; the evidence is Google Trends (relative).

## 10. What we took from batterioglader.dk, and what we did not

| Lesson | Taken? |
|---|---|
| Title is the search question; answer with the number first | Yes (parts 3 and 4) |
| The answer three times: short answer, answer card, first FAQ answer | Yes |
| Question headings, 6 to 9 sections, about 1,000 to 1,300 words | Yes, 900 to 1,300 words (part 8) |
| Worked example with assumptions and "not your bill" | Yes (part 9) |
| Kilder with a checked date and own calculations named, mirrored in Article citation | Yes, built ("Senest tjekket", "Egne beregninger på baggrund af data fra") |
| Named author with role, published and updated dates | Dates yes, built; we show "Opdateret" too, which they hide. No named author (Thor, 16 Nov 2026): Altid Hjem is the author |
| Article, BreadcrumbList, FAQPage data | Yes, built |
| Læs også and many internal links | Yes: 3 related guides as cards (more clicks than a plain list, same SEO value), plus links back and links in the text |
| Year in the address and title for price questions | Yes, only when people search with the year |
| A glossary page with anchors | Not now: few shared terms across our four services; revisit with 40+ guides |
| Table of contents | Not now: our pages are shorter and the sections are visible blocks |
| AI-generated hero image | No: we show real app screens or labelled examples |
| Mid-article call to action box | No: one store panel at the end; the site-wide pop-up already asks half way |
| Two "Læs også" lists (inline and a card grid) | No: one card row |
| Batteries, solar, heat pumps, kWh price | No: Werner's ground |
