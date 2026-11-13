'use client'

import { useEffect, useState, type ComponentType } from 'react'

// The copy edit mode's door: only with ?rediger in the address does it fetch the editor
// (CopyEditor) and put it on the page. Visitors get this check and nothing else.
export default function CopyEditGate() {
  const [Editor, setEditor] = useState<ComponentType | null>(null)

  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has('rediger')) return
    void import('./CopyEditor').then((module) => setEditor(() => module.default))
  }, [])

  return Editor ? <Editor /> : null
}
