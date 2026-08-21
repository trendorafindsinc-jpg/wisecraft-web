import { persistence } from '../lib/persistence'
import { useAppStore } from '../stores/app-store'

export default function Settings() {
  const legacy = persistence.getLegacyProfile()
  const theme = useAppStore((s) => s.settings.theme)
  const setTheme = useAppStore((s) => s.setTheme)

  return (
    <div className="flex flex-col h-full">
      <header className="h-14 border-b border-border flex items-center px-6">
        <h1 className="text-lg font-semibold">Settings</h1>
      </header>
      <div className="p-6 max-w-lg space-y-4 overflow-y-auto">
        <section className="rounded-2xl border border-border bg-bg-surface p-5 space-y-4 shadow-sm">
          <div>
            <div className="text-xs uppercase tracking-wider text-text-tertiary">Appearance</div>
            <div className="mt-1 font-medium">Theme</div>
            <div className="mt-1 text-sm text-text-secondary">
              Choose how WISECRAFT looks on this device.
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'light' as const, label: 'Light' },
              { value: 'dark' as const, label: 'Dark' },
              { value: 'system' as const, label: 'System' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTheme(option.value)}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                  theme === option.value
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-border bg-bg-elevated text-text-secondary hover:text-text-primary'
                }`}
                aria-pressed={theme === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <section className="glass-card glass-highlight rounded-2xl p-5 space-y-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-text-tertiary">Help & Support</div>
            <div className="mt-1 font-medium">WISECRAFT Help Center</div>
            <div className="mt-1 text-sm text-text-secondary">
              Guides, product information, and support resources.
            </div>
          </div>
          <a href="/help" className="inline-flex text-sm font-medium text-accent hover:underline">
            Open Help Center →
          </a>
        </section>

        <section className="glass-card glass-highlight rounded-2xl p-5 space-y-3">
          <div className="text-xs uppercase tracking-wider text-text-tertiary">Legal & Privacy</div>
          <a href="/legal/terms" className="block text-sm font-medium text-text-primary hover:text-accent">Terms of Service →</a>
          <a href="/legal/privacy" className="block text-sm font-medium text-text-primary hover:text-accent">Privacy Policy →</a>
          <a href="/legal/cookies" className="block text-sm font-medium text-text-primary hover:text-accent">Cookie Policy →</a>
          <a href="/legal/ai-data" className="block text-sm font-medium text-text-primary hover:text-accent">AI & Data Use →</a>
        </section>

        <section className="glass-card glass-highlight rounded-2xl p-5 space-y-4">
          <div className="text-xs uppercase tracking-wider text-text-tertiary">About</div>
          <div>
            <div className="text-lg font-semibold">WISECRAFT</div>
            <div className="text-sm text-text-secondary">An AI-powered education, entrepreneurship, and financial growth platform by Trendora Inc.</div>
          </div>

          <div className="rounded-xl border border-border bg-bg-elevated/60 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-accent">Founder’s Note</div>
            <blockquote className="mt-3 text-sm leading-7 text-text-secondary">
              “WISECRAFT was created with a simple belief: access to knowledge, better tools,
              and intelligent guidance should help people move from ideas to meaningful progress.
              We are building WISECRAFT not simply as an AI product, but as a platform designed
              to help people learn, create, make better decisions, and build toward a better future.”
            </blockquote>
            <div className="mt-4">
              <div className="font-semibold">Afolabi Oluwaseyi</div>
              <div className="text-xs text-text-tertiary">Founder, Trendora Inc.</div>
            </div>
          </div>
        </section>

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
