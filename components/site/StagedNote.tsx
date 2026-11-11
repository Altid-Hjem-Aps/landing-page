import { NOTES } from './copy'

export default function StagedNote({ className = '' }: { className?: string }) {
  return <p className={`note ${className}`}>{NOTES.staged}</p>
}
