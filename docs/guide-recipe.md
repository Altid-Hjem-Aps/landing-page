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
- **Not already a page.** The live guides are `GUIDE_PATHS` in `lib/site-counts.ts`, also served
  as https://www.altidhjem.dk/guides.json (path and title). A closer variant of a live page makes
  that page better (a new H2 or FAQ answer), not a new page.
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
address, `openGraph.type: 'article'`, `openGraph.images: [SITE_IMAGE]` and
`twitter: { card: 'summary_large_image', images: [SITE_IMAGE] }` from `lib/site-image.ts` (a page's
`openGraph` replaces the layout's whole, so without `images` a shared link has no picture; test/site-image.test.ts checks it).

## 4. Building it, step by step

1. `app/<slug>/page.tsx`: export `metadata` and render `<Guide>` from
   `'@/components/site/Guide'` (the tests find guides by that import). A tool (calculator,
   chart) is an existing named component; an agent may use one, never invent one. Existing:
   `LadeboksCalculator`, `GraensehandelCalculator`, `ElprisChart`, `ElforbrugBenchmark`,
   `MadbudgetBenchmark`, `BudgetAppSammenligning`.
2. `lib/site-counts.ts`: add `'/<slug>'` to `GUIDE_PATHS`, in alphabetical order. This gives the
   page its counts, its campaign (`ah_1_guide_` plus the slug with `_` for `-`, e.g.
   `ah_1_guide_billigste_elselskab`), its line in `/guides.json` (`app/guides.json/route.ts`) and
   its row in the admin's guide table (admin repo). Add its title (the H1) and its `published`
   and `updated` dates to `GUIDES` in `lib/guides.ts`, and pass `title={GUIDES['/<slug>'].title}`
   and `published: GUIDES['/<slug>'].published, updated: GUIDES['/<slug>'].updated` in `page` to
   `<Guide>`, so the page and `/guides.json` show the same title and dates
   (`test/guide-checks.test.tsx` checks it). A page file may not export them itself: Next.js
   allows only its own exports in a page.
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
   questions today. Only a guide pull request led by a person may change that to the recipe's 5 to
   7, and names the change in the pull request; an SEO-kørsel (section 11) leaves it at 7.
8. A Mad guide uses the `MAD_REPORT_*` constants from `components/mad/madGuide.ts` and links its
   report figures to `/madrapport`. Its call to action is `MAD_GUIDE_CTA`, which says "Altid Mad":
   Mad's copy moved from altidmad.dk word for word and Thor and Alex own it, so it is the one
   exception to the brand rule in section 5.

## 5. Writing rules

- **Danish, written by ChatGPT (codex), one run per page with the full brief; then a separate
  codex language pass** on all copy, short labels included: invented words, anglicisms, wrong
  trade terms, words split wrong, du or I kept the same through the page. Afterwards diff every
  number and name against the brief. Team words stay English only in team text, never on the page.
- **When codex is not available** (an SEO-kørsel, section 11: Homebase never uses codex), the
  language pass is a second read by the writing agent itself, as its own step after the copy is
  written, of all copy, short labels included, against this checklist. Fix what it finds, then
  diff every number and name against the brief as above:
  1. Anglicisms: an English word, or an English phrase put word for word into Danish, where Danish
     has a plain word ("deal", "feature", "booste").
  2. Invented words: a product or trade term the Danish market does not use. Use the word the
     sources use on their own pages ("nettarif", not "transporttarif").
  3. Compound words: one word in Danish ("husforsikring", "elregning"), never split in two.
  4. du or I: one form through the page. I (I, jer, jeres) for the household, du only where the
     title says du.
  5. Commas: as on the live guides, a comma before and after a subordinate clause ("Vælg en
     selvrisiko, I kan betale uden at låne") and between two main clauses joined by og, men or
     for.
  A person reads the Danish on the pull request before it is merged (section 7, step 6).
  `test/danish-wording.test.tsx` catches the words on its list and a du and I mix in CI; a list
  cannot know every word, so the read stays.
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
enforce it; "Agent" means the agent checks it and writes the result in the pull request.

`test/guide-checks.test.tsx` renders every guide in `GUIDE_PATHS` (the live price chart with a
fixed day of prices) and runs the sources, visuals and markedsføringsloven checks below in CI, for
old and new guides alike (ALT-1519, 16 Nov 2026). What it reads:

- Sources: the article's paragraphs and lists sentence by sentence; the short answer, answer card,
  factors, questions, table cells and headings; the page title and description. Not the drawn
  examples, the tools, the store buttons or the end panel.
- Markedsføringsloven: every text a visitor sees, the drawn examples, captions and end panel
  included, plus the title and description.
- Its word lists are lists: a claim worded in a way they don't know can still pass, so the agent's
  own read in section 5 stays.
- Date, length and headings, for every guide except the 25 on the site on 16 Nov 2026 (the
  frozen `OLD_GUIDES` list in the test, exempt for good, also after a later rewrite or a change of
  their dates): published on or after 17 Nov 2026 (the `datePublished` in the page's Article
  data); 900 to 1,300 words in the article; at least 4 of 5 of the article's h2 headings end in
  "?". The article is every part of `.gd-body` except Kilder, the questions, asides and figures,
  whatever its tag. Its words are its headings, paragraphs, lists, tables and checklist steps, not
  the questions, Kilder, figures (captions, drawn examples, the app card) or the step numbers.
- The title and dates on the page (H1, Article `datePublished` and `dateModified`) equal the
  guide's line in `/guides.json`.

`test/danish-wording.test.tsx` reads every guide's visible text for the words on its list
(anglicisms, terms found invented or wrong, team words) and the guide's own text for du and I kept
the same: a guide whose title says du never says I, jer or jeres; a guide added after 16 Nov 2026
whose title does not say du never says du, dig, din, dit or dine. Sentences kept on purpose are in
its `KEPT` list with the reason; today that is the Mad copy whose du and I mix the test found on
16 Nov 2026, for Thor and Alex to rewrite, and the name "Dit Europa".

A sentence that breaks a rule but is kept on purpose goes in the test's `ALLOWED` list with who
decided and when. Only that sentence is excused, and an entry that no longer matches its page fails.
Today it holds the Mad copy Thor kept as it is on 16 Nov 2026 ("Danmarks første gebyrfrie
energiselskab", "til de bedste priser", the forum figure and the question it answers) and the
grænsehandel calculator's break-even line. A page's own figures (the 3.000 kr. page's question and
its sums) go in `OWN_FIGURES`.

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
| Every outside link in the text is in Kilder. Every price, percentage, kWh or GB figure has its source linked (an outside link or the Altid Mad report, not another guide) or named (a publisher in Kilder) in its own paragraph or the one before; in the answer card, questions, tables, headings and metadata it may instead repeat a figure the article sources. Worked examples are our own sums with their assumptions listed | Test (test/guide-checks.test.tsx) |
| Every visual is labelled: a real app screen (an image from `public/site/app`) starts "I appen:"; a chart of real figures (`GuideFigure kind="data"`) starts "Tal fra" and a source in Kilder; anything drawn starts "Eksempel:" and says "Illustration, ikke et skærmbillede fra appen." | Test (test/guide-checks.test.tsx) |
| A savings figure (kroner or percent) only from the Altid Mad report, cited in Kilder; no superlative about Altid Hjem, Altid Mad, Altid Energi or the app; no promised app feature | Test (test/guide-checks.test.tsx) for the words it knows; Agent for other wordings and for superlatives about other companies (only as a named source's claim) |
| Codex language pass run, or without codex the second read against the checklist in section 5; numbers and names unchanged after it | Agent, then a person's read on the pull request |
| No word from the Danish word list; du or I kept the same through the page | Test (test/danish-wording.test.tsx) for the words it knows; Agent for the rest |
| Title is a search question of 60 characters or less; short answer starts with the number | Agent |
| Body is 900 to 1,300 words, at least 4 of 5 headings are questions; published on or after 17 Nov 2026 | Test (test/guide-checks.test.tsx) for every guide not in its frozen `OLD_GUIDES` list |
| Exactly 3 Læs også guides, each with a card, not the page itself (test/guide-parts.test.tsx); 2 or 3 guides link back | Test, Agent for the links back |
| `page`, `sources` and `related` are passed; Article, BreadcrumbList and FAQPage data parse | Agent; the data's shape and the date and link rules are Test (test/guide-parts.test.tsx) |
| `npm test` and `npm run build` pass (CI runs both) | Test |
| `tsc` and `eslint` on the changed files have no errors (CI does not run them) | Agent |
| Phone (390 wide) and computer (1440 wide): no horizontal scroll, no console errors | Agent |

## 7. Process and measuring

1. Pick a topic from the approved list (section 9). An SEO-kørsel picks its own (section 11).
2. Research: the top 5 Google results for the question, the official sources (Danmarks Statistik,
   Forsyningstilsynet, Energistyrelsen, Skat, Tænk, Forbrugerrådet), and what the app does today.
3. Write the brief, run codex for the copy, then the codex language pass.
4. Build the page (section 4), run every check (section 6).
5. `/review` and `/qa`, then a draft pull request with the check results. One commit.
6. Thor approves the page on a phone and a computer. Nothing is merged without Thor's word.
7. **Measure every 4 weeks, per page** (admin, Vækst, Hjemmesiden, Guiderne; Search Console for
   www.altidhjem.dk). The SEO-kørsel (section 11) replaces these manual steps: every run reads
   the figures below from the admin and acts on them by the same rules, so nobody has to measure
   by hand. They stay here as the rules the run follows:
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

Built 16 Nov 2026: every guide's visuals are labelled (the live price chart, the food and
electricity benchmarks as "Tal fra", the rest as "I appen" or "Eksempel"), and
`test/guide-checks.test.tsx` checks sources, labels and markedsføringsloven on every guide in CI
(section 6).

Built 16 Nov 2026 for ALT-1715 (Homebase writing pages): the date, length and question-heading
checks for every guide after the first 25 (`test/guide-checks.test.tsx`), the Danish word list
(`test/danish-wording.test.tsx`), `/guides.json` for the admin and Homebase, and section 11.

Still to build:

- The restyle of the animated examples from ALT-1712 (the labels are done).

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

## 11. SEO-kørsel (Homebase)

Homebase writes guides on its own. A scheduled job files one Linear issue per run, "SEO-kørsel
<dato>", and delegates it to Alti. Alti's plan stage researches and picks the topics; its build
stage writes **the budget the issue names (today 1 new guide and 2 fixes) in one pull request** in
this repo; CI runs the checks; a person merges (section 7, step 6). This section is what both stages follow. Alti never
uses codex, so the language pass is the second read in section 5.

### What the run issue contains

- The live guides, from https://www.altidhjem.dk/guides.json (path, title, published and updated
  date of each).
- The admin's figures for the period it names (`GET /api/seo/feed` in the admin repo): per guide
  visits, store taps, QR opens and scans, and Search Console views (impressions), clicks and
  position; the to-do list (kind `fewClicks`, `noTaps`, `page2` or `notInGoogle`, with the guide
  and, where it has one, the query, position and views); the top Search Console queries per
  guide; and the queries on the site's other pages, which no guide answers. A figure is empty
  (null) when Search Console is not connected, never 0: read empty as "not known".
- The budget: how many new guides and fixes the run may make (today 1 new guide and 2 fixes).
- Only criteria that can be checked, and the rule: choose by this recipe, never ask a person.

### Picking the topics (plan stage)

Ideas, research and the choice are all the run's own: no person takes part until the pull
request (Thor, 16 Nov 2026). Every candidate must pass section 2 (a pain point people search for,
close to a service, planning intent, not batterioglader.dk's ground, not already a page; a closer
variant of a live page is a fix, not a new page).

The run finds its own candidates before it ranks them (Thor, 17 Nov 2026: section 9 is one source,
never the only one):

1. **Search Console:** every query in the run issue's figures (guide queries and the other pages'
   queries).
2. **Competitors' questions:** for each service with guides (Energi, Forsikring and Økonomi; never
   Mad, whose copy Thor and Alex own), up to 4 seed searches: the title questions of its live
   guides and of its section 9 topics, chosen by season (section 2), then by closeness to the
   service. Research the top 5 results of each seed (below) and
   list every question they answer as a heading or a FAQ question. A question at least 3 of those
   5 results answer, which no live guide answers by the word rule below (applied against every
   live guide's title, H2s and FAQ questions), is a candidate of kind 2.
3. **Section 9 topics**, approved or waiting.

The plan report lists every candidate found, its source and its evidence kind, and why it ranked
where it did, so a person can see the run looked beyond section 9.

A new guide needs evidence of search demand. In an SEO-kørsel that is one of these, and it is the
evidence section 2 asks for:

1. **A Search Console query with views** (best). Within it: queries with views on no guide (the
   other pages' queries), and page-2 queries that are a new question by the rule below. More
   views ranks higher.
2. **The question, or a close variant, answered as a heading or a FAQ question by at least 3 of
   the top 5 results** the run read (the research below), which none of our guides answers.
3. **A topic in section 9**, approved or waiting: the waiting topics count too (Thor, 16 Nov
   2026); their wait was for this run's evidence, not for a person.

Rank the candidates in that order: any candidate with evidence of kind 1 before any of kind 2,
and so on; ties go by season (section 2), then closeness to the service. The new guide is the
highest ranked candidate that needs its own page. Write its evidence (queries, figures, the
results read) in the plan report on the Linear issue, and only its kind in the pull request. With
no candidate that has evidence, there is no new guide this run: do the fixes, and say why in the
pull request.

A page-2 query (a guide's query on positions 11 to 20) is a **new guide** only when both hold,
and otherwise a **fix** of the guide it ranks for. To compare, write both as words: lower case,
no punctuation, no year, and without the words en, et, i, på, for, til, af, om, man, jeg, vi, du,
der, det, den, de, er, har, kan, skal:

- the query's set of words is not the set of words of that guide's title, any of its H2s or any
  of its FAQ questions; and
- the query has at least one word that is not among the words of that guide's title.

For a page-2 query, this rule settles section 2's "closer variant" question. Examples on
`/hvad-koster-en-husforsikring`: "hvad koster husforsikring" has only the title's words (hvad,
koster, husforsikring), so it is a fix; "hvad dækker en husforsikring" has the words of an H2,
so it is a fix of that section; "husforsikring med stråtag" is no title, H2 or question and has
words the title lacks (med, stråtag), so it is a candidate for a new guide.

The fixes are the to-do list's items, up to the budget, one per guide. Sort each kind by its key:
`page2` and `fewClicks` by Search Console views (the query's views for `page2`, the guide's for
`fewClicks`), `noTaps` by Google clicks, highest first. Take the top item of each kind in the order
`page2`, `fewClicks`, `noTaps`, then the second of each, until the budget is used. Never picked:

- a guide whose `updated` date in `lib/guides.ts` is less than 4 weeks before the run, so the last
  change has time to show. Every guide's date is 16 Nov 2026 today, so no fix is possible before
  14 Dec 2026;
- a Mad guide (section 4, step 8: a page that uses `MAD_GUIDE_CTA`, today `/billigste-supermarked`,
  `/graensehandel-beregner`, `/jul-paa-budget`, `/mad-for-3000-om-maaneden`, `/madbudget`,
  `/madbudget-familie-paa-4`, `/madpakker-paa-budget`, `/madplan-efter-tilbud` and
  `/spar-penge-paa-dagligvarer`): Thor and Alex own that copy.

A fix follows its to-do kind:

| Kind | Fix |
|---|---|
| `fewClicks` (views, few clicks) | Rewrite the title (in `lib/guides.ts` and the page's `metadata`) and the short answer (which is also the meta description), aimed at the queries the guide is seen for |
| `noTaps` (visits, no store taps) | Rewrite the page: the answer first and complete, then "Hvordan kan Altid Hjem hjælpe?" and the end panel tied to the page's pain point |
| `page2` (a query on positions 11 to 20) | Add a section with the query's question as its H2, or a question to the FAQ, that answers the query |
| `notInGoogle` | Not a writing fix; not picked |

Linking a new guide from 2 or 3 live guides (section 4, step 5: the new page in their `related`)
is part of the new guide, not a fix: it does not use the fix budget, and it changes nothing else on
those pages.

A fix keeps every rule of sections 3 to 6 and the page's address. It sets the guide's `updated`
date in `lib/guides.ts` to the run's date. It changes "Senest tjekket" (`sources.checked`) only
when the run read the sources again. A guide that is one of the 25 from before 17 Nov 2026 stays
exempt from the date, length and question-heading checks after a run rewrites it (section 6);
write it by part 8 anyway.

### Researching the top results (plan stage)

For each seed search and each candidate question (the new guide's and each `page2` fix's query):

1. Search the question in Danish with WebSearch. Take the top 5 results that are articles (not
   ads, videos, shops' product lists or Google's own pages).
2. Read each with WebFetch and record: the address, its headings, the questions it answers, every
   number with the source it gives, its tools (calculator, chart, table), its length in words, and
   its published and updated dates.
3. Keep only what at least 3 of the 5 share (a question they all answer, a table, a worked
   example, a calculator). Those elements go into the brief; what only one or two have stays out.
   What is batterioglader.dk's ground stays out (section 2).

Never fetch google.com result pages, "people also ask" or related searches: WebSearch gives the
list, and the research reads only the results' own pages. Never copy their text: learn the
structure (which questions, in which order, which tools), write our own words, and take every
number from its original source, read and linked in Kilder, never from the competitor's page.

All research and evidence (candidates, figures, the research table per question, what was chosen
and rejected and why, the brief) stays in the plan stage's report on the Linear issue. It is never
committed: this repo is public.

### Writing and building (build stage)

- Write each new guide and each fix by sections 3 to 5, with the second language read (section 5),
  and build a new guide by section 4. Every check in section 6 passes before the pull request.
- Never ask a person. Where the rules leave a choice, decide by them and say why in the pull
  request.
- An SEO-kørsel changes no file under `test/` and not `components/site/Guide.tsx`, with these
  exceptions only, and only for a new guide (section 4):
  - `test/seo.test.ts`: the new address in its sitemap list (step 3);
  - `test/tjenester-pages.test.tsx` or `test/mad-guides.test.tsx`: the new page's import and its
    line in `PAGES` (step 7), nothing else in the file;
  - `test/fixtures/guide-qr-links.json`: as `scripts/site-assets.py guide-qr` writes it (step 6).
  So never `test/guide-checks.test.tsx` (its `ALLOWED`, `OWN_FIGURES` and `OLD_GUIDES` lists
  included) or `test/danish-wording.test.tsx` (its `KEPT` list included). A failing check means
  the page is wrong: fix the page. `test/tjenester-pages.test.tsx` expects exactly 7 questions, and
  a run leaves that at 7, so a run's guide has 7.
- The pull request body links the run's Linear issue, which holds the figures, and lists each new
  guide and each fix in one line with the kind of its evidence only: "Search Console query",
  "competitors" (at least 3 of the top 5 results) or "section 9 topic", and for a fix its to-do
  kind. For example: "New: /hvorfor-er-elregningen-hoej (evidence: Search Console query)" and
  "Fix (page2): /hvad-koster-bredbaand, new section (evidence: Search Console query)". It never
  names a search query, a competitor's address or a figure (views, clicks, position): this repo is
  public and they are competitive information. Where the rules left a choice, say why in the same
  terms. Then the check results.
