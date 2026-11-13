'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import * as COPY from './copy'
import { flattenCopy, formatChanges, indexCopy, matchCopy, type Change } from './copyEdit'
import LeaveDialog from './LeaveDialog'
import { useMotionPrefs } from './MotionPrefs'

// Copy edit mode, for Thor (CopyEditGate loads this only with ?rediger in the address): every
// text on the front page can be edited where it stands. Each text is matched back to its string
// in copy.ts (its key path is its id), or else named by its section and place. Edits are kept in
// this browser (localStorage) and put back on every load; a small panel counts them, copies them
// as a plain list (each with its copy.ts key, the old text and the new), undoes them all, shows
// the originals for comparison, marks the texts with line breaks, and opens the leave popup.
// Texts with a placeholder ({hundreds}, {thousands}, {average}) show the placeholder. Moving
// pieces are paused, every FAQ answer and step is open, and links and buttons do not act.

const SAVED = 'altid-copy-edits'
const ROOT = '.site'
const PANEL = '[data-copy-panel]'
/** Not text to edit: the panel itself, drawings, and the arrange panel. */
const SKIP = `${PANEL}, svg, script, style, noscript, .e-arrange`
const PHRASING = new Set(['SPAN', 'B', 'STRONG', 'SMALL', 'EM', 'I', 'U'])
const ACTING = 'a, button, summary, label, [role="button"]'

type Saved = Record<string, { text: string; before: string; keys: string[]; place: string }>
type Host = HTMLElement & { dataset: { copyId: string } }

const INDEX = indexCopy(Object.entries(COPY).flatMap(([name, value]) => (typeof value === 'object' ? flattenCopy(value, name) : [])))

function readSaved(): Saved {
  const raw = window.localStorage.getItem(SAVED)
  return raw ? (JSON.parse(raw) as Saved) : {}
}

/** Editable as plain text where the browser knows plaintext-only (Firefox before 136 does not:
 * the attribute then leaves the element uneditable, so it falls back to true). */
function makeEditable(el: HTMLElement, on: boolean) {
  if (!on) {
    el.setAttribute('contenteditable', 'false')
    return
  }
  el.setAttribute('contenteditable', 'plaintext-only')
  if (!el.isContentEditable) el.setAttribute('contenteditable', 'true')
}

/** The text as it reads, line breaks included, without a trailing one. */
const textOf = (el: HTMLElement) => el.innerText.replace(/\n+$/, '')

/** Puts text into a host, keeping its own text node where it has just one, so the component
 * that drew it can still update it. */
function setText(el: HTMLElement, text: string) {
  const only = el.childNodes.length === 1 && el.firstChild?.nodeType === Node.TEXT_NODE ? el.firstChild : null
  if (only) only.nodeValue = text
  else el.innerText = text
}

/** Which copy.ts objects each part of the page draws from, to tell apart a text that is in
 * several of them (Hent appen is NAV.cta, QR.title and STEPS.steps.0.title). */
const SECTION_COPY: Record<string, string[]> = {
  nav: ['NAV'],
  sheet: ['NAV'],
  hero: ['HERO', 'PRESS'],
  proof: ['PROOF'],
  features: ['OKONOMI', 'ENERGI_OFFER'],
  steps: ['STEPS'],
  values: ['VALUES'],
  privacy: ['PRIVACY', 'BANKS'],
  story: ['STORY'],
  faq: ['FAQ'],
  final: ['FINAL', 'QR', 'MAD'],
  footer: ['FOOTER'],
  gs: ['QR'],
  ek: ['ENERGI_OFFER'],
  leave: ['LEAVE', 'QR'],
}

/** The keys a text can come from, given where it stands: none when the same words are only in
 * copy.ts for another part of the page (the hero's Altid Hjem note is written in its component). */
function keysHere(keys: string[], section: string) {
  const objects = SECTION_COPY[section]
  if (!objects) return keys
  return keys.filter((key) => objects.includes(key.split('.')[0]))
}

function sectionOf(el: HTMLElement) {
  const holder = el.closest('[data-b], header, footer, dialog, .gs, .ek') as HTMLElement | null
  if (!holder) return 'side'
  return holder.dataset.b ?? holder.className.toString().split(' ')[0] ?? holder.tagName.toLowerCase()
}

export default function CopyEditor() {
  const { paused, togglePaused } = useMotionPrefs()
  const [saved, setSaved] = useState<Saved>({})
  const [showOriginal, setShowOriginal] = useState(false)
  const [showBreaks, setShowBreaks] = useState(false)
  const [copied, setCopied] = useState(false)
  const [popup, setPopup] = useState(false)
  const hosts = useRef(new Map<string, Host[]>())
  const originals = useRef(new Map<string, { before: string; keys: string[]; place: string }>())
  const savedRef = useRef<Saved>({})
  const showOriginalRef = useRef(false)

  // Moving pieces hold still while editing.
  useEffect(() => {
    if (!paused) togglePaused()
  }, [paused, togglePaused])

  const save = useCallback((next: Saved) => {
    savedRef.current = next
    setSaved(next)
    window.localStorage.setItem(SAVED, JSON.stringify(next))
  }, [])

  // Finds the texts under the page (again after anything new appears) and makes them editable.
  useEffect(() => {
    const root = document.querySelector(ROOT) as HTMLElement
    root.dataset.copyEdit = 'true'
    savedRef.current = readSaved()
    setSaved(savedRef.current)

    const register = (host: HTMLElement, found: string[], template: string | undefined) => {
      const section = sectionOf(host)
      const place = `${section} › ${host.tagName.toLowerCase()}`
      const keys = keysHere(found, section)
      // A copy.ts text by its key (or keys, when the same words are in several); any other text
      // by where it stands and its own words, so its copies (a slider's clones) change together.
      const id = keys.length ? keys.join(' | ') : `${section}: ${(template ?? textOf(host)).replace(/\s+/g, ' ').trim()}`
      // A button's text cannot take a caret: its content moves into a span that can.
      let el = host
      if (host.tagName === 'BUTTON') {
        el = document.createElement('span')
        el.dataset.copyWrap = 'true'
        while (host.firstChild) el.appendChild(host.firstChild)
        host.appendChild(el)
      }
      const before = template ?? textOf(el)
      if (template) setText(el, template)
      el.dataset.copyId = id
      if (before.includes('\n')) el.dataset.copyLines = 'true'
      makeEditable(el, true)
      el.spellcheck = true
      if (!originals.current.has(id)) originals.current.set(id, { before, keys, place })
      hosts.current.set(id, [...(hosts.current.get(id) ?? []), el as Host])
      const edit = savedRef.current[id]
      if (edit) setText(el, edit.text)
    }

    const scan = () => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
      const found: { host: HTMLElement; keys: string[]; template?: string }[] = []
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        if (!node.nodeValue?.trim()) continue
        const parent = node.parentElement
        if (!parent || parent.closest(SKIP) || parent.closest('[data-copy-id]')) continue
        if (found.some((f) => f.host.contains(parent))) continue
        // The smallest element around it that is a whole copy.ts string, a few levels up at most.
        let host: HTMLElement | null = null
        let match: ReturnType<typeof matchCopy> = null
        for (let el: HTMLElement | null = parent, depth = 0; el && el !== root && depth < 5; el = el.parentElement, depth++) {
          match = matchCopy(INDEX, el.textContent ?? '')
          if (match) {
            host = el
            break
          }
        }
        if (!host) {
          // Not from copy.ts: the element it is in, or its parent when it sits in running text.
          const up = parent.parentElement
          const mixed = up && [...up.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.nodeValue?.trim())
          host = PHRASING.has(parent.tagName) && mixed && up !== root ? up : parent
          match = { keys: [] }
        }
        if (host.closest('[data-copy-id]') || found.some((f) => f.host.contains(host as HTMLElement))) continue
        // A larger host replaces the smaller ones found inside it.
        for (let i = found.length - 1; i >= 0; i--) if (host.contains(found[i].host)) found.splice(i, 1)
        found.push({ host, keys: (match as NonNullable<typeof match>).keys, template: match?.template })
      }
      for (const f of found) register(f.host, f.keys, f.template)
    }

    // Every FAQ answer and every step open, so all of them can be edited.
    const openAll = () => {
      for (const a of document.querySelectorAll<HTMLElement>('.q-answer')) {
        a.dataset.open = 'true'
        a.removeAttribute('aria-hidden')
      }
      for (const item of document.querySelectorAll<HTMLElement>('.q-item[data-more]')) item.removeAttribute('data-more')
    }

    openAll()
    scan()
    // New texts (the leave popup, a component drawing again) are found as they come; an edited
    // text a component redraws is put back.
    let frame = 0
    const observer = new MutationObserver(() => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        openAll()
        scan()
        for (const [id, els] of hosts.current) {
          const edit = savedRef.current[id]
          const shown = showOriginalRef.current ? originals.current.get(id)?.before : edit?.text
          for (const el of els) if (edit && shown !== undefined && document.activeElement !== el && textOf(el) !== shown && el.isConnected) setText(el, shown)
        }
      })
    })
    observer.observe(root, { childList: true, subtree: true, characterData: true })

    // Typing: kept as an edit, mirrored to the same text elsewhere on the page.
    const onInput = (e: Event) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>('[data-copy-id]')
      if (!el) return
      const id = el.dataset.copyId as string
      const original = originals.current.get(id)
      if (!original) return
      const text = textOf(el)
      const next = { ...savedRef.current }
      if (text === original.before) delete next[id]
      else next[id] = { text, before: original.before, keys: original.keys, place: original.place }
      for (const other of hosts.current.get(id) ?? []) if (other !== el) setText(other, text)
      save(next)
    }
    // Links and buttons do not act; a click puts the caret in their text instead.
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // The panel, and anything outside the page (the cookie banner), work as usual.
      if (target.closest(PANEL) || !target.closest(ROOT)) return
      const acting = target.closest(ACTING)
      if (!acting) return
      e.preventDefault()
      e.stopPropagation()
      const host = target.closest<HTMLElement>('[data-copy-id]') ?? acting.querySelector<HTMLElement>('[data-copy-id]')
      host?.focus()
    }
    // Not even a form sends.
    const onSubmit = (e: Event) => e.preventDefault()
    root.addEventListener('input', onInput)
    document.addEventListener('click', onClick, true)
    document.addEventListener('submit', onSubmit, true)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      root.removeEventListener('input', onInput)
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('submit', onSubmit, true)
      delete root.dataset.copyEdit
    }
  }, [save])

  // Originals to compare: shown in place and not editable meanwhile.
  useEffect(() => {
    showOriginalRef.current = showOriginal
    for (const [id, els] of hosts.current) {
      const edit = savedRef.current[id]
      const original = originals.current.get(id)
      if (!edit || !original) continue
      const shown = showOriginal ? original.before : edit.text
      for (const el of els) {
        // Only when it differs: setting the text being typed would throw the caret to the start.
        if (textOf(el) !== shown) setText(el, shown)
        makeEditable(el, !showOriginal)
      }
    }
    const root = document.querySelector(ROOT) as HTMLElement
    root.dataset.copyOriginal = showOriginal ? 'true' : 'false'
  }, [showOriginal, saved])

  useEffect(() => {
    ;(document.querySelector(ROOT) as HTMLElement).dataset.copyBreaks = showBreaks ? 'true' : 'false'
  }, [showBreaks])

  // The changes in page order; edits whose text is not on the page now (the popup) at the end.
  const changes = (): Change[] => {
    const order = [...document.querySelectorAll<HTMLElement>('[data-copy-id]')].map((el) => el.dataset.copyId as string)
    const ids = Object.keys(savedRef.current).sort((a, b) => (order.indexOf(a) + 1 || Infinity) - (order.indexOf(b) + 1 || Infinity))
    return ids.map((id) => ({ id, keys: savedRef.current[id].keys, place: savedRef.current[id].place, before: savedRef.current[id].before, after: savedRef.current[id].text }))
  }
  const copy = async () => {
    await navigator.clipboard.writeText(formatChanges(changes()))
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }
  const undoAll = () => {
    for (const [id, edit] of Object.entries(savedRef.current)) for (const el of hosts.current.get(id) ?? []) setText(el, edit.before)
    save({})
    setShowOriginal(false)
  }

  const count = Object.keys(saved).length
  return (
    <>
      <style>{EDIT_STYLE}</style>
      <div className="copy-panel" data-copy-panel role="group" aria-label="Rediger tekster">
        <b>
          {count} {count === 1 ? 'ændring' : 'ændringer'}
        </b>
        <button type="button" onClick={copy} disabled={count === 0}>
          {copied ? 'Kopieret' : 'Kopiér ændringer'}
        </button>
        <button type="button" onClick={undoAll} disabled={count === 0}>
          Fortryd alle
        </button>
        <button type="button" onClick={() => setShowOriginal((v) => !v)} aria-pressed={showOriginal} disabled={count === 0}>
          {showOriginal ? 'Vis ændringer' : 'Vis original'}
        </button>
        <label>
          <input type="checkbox" checked={showBreaks} onChange={(e) => setShowBreaks(e.target.checked)} /> Linjeskift
        </label>
        <button type="button" onClick={() => setPopup(true)}>
          Vis popup
        </button>
      </div>
      {popup ? <LeaveDialog proof={COPY.LEAVE.proof} onClose={() => setPopup(false)} /> : null}
    </>
  )
}

// The mode's own look: a dashed outline on a text under the pointer, a solid one on the text
// being edited, every step and answer open, and the panel bottom left.
const EDIT_STYLE = `
.site[data-copy-edit] [data-copy-id] { cursor: text; border-radius: 4px; outline-offset: 2px; }
.site[data-copy-edit] [data-copy-id]:hover { outline: 1px dashed rgba(0, 60, 22, 0.55); }
.site[data-copy-edit] [data-copy-id]:focus { outline: 2px solid #1f7a3a; background: rgba(144, 255, 124, 0.18); }
.site[data-copy-edit] [data-copy-id][contenteditable='false'] { cursor: default; }
.site[data-copy-breaks='true'] [data-copy-lines] { outline: 2px dotted #e08a00; }
.site[data-copy-breaks='true'] [data-copy-lines] .d-line:not(:last-child)::after { content: ' ↵'; color: #e08a00; }
.site[data-copy-original='true'] [data-copy-id] { outline: none; }
.site[data-copy-edit] .q-answer, .site[data-copy-edit] .st-more { grid-template-rows: 1fr !important; }
.site[data-copy-edit] .q-answer > div, .site[data-copy-edit] .st-more > div { visibility: visible !important; }
.copy-panel { position: fixed; z-index: 55; left: 16px; bottom: 16px; display: flex; flex-wrap: wrap; align-items: center; gap: 8px; max-width: calc(100vw - 32px); padding: 8px 10px 8px 14px; border-radius: 22px; background: #003c16; box-shadow: 0 12px 30px rgba(0, 30, 10, 0.25); color: #fdfaf4; font: 14px/1.2 var(--text), system-ui, sans-serif; }
.copy-panel button { padding: 8px 12px; border: 0; border-radius: 999px; background: #fdfaf4; color: #003c16; font: inherit; font-weight: 600; cursor: pointer; }
.copy-panel button:disabled { opacity: 0.5; cursor: default; }
.copy-panel label { display: inline-flex; align-items: center; gap: 4px; cursor: pointer; }
`
