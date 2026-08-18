import type { ReactNode } from 'react'

export function PlaceholderPage({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: ReactNode
}) {
  return (
    <div className="flex flex-col h-full">
      <header className="h-14 border-b border-border flex items-center px-6">
        <h1 className="text-lg font-semibold">{title}</h1>
      </header>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-bg-surface border border-border flex items-center justify-center mx-auto">
            {icon}
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
          <p className="text-xs text-text-tertiary">
            Architecture is ready for future integration — no simulated data.
          </p>
        </div>
      </div>
    </div>
  )
}
