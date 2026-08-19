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
    if (id) {
      setActiveConversation(id)
    }
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

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 md:px-0"
      >
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
