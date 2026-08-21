import { persistence } from '../lib/persistence'

export default function Settings() {
  const legacy = persistence.getLegacyProfile()

  return (
    <div className="flex flex-col h-full">
      <header className="h-14 border-b border-border flex items-center px-6">
        <h1 className="text-lg font-semibold">Settings</h1>
      </header>
      <div className="p-6 max-w-lg space-y-4 overflow-y-auto">
        <section className="rounded-xl border border-border bg-bg-surface p-4 space-y-2">
          <div className="text-xs uppercase tracking-wider text-text-tertiary">Product</div>
          <div className="font-medium">WISECRAFT</div>
          <div className="text-sm text-text-secondary">AI Mentor workspace · Trendora Inc</div>
        </section>
        <section className="rounded-xl border border-border bg-bg-surface p-4 space-y-2">
          <div className="text-xs uppercase tracking-wider text-text-tertiary">Knowledge</div>
          <div className="text-sm text-text-secondary">Trendorafinds (RAG via /api/chat)</div>
        </section>
        <section className="rounded-xl border border-border bg-bg-surface p-4 space-y-2">
          <div className="text-xs uppercase tracking-wider text-text-tertiary">Engine</div>
          <div className="text-sm text-text-secondary">WISECRAFT AI · secure connection</div>
        </section>
        <section className="rounded-xl border border-border bg-bg-surface p-4 space-y-2">
          <div className="text-xs uppercase tracking-wider text-text-tertiary">Data</div>
          <div className="text-sm text-text-secondary">
            Conversations and goals are stored in this browser (localStorage). No cloud
            account sync in this package.
          </div>
        </section>
        {legacy && (
          <section className="rounded-xl border border-border bg-bg-surface p-4 space-y-2">
            <div className="text-xs uppercase tracking-wider text-text-tertiary">
              Legacy onboarding profile (read-only)
            </div>
            <pre className="text-xs text-text-secondary whitespace-pre-wrap">
              {JSON.stringify(legacy, null, 2)}
            </pre>
          </section>
        )}
        <p className="text-xs text-text-tertiary pt-2">v0.2.0 · UI shell package</p>
      </div>
    </div>
  )
}
