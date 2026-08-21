import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Sparkles, BookOpen, Copy, Check, ExternalLink } from 'lucide-react'
import type { Components } from 'react-markdown'
import type { Message } from '../../types'

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mt-7 mb-4 text-2xl sm:text-3xl font-bold tracking-tight text-text-primary first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-6 mb-3 text-xl sm:text-2xl font-semibold tracking-tight text-text-primary first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-5 mb-2 text-lg sm:text-xl font-semibold text-text-primary first:mt-0">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-4 last:mb-0 leading-7 text-text-primary/95">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 ml-5 list-disc space-y-2 marker:text-primary">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 ml-5 list-decimal space-y-2 marker:font-semibold marker:text-primary">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="pl-1 leading-7 text-text-primary/95">
      {children}
    </li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-text-primary">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-text-primary">{children}</em>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-5 border-l-2 border-primary/60 bg-primary/[0.06] px-4 py-3 text-text-secondary rounded-r-xl">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-6 border-border" />,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-accent underline decoration-accent/30 underline-offset-4 transition hover:decoration-accent"
    >
      {children}
      <ExternalLink size={12} className="shrink-0 opacity-70" />
    </a>
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = Boolean(className?.includes('language-'))

    if (!isBlock) {
      return (
        <code
          {...props}
          className="rounded-md border border-border bg-bg-elevated px-1.5 py-0.5 font-mono text-[0.9em] text-accent"
        >
          {children}
        </code>
      )
    }

    return (
      <code
        {...props}
        className="font-mono text-[13px] leading-6 text-text-primary"
      >
        {children}
      </code>
    )
  },
  pre: ({ children }) => (
    <pre className="glass-elevated my-5 overflow-x-auto rounded-2xl p-4">
      {children}
    </pre>
  ),
}

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
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-[15px] leading-relaxed text-white whitespace-pre-wrap shadow-lg shadow-primary/10">
          {m.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 group">
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 shadow-inner shadow-white/5">
        <Sparkles size={14} className="text-primary" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center gap-2">
          <div className="text-xs font-semibold tracking-wide text-text-tertiary">
            WISECRAFT
          </div>

          {m.status === 'complete' && (
            <div className="h-1 w-1 rounded-full bg-emerald-400/70" />
          )}
        </div>

        <div className="glass-card glass-highlight rounded-2xl p-4 sm:p-5">
          {m.status === 'pending' && !m.content ? (
            <div className="flex items-center gap-2 text-[15px] text-text-secondary">
              <span>Thinking</span>
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
              </span>
            </div>
          ) : (
            <div className="wisecraft-markdown text-[15px] sm:text-[16px]">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {m.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {m.sources && m.sources.length > 0 && (
          <div className="glass-control mt-3 rounded-2xl p-3">
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-accent">
              <BookOpen size={12} />
              From Trendorafinds
            </div>

            <div className="space-y-1.5">
              {m.sources.map((s) => (
                <a
                  key={s.link}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate rounded-lg px-2 py-1.5 text-xs text-text-secondary transition hover:bg-bg-elevated hover:text-text-primary"
                >
                  {s.title || s.link}
                </a>
              ))}
            </div>
          </div>
        )}

        {m.content && m.status !== 'pending' && (
          <button
            type="button"
            onClick={copy}
            className="mt-2 rounded-lg p-1.5 text-text-tertiary transition hover:bg-bg-elevated hover:text-text-primary sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="Copy message"
          >
            {copied ? (
              <Check size={14} className="text-emerald-400" />
            ) : (
              <Copy size={14} />
            )}
          </button>
        )}
      </div>
    </div>
  )
}
