import { useState } from 'react'
import { Sparkles, BookOpen, Copy, Check } from 'lucide-react'
import type { Message } from '../../types'

export function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="space-y-6">
      {messages.map((m) => (
        <MessageRow key={m.id} message={m} />
      ))}
    </div>
  )
}

function MessageRow({ message: m }: { message: Message }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(m.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }

  if (m.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-[15px] leading-relaxed text-white whitespace-pre-wrap">
          {m.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 group">
      <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
        <Sparkles size={14} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <div className="text-xs font-medium text-text-tertiary">WISECRAFT</div>
        <div className="text-[15px] leading-relaxed text-text-primary whitespace-pre-wrap">
          {m.status === 'pending' && !m.content ? 'Thinking…' : m.content}
        </div>
        {m.sources && m.sources.length > 0 && (
          <div className="rounded-xl border border-border bg-bg-surface px-3 py-2 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] text-accent">
              <BookOpen size={12} />
              From Trendorafinds
            </div>
            {m.sources.map((s) => (
              <a
                key={s.link}
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-text-secondary hover:text-text-primary truncate"
              >
                {s.title || s.link}
              </a>
            ))}
          </div>
        )}
        {m.content && m.status !== 'pending' && (
          <button
            type="button"
            onClick={copy}
            className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-elevated opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition"
            aria-label="Copy message"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>
        )}
      </div>
    </div>
  )
}
