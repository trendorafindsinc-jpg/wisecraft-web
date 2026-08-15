import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Send, Sparkles } from 'lucide-react'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const STARTER: Message = {
  id: '0',
  role: 'assistant',
  content:
    "I'm WISECRAFT, your AI mentor for income, business and financial growth. I prioritize practical guidance grounded in Trendorafinds content.\n\nWhat are you working on right now?",
}

export function Chat() {
  const [params] = useSearchParams()
  const initialQ = params.get('q') || ''
  const [messages, setMessages] = useState<Message[]>([STARTER])
  const [input, setInput] = useState(initialQ)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (initialQ.trim()) {
      // auto-send if came from a prompt
      void handleSend(initialQ)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSend(override?: string) {
    const text = (override ?? input).trim()
    if (!text || sending) return

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setSending(true)

    // Placeholder response — replace with real AI + RAG later
    await new Promise((r) => setTimeout(r, 900))
    const reply: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content:
        `Thanks for sharing that.\n\nRight now this is a UI preview. Next step is connecting the real mentor engine that searches Trendorafinds content first, then builds a personalized plan from your profile.\n\nFor "${text.slice(0, 60)}${text.length > 60 ? '…' : ''}" I would normally:\n1. Search relevant Trendorafinds guides\n2. Match them to your capital, skills and goals\n3. Give you a clear next action\n\nWe're building that next.`,
    }
    setMessages((m) => [...m, reply])
    setSending(false)
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-8.5rem)] animate-fade-in">
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-violet-600/90 text-white rounded-2xl rounded-br-md'
                  : 'glass-card text-slate-200 rounded-2xl rounded-bl-md'
              }`}
            >
              {m.role === 'assistant' && (
                <div className="flex items-center gap-1.5 text-[11px] text-cyan-400/90 mb-1.5">
                  <Sparkles size={12} />
                  WISECRAFT
                </div>
              )}
              {m.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="glass-card px-4 py-3 text-sm text-slate-400 rounded-2xl rounded-bl-md">
              Thinking…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          void handleSend()
        }}
        className="flex gap-2 pt-2 border-t border-white/5"
      >
        <input
          className="field-input flex-1"
          placeholder="Ask about income, business, money…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={sending}
        />
        <button type="submit" className="btn btn-primary px-4" disabled={sending || !input.trim()}>
          <Send size={18} />
        </button>
      </form>
    </div>
  )
}
