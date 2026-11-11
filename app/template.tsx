// A template mounts again on every navigation, so each page fades in when it is opened.
// Opacity only: a transform here would move the fixed menu and the sticky sections.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>
}
