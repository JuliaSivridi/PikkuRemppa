import type { ReactNode } from 'react'

interface AppShellProps {
  title: string
  headerRight?: ReactNode
  children: ReactNode
}

export function AppShell({ title, headerRight, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <h1 className="app-shell__title">{title}</h1>
        <div className="app-shell__header-right">{headerRight}</div>
      </header>
      <main className="app-shell__main">{children}</main>
    </div>
  )
}
