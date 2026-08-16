import { useState, useRef, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Send, Sparkles, Copy, Check, RotateCcw } from 'lucide-react'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTIONS = [
  'I have ₦20,000. What business can I start?',
  'How do I build an emergency fund in Nigeria?',
  'Best side hustles for a student with limited time?',
  'How should I budget ₦50,000 a month?',
]

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-1">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]" />
    </div>
  )
}

function AssistantAvatar() {
  return (
    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg shadow-violet-900/30">
      <Sparkles size={14} className="text-white" />
    </div>
  )
}

function MessageBubble({
  message,
  isLast,
}: {
  message: Message
  isLast: boolean
}) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  async function copy() {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }

  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="max-w-[85%] sm:max-w-[75%] bg-violet-600 text-white px-4 py-3 rounded-2xl rounded-br-md text-[15px] leading-relaxed shadow-lg shadow-violet-900/20">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 animate-fade-in group">
      <AssistantAvatar />
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">WISECRAFT</span>
        </div>
        <div className="text-[15px] leading-relaxed text-slate-100 whitespace-pre-wrap">
          {message.content}
        </div>
        {isLast && (
          <div className="flex items-center gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={copy}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition"
              aria-label="Copy"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function Chat() {
  const [params] = useSearchParams()
  const initialQ = params.get('q') || ''
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [started, setStarted] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const didAutoSend = useRef(false)

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, sending, scrollToBottom])

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [input])

  const handleSend = useCallback(
    async (override?: string) => {
      const text = (override ?? input).trim()
      if (!text || sending) return

      setStarted(true)
      const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text }
      setMessages((m) => [...m, userMsg])
      setInput('')
      setSending(true)

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }

      // Simulate thinking delay — replace with real AI later
      await new Promise((r) => setTimeout(r, 1100 + Math.random() * 600))

      const reply: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: buildPlaceholderReply(text),
      }
      setMessages((m) => [...m, reply])
      setSending(false)
    },
    [input, sending]
  )

  useEffect(() => {
    if (initialQ.trim() && !didAutoSend.current) {
      didAutoSend.current = true
      void handleSend(initialQ)
    }
  }, [initialQ, handleSend])

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  const showWelcome = !started && messages.length === 0 && !sending

  return (
    <div className="flex flex-col h-[calc(100dvh-7.5rem)] sm:h-[calc(100dvh-8rem)] -mx-4">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4">
        {showWelcome ? (
          <div className="flex flex-col items-center justify-center min-h-full py-8 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-violet-900/40 mb-5">
              <Sparkles size={26} className="text-white" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-center mb-2">
              How can I help you today?
            </h1>
            <p className="text-sm text-slate-400 text-center max-w-sm mb-8 leading-relaxed">
              Your AI mentor for income, business and financial growth — grounded in Trendorafinds content.
            </p>

            <div className="w-full max-w-md grid gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void handleSend(s)}
                  className="text-left px-4 py-3 rounded-xl text-sm text-slate-300 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/15 transition active:scale-[0.99]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4 pb-6 max-w-2xl mx-auto">
            {messages.map((m, i) => (
              <MessageBubble
                key={m.id}
                message={m}
                isLast={i === messages.length - 1 && m.role === 'assistant'}
              />
            ))}

            {sending && (
              <div className="flex gap-3 animate-fade-in">
                <AssistantAvatar />
                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-400">WISECRAFT</span>
                  <div className="glass-card px-4 py-3 rounded-2xl rounded-tl-md inline-block">
                    <TypingDots />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="shrink-0 px-4 pt-2 pb-1 border-t border-white/[0.06] bg-[#07070A]/80 backdrop-blur-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            void handleSend()
          }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.04] focus-within:border-violet-500/40 focus-within:ring-2 focus-within:ring-violet-500/15 transition-all px-3 py-2">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Message WISECRAFT…"
              disabled={sending}
              className="flex-1 resize-none bg-transparent text-[15px] text-slate-100 placeholder:text-slate-500 outline-none py-2 max-h-40 leading-relaxed"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="shrink-0 w-10 h-10 mb-0.5 rounded-xl bg-violet-600 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-violet-500 transition shadow-lg shadow-violet-900/30"
              aria-label="Send"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-slate-600 text-center mt-2 mb-1">
            WISECRAFT prioritizes Trendorafinds content · Enter to send · Shift+Enter for new line
          </p>
        </form>
      </div>
    </div>
  )
}

function buildPlaceholderReply(text: string): string {
  const short = text.length > 70 ? text.slice(0, 70) + '…' : text
  return `Good question.

Right now you're seeing the upgraded chat interface. The real mentor engine (searching Trendorafinds first, then building a personal plan) will plug in next.

For “${short}” I would normally:

1. Search relevant guides on Trendorafinds
2. Match them to your capital, skills and goals
3. Give you a clear next action you can take today

Keep exploring the UI — the coaching brain is coming.`.trim()
}
