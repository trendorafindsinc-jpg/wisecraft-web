import { Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../stores/app-store'

const SUGGESTIONS = [
  'I have ₦20,000. What business can I start?',
  'How do I build an emergency fund in Nigeria?',
  'I know basic electrical work. How do I start earning from it?',
  'Best side hustles for a student with limited time?',
]

export function EmptyState() {
  const navigate = useNavigate()
  const createConversation = useAppStore((s) => s.createConversation)
  const addMessage = useAppStore((s) => s.addMessage)

  // Parent Composer handles send; here we only seed a new chat with the prompt as draft via navigation
  // For simplicity: create chat and let user send — or we navigate with query
  function pick(q: string) {
    const id = createConversation(q.slice(0, 40))
    navigate(`/chat/${id}?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-5">
        <Sparkles className="text-primary" size={26} />
      </div>
      <h2 className="text-xl font-semibold mb-2">How can I help you today?</h2>
      <p className="text-sm text-text-secondary max-w-md mb-8">
        Your AI mentor for income, trades, business and money — grounded in Trendorafinds.
      </p>
      <div className="w-full max-w-md grid gap-2 text-left">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => pick(s)}
            className="px-4 py-3 rounded-xl text-sm text-text-secondary border border-border bg-bg-surface hover:bg-bg-elevated hover:text-text-primary transition"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
