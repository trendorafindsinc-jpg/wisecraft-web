import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, LifeBuoy, MessageCircleQuestion, ShieldCheck } from 'lucide-react'

const items = [
  {
    title: 'Getting Started',
    description: 'Learn the basics of navigating WISECRAFT, starting conversations, and using your workspace.',
    icon: BookOpen,
  },
  {
    title: 'How WISECRAFT Works',
    description: 'Understand how WISECRAFT provides AI-powered guidance and where its limitations apply.',
    icon: MessageCircleQuestion,
  },
  {
    title: 'AI & Data Use',
    description: 'Learn how conversations, browser storage, AI processing, and connected knowledge work together.',
    icon: ShieldCheck,
    href: '/legal/ai-data',
  },
  {
    title: 'Support',
    description: 'For product issues or feedback, contact the WISECRAFT team through your designated support channel.',
    icon: LifeBuoy,
  },
]

export default function Help() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="border-b border-border px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-accent">
            Help & Support
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">How can we help?</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Guides and information for getting the most from WISECRAFT.
          </p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto grid max-w-3xl gap-3">
          {items.map((item) => {
            const Icon = item.icon
            const content = (
              <>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-bg-elevated">
                  <Icon size={18} className="text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold">{item.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-text-secondary">
                    {item.description}
                  </p>
                </div>
                <ArrowRight size={17} className="mt-1 shrink-0 text-text-tertiary" />
              </>
            )

            return item.href ? (
              <Link key={item.title} to={item.href} className="glass-card glass-highlight flex items-start gap-4 rounded-2xl p-4 transition hover:-translate-y-0.5">
                {content}
              </Link>
            ) : (
              <div key={item.title} className="glass-card glass-highlight flex items-start gap-4 rounded-2xl p-4">
                {content}
              </div>
            )
          })}

          <Link
            to="/settings"
            className="mt-3 text-sm font-medium text-accent hover:underline"
          >
            ← Back to Settings
          </Link>
        </div>
      </main>
    </div>
  )
}
