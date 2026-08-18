import { useEffect, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useAppStore } from '../stores/app-store'
import { Composer } from '../components/chat/Composer'
import { MessageList } from '../components/chat/MessageList'
import { EmptyState } from '../components/chat/EmptyState'

export default function Chat() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const autoQ = params.get('q') || undefined

  const setActiveConversation = useAppStore((s) => s.setActiveConversation)
  const conversations = useAppStore((s) => s.conversations)
  const scrollRef = useRef<HTMLDivElement>(null)

  const conversation = conversations.find((c) => c.id === id)

  useEffect(() => {
    if (id) setActiveConversation(id)
  }, [id, setActiveConversation])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [conversation?.messages])

  return (
    <div className="flex flex-col h-full">
      <header className="h-14 border-b border-border flex items-center px-6 bg-bg-app/80 backdrop-blur-md sticky top-0 z-10">
        <h1 className="text-lg font-semibold text-text-primary truncate">
          {conversation?.title || 'WISECRAFT Mentor'}
        </h1>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-0">
        <div className="max-w-3xl mx-auto w-full py-8">
          {conversation && conversation.messages.length > 0 ? (
            <MessageList messages={conversation.messages} />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      <Composer conversationId={id} autoPrompt={autoQ} />
    </div>
  )
}
    <div className="max-w-[85%] sm:max-w-[75%] bg-violet-600 text-white px-4 py-3 rounded-2xl rounded-br-md text-[15px] leading-relaxed shadow-lg shadow-violet-900/20 whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 animate-fade-in group">
      <AssistantAvatar />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">WISECRAFT</span>
        </div>
        <div className="text-[15px] leading-relaxed text-slate-100 whitespace-pre-wrap">
          {message.content}
        </div>

        {message.sources && message.sources.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] text-cyan-400/90">
              <BookOpen size={12} />
              From Trendorafinds
            </div>
            {message.sources.map((s) => (
              <a
                key={s.link}
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[12px] text-slate-400 hover:text-slate-200 truncate"
              >
                {s.title || s.link}
              </a>
            ))}
          </div>
        )}

        {isLast && (
          <div className="flex items-center gap-1 pt-0.5 opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
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

async function callMentor(messages: Message[]): Promise<{
  content: string
  sources?: { title: string; link: string }[]
}> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`)
  }
  return {
    content: data.content || 'No response from mentor.',
    sources: data?.meta?.sources || [],
  }
}

export function Chat() {
  const [params] = useSearchParams()
  const initialQ = params.get('q') || ''
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [started, setStarted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const didAutoSend = useRef(false)

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, sending, scrollToBottom])

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
      setError(null)
      const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text }
      const nextMessages = [...messages, userMsg]
      setMessages(nextMessages)
      setInput('')
      setSending(true)

      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }

      try {
        const { content, sources } = await callMentor(nextMessages)
        const reply: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content,
          sources,
        }
        setMessages((m) => [...m, reply])
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Something went wrong'
        setError(msg)
        const reply: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `I hit a problem reaching the mentor engine.\n\n${msg}\n\nCheck NVIDIA_API_KEY on Vercel, then try again.`,
        }
        setMessages((m) => [...m, reply])
      } finally {
        setSending(false)
      }
    },
    [input, sending, messages]
  )

  useEffect(() => {
    if (initialQ.trim() && !didAutoSend.current) {
      didAutoSend.current = true
      void handleSend(initialQ)
    }
  }, [initialQ, handleSend])

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  const showWelcome = !started && messages.length === 0 && !sending

  return (
    <div className="flex flex-col h-[calc(100dvh-7.5rem)] sm:h-[calc(100dvh-8rem)] -mx-4">
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
              AI mentor grounded in Trendorafinds content · powered by NVIDIA
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

      <div className="shrink-0 px-4 pt-2 pb-1 border-t border-white/[0.06] bg-[#07070A]/80 backdrop-blur-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            void handleSend()
          }}
          className="max-w-2xl mx-auto"
        >
          {error && (
            <p className="text-[11px] text-rose-400/90 text-center mb-2 px-2">{error}</p>
          )}
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
            Searches Trendorafinds first · NVIDIA NIM · Enter to send
          </p>
        </form>
      </div>
    </div>
  )
}
