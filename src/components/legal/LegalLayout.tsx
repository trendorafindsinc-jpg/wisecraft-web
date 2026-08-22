import { Link } from 'react-router-dom'

export function LegalLayout({
  title,
  eyebrow,
  children,
}: {
  title: string
  eyebrow: string
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="border-b border-border px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-accent">
            {eyebrow}
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">{title}</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6">
        <article className="glass-card glass-highlight mx-auto max-w-3xl rounded-2xl p-5 sm:p-8">
          <div className="wisecraft-markdown text-sm sm:text-[15px] leading-7">
            {children}
          </div>

          <div className="mt-8 border-t border-border pt-5">
            <Link to="/settings" className="text-sm font-medium text-accent hover:underline">
              ← Back to Settings
            </Link>
          </div>
        </article>
      </main>
    </div>
  )
}
