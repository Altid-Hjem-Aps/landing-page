// Monochrome service marks for the "Samlet i én app" row, in Deep forest. Drawn here.
const PATHS = {
  okonomi: 'M4 20V10.5h3.5V20H4Zm6.25 0V4h3.5v16h-3.5ZM16.5 20v-7h3.5v7h-3.5Z',
  mad: 'M7 3v7.2a2.5 2.5 0 0 0 1.5 2.3V21h2v-8.5a2.5 2.5 0 0 0 1.5-2.3V3h-1.5v5H10V3H9v5H8.5V3H7Zm9.5 0c-2 0-3.5 2.6-3.5 6 0 2.2.8 3.7 2 4.2V21h2V3h-.5Z',
  energi: 'M12 2.5a6.8 6.8 0 0 0-4.1 12.2c.7.6 1.1 1.4 1.1 2.3v.5h6V17c0-.9.4-1.7 1.1-2.3A6.8 6.8 0 0 0 12 2.5ZM9.5 19h5v1a1.5 1.5 0 0 1-1.5 1.5h-2A1.5 1.5 0 0 1 9.5 20v-1Z',
  forsikring: 'M12 2.5a.9.9 0 0 0-.9.9v.7A9.2 9.2 0 0 0 2.5 13h7a2.6 2.6 0 0 1 1.6-.9v6.2a1.4 1.4 0 0 1-2.8 0 .9.9 0 1 0-1.8 0 3.2 3.2 0 0 0 6.4 0v-6.2c.6.1 1.2.4 1.6.9h7A9.2 9.2 0 0 0 12.9 4.1v-.7a.9.9 0 0 0-.9-.9Z',
} as const

export type ServiceIconName = keyof typeof PATHS

export default function ServiceIcon({ name, size = 24 }: { name: ServiceIconName; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  )
}
