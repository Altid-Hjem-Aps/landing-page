/**
 * Syncs email templates to Resend dashboard.
 * Run after editing any file in emails/ :
 *   npm run sync-templates
 *
 * Requires RESEND_API_KEY in .env.local (loaded automatically via dotenv).
 */
import 'dotenv/config'
import React from 'react'
import { render } from '@react-email/render'
import { Resend } from 'resend'
import WaitlistConfirmation from '../emails/WaitlistConfirmation'
import ReleaseEmail from '../emails/ReleaseEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

const PLACEHOLDER = '{{{first_name}}}'

const VARIABLES = [{ key: 'first_name', type: 'string' as const, fallbackValue: '' }]

const TEMPLATES = [
  {
    alias: 'waitlist-confirmation',
    name: 'Waitlist Confirmation',
    subject: 'Du er på Altid Hjem-ventelisten',
    from: 'Altid Hjem <hej@altidhjem.dk>',
    react: React.createElement(WaitlistConfirmation, { firstName: PLACEHOLDER }),
  },
  {
    alias: 'waitlist-release',
    name: 'Release — Den er her',
    subject: 'Den er her.',
    from: 'Altid Hjem <hej@altidhjem.dk>',
    react: React.createElement(ReleaseEmail, { firstName: PLACEHOLDER }),
  },
]

async function getExistingTemplates(): Promise<Record<string, string>> {
  const result = await resend.templates.list()
  if (result.error) throw new Error(`Failed to list templates: ${result.error.message}`)
  const map: Record<string, string> = {}
  for (const t of result.data?.data ?? []) {
    if (t.alias) map[t.alias] = t.id
  }
  return map
}

async function sync() {
  console.log('Fetching existing Resend templates...')
  const existing = await getExistingTemplates()

  for (const tpl of TEMPLATES) {
    const existingId = existing[tpl.alias]

    if (existingId) {
      console.log(`Updating "${tpl.alias}" (${existingId})...`)
      const html = await render(tpl.react)
      const res = await resend.templates.update(existingId, {
        name: tpl.name,
        subject: tpl.subject,
        from: tpl.from,
        html,
        variables: VARIABLES,
      })
      if (res.error) {
        console.error(`  Failed to update: ${res.error.message}`)
        continue
      }
      await resend.templates.publish(existingId)
      console.log(`  Published.`)
    } else {
      console.log(`Creating "${tpl.alias}"...`)
      const html = await render(tpl.react)
      const res = await resend.templates.create({
        name: tpl.name,
        alias: tpl.alias,
        subject: tpl.subject,
        from: tpl.from,
        html,
        variables: VARIABLES,
      })
      if (res.error) {
        console.error(`  Failed to create: ${res.error.message}`)
        continue
      }
      await resend.templates.publish(res.data!.id)
      console.log(`  Created & published (id: ${res.data!.id}).`)
    }
  }

  console.log('\nDone.')
}

sync().catch((err) => {
  console.error(err)
  process.exit(1)
})
