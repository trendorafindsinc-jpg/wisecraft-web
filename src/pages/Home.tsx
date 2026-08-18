import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../stores/app-store'
import { Sparkles } from 'lucide-react'

const ACTIONS = [
  'Plan my next business idea',
  'Create a financial-growth plan',
  'Help me learn a practical skill',
  'Build a 30-day action plan',
  'I know electrical work — how do I earn from it?',
  'Help me budget with a small income',
]

export default function Home() {
  const navigate = useNavigate()
  const createConversation = useAppStore((s) => s.createConversation)

  function start(prompt: string) {
    const id = createConversation(prompt.slice(0, 48))
    navigate(`/chat/${id}?q=${encodeURIComponent(prompt)}`)
  }

  function blank() {
    const id = createConversation()
    navigate(`/chat/${id}`)
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-5">
          <Sparkles className="text-primary" size={26} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          How can WISECRAFT help you move forward?
        </h1>
        <p className="text-sm text-text-secondary mb-8 max-w-md mx-auto">
          Your AI mentor for income, trades, business, and money — grounded in
          Trendorafinds when relevant.
        </p>
        <button
          type="button"
          onClick={blank}
          className="mb-8 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-hover"
        >
          Start a new conversation
        </button>
        <div className="grid gap-2 text-left">
          {ACTIONS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => start(a)}
              className="px-4 py-3 rounded-xl text-sm text-text-secondary border border-border bg-bg-surface hover:bg-bg-elevated hover:text-text-primary transition text-left"
            >
              {a}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
What business can I start?',
            'How do I build an emergency fund in Nigeria?',
            'Best side hustles for a student with limited time?',
          ].map((q) => (
            <Link
              key={q}
              to={`/chat?q=${encodeURIComponent(q)}`}
              className="glass-card px-4 py-3 flex items-center justify-between gap-3 text-sm text-slate-300 hover:text-white transition"
            >
              <span className="line-clamp-1">{q}</span>
              <ArrowRight size={16} className="shrink-0 text-slate-500" />
            </Link>
          ))}
        </div>
      </section>

      <p className="text-center text-[11px] text-slate-600 pt-2">
        Powered by Trendorafinds · Trendora Inc
      </p>
    </div>
  )
}
