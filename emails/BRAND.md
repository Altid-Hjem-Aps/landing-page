# Email brand guidelines

How we write emails at Altid Hjem. Read this before editing anything in `emails/`.

## Ownership

**Werner Valeur owns brand and communications.** When his judgment conflicts with anyone else's (including this doc), Werner wins. This doc captures his principles so the next person doesn't have to relearn them — but it doesn't replace him.

---

## Five principles

### 1. Never frame the recipient as having lost something

Words like *desværre* and any "you were not selected" structure make recipients feel rejected. Flip it: explain why the situation is a benefit *to them*.

- ❌ "Du er desværre ikke med i denne omgang."
- ✅ "For at sikre den bedste oplevelse fra start åbner vi appen i mindre grupper."

### 2. Point outward, not inward

Self-centered framing ("we were surprised", "we thought", "we hoped") makes us the subject. Point at the shared frustration or movement that Altid Hjem solves.

- ❌ "Større interesse end vi turde håbe på."
- ✅ Something that points at the customer pain ("trætte af gebyrer"-energy) or the collective need.

### 3. Keep it short

Especially the first emails. Three to four sentences in the body is plenty.

### 4. Restate Altid Hjem's core in every email

Don't assume recipients remember between emails. Each email should somehow answer:

- **What** are we? *Altid Hjem samler dine boligudgifter ét sted — strøm, forsikring, internet…*
- **Why** are we relevant to you? *…så du får overblikket, vi alle har manglet.*
- **Why** do you get value?

One sentence can cover all three. Don't write a paragraph.

### 5. Communicate expectation softly

If you can give a real window, give it. If you can't, don't invent one. *"Inden længe"* / *"så snart det er din tur"* > a fake date.

---

## How the email pipeline works

1. **Source:** React templates in `emails/*.tsx`
2. **Build:** `npm run sync-templates` renders the React to HTML and uploads to Resend, using each template's `alias` as the stable ID
3. **Send:** App code in `lib/send-email.ts` tells Resend *which alias* to use plus per-recipient variables (`first_name`)
4. **Render:** Resend swaps `{{{first_name}}}` at send time

This means:

- Editing a `.tsx` file does **nothing** until you run `npm run sync-templates`
- Editing in the Resend dashboard works for one-off fixes but gets overwritten next sync — always commit the React source
- The same template can be referenced from anywhere in the app via its alias

---

## Checklist before sending a new email

- [ ] Reread against the five principles above
- [ ] No `desværre`, no reject-framing
- [ ] Restates what Altid Hjem is and why it's relevant
- [ ] Soft on timing — no dates we can't keep
- [ ] Three to four body sentences max
- [ ] Pass Werner for sign-off
- [ ] `npm run sync-templates` after committing the source
- [ ] Send yourself a test before scheduling the real batch
