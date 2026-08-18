import { BookOpen, Lightbulb, Target } from 'lucide-react'
import { useAppStore } from '../../stores/app-store'

export function ContextPanel() {
  const activeId = useAppStore((s) => s.activeConversationId)
  const conv = useAppStore((s) =>
    s.conversations.find((c) => c.id === activeId)
  )
  const goals = useAppStore((s) => s.goals)
  const activeGoals = goals.filter((g) => g.status === 'active').slice(0, 3)

  const lastAssistant = [...(conv?.messages || [])]
    .reverse()
    .find((m) => m.role === 'assistant' && m.sources && m.sources.length > 0)

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-3">
          Mentor context
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          WISECRAFT helps you know what to do next — income, skills, trades, and
          money — with Trendorafinds knowledge when available.
        </p>
      </div>

      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-2">
          <Target size={14} />
          Active goals
        </div>
        {activeGoals.length === 0 ? (
          <p className="text-sm text-text-tertiary">
            No goals yet. Set one from Goals when you are ready.
          </p>
        ) : (
          <ul className="space-y-2">
            {activeGoals.map((g) => (
              <li
                key={g.id}
                className="text-sm text-text-secondary border border-border rounded-lg px-3 py-2"
              >
                {g.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      {lastAssistant?.sources && lastAssistant.sources.length > 0 ? (
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent mb-2">
            <BookOpen size={14} />
            Sources
          </div>
          <ul className="space-y-2">
            {lastAssistant.sources.map((s) => (
              <li key={s.link}>
                <a
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-text-secondary hover:text-text-primary truncate"
                >
                  {s.title || s.link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-2">
            <BookOpen size={14} />
            Sources
          </div>
          <p className="text-sm text-text-tertiary">
            Sources appear here when a reply uses Trendorafinds material.
          </p>
        </div>
      )}

      <div className="rounded-xl border border-border bg-bg-surface p-3">
        <div className="flex items-center gap-2 text-xs font-medium text-text-secondary mb-1">
          <Lightbulb size={14} />
          Tip
        </div>
        <p className="text-sm text-text-tertiary">
          Press{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-bg-elevated text-xs">⌘</kbd>+
          <kbd className="px-1.5 py-0.5 rounded bg-bg-elevated text-xs">K</kbd> for
          commands.
        </p>
      </div>
    </div>
  )
}
