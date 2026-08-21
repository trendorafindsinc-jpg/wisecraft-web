import {
  useRef,
  useState,
  useEffect,
  type KeyboardEvent,
  type ChangeEvent,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { Send } from 'lucide-react'
import { useAppStore } from '../../stores/app-store'
import { sendChat } from '../../lib/api/chat'

interface ComposerProps {
  conversationId: string | null | undefined
  autoPrompt?: string
}

export function Composer({ conversationId, autoPrompt }: ComposerProps) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const didAuto = useRef(false)
  const navigate = useNavigate()

  const addMessage = useAppStore((s) => s.addMessage)
  const setMessageContent = useAppStore((s) => s.setMessageContent)
  const createConversation = useAppStore((s) => s.createConversation)
  const updateConversationTitle = useAppStore((s) => s.updateConversationTitle)

  useEffect(() => {
    if (autoPrompt && !didAuto.current) {
      didAuto.current = true
      void handleSend(autoPrompt)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPrompt])

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`
  }

  const handleSend = async (override?: string) => {
    const text = (override ?? input).trim()
    if (!text || isLoading) return

    setError(null)
    let activeId = conversationId
    if (!activeId) {
      activeId = createConversation(text.slice(0, 48))
      navigate(`/chat/${activeId}`, { replace: true })
    } else {
      const conv = useAppStore
        .getState()
        .conversations.find((c) => c.id === activeId)
      if (conv && conv.title === 'New Mentorship') {
        updateConversationTitle(activeId, text.slice(0, 48))
      }
    }

    addMessage(activeId, 'user', text)
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    const aiMsgId = addMessage(activeId, 'assistant', '', { status: 'pending' })
    setIsLoading(true)

    try {
      const messages =
        useAppStore
          .getState()
          .conversations.find((c) => c.id === activeId)
          ?.messages.filter((m) => m.id !== aiMsgId && m.content)
          .map((m) => ({ role: m.role, content: m.content })) || []

      const { content, sources } = await sendChat(messages)
      setMessageContent(activeId, aiMsgId, content, 'complete', sources)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      let errMsg =
        "WISECRAFT couldn't complete that request. Check your connection and try again."
      if (msg === 'RATE_LIMIT') {
        errMsg = "You're temporarily out of AI requests. Please try again later."
      } else if (msg === 'NETWORK_ERROR') {
        errMsg = 'Network error. Check your connection and try again.'
      } else if (msg === 'EMPTY_RESPONSE') {
        errMsg = 'The mentor returned an empty reply. Please try again.'
      } else if (msg && !msg.startsWith('API_ERROR')) {
        errMsg = msg
      }
      setError(errMsg)
      setMessageContent(activeId, aiMsgId, errMsg, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  return (
    <div className="glass-elevated border-t border-border p-4 safe-bottom">
      <div className="max-w-3xl mx-auto relative">
        {error && (
          <div className="text-sm text-red-400 mb-2 px-2" role="alert">
            {error}
          </div>
        )}
        <div className="glass-control relative rounded-2xl focus-within:ring-2 focus-within:ring-primary/30 transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            className="w-full resize-none bg-transparent p-4 pr-14 text-base text-text-primary placeholder:text-text-tertiary focus:outline-none leading-relaxed"
            placeholder="Ask WISECRAFT anything..."
            disabled={isLoading}
            aria-label="Message WISECRAFT"
          />
          <button
            type="button"
            onClick={() => void handleSend()}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 bottom-3 p-2 rounded-lg bg-primary text-white hover:bg-primary-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-[10px] text-text-tertiary text-center mt-2">
          Your WISECRAFT mentor · Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
