import { useState } from 'react'
import { Target, Plus } from 'lucide-react'
import { useAppStore } from '../stores/app-store'

export default function Goals() {
  const goals = useAppStore((s) => s.goals)
  const addGoal = useAppStore((s) => s.addGoal)
  const [title, setTitle] = useState('')

  function onAdd() {
    const t = title.trim()
    if (!t) return
    addGoal({ title: t, category: 'General', target: t })
    setTitle('')
  }

  return (
    <div className="flex flex-col h-full">
      <header className="h-14 border-b border-border flex items-center px-6">
        <h1 className="text-lg font-semibold">Goals</h1>
      </header>
      <div className="flex-1 overflow-y-auto p-6 max-w-lg space-y-4">
        <div className="flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onAdd()}
            placeholder="Add a goal…"
            className="flex-1 rounded-xl border border-border bg-bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-sm text-white hover:bg-primary-hover"
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        {goals.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Target className="mx-auto text-text-tertiary" size={28} />
            <p className="text-sm text-text-secondary">
              No goals yet. Add one to track what you are working toward. Stored on
              this device only.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {goals.map((g) => (
              <li
                key={g.id}
                className="rounded-xl border border-border bg-bg-surface px-4 py-3"
              >
                <div className="font-medium text-sm">{g.title}</div>
                <div className="text-xs text-text-tertiary mt-1">
                  {g.status} · local only
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
