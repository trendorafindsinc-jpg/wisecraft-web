import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../stores/app-store'
import {
  Search,
  MessageSquare,
  Target,
  Settings,
  Home,
  Wrench,
  BookOpen,
  Map,
  TrendingUp,
  PanelLeft,
} from 'lucide-react'

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const conversations = useAppStore((s) => s.conversations)
  const createConversation = useAppStore((s) => s.createConversation)
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const commands = [
    {
      icon: MessageSquare,
      label: 'New conversation',
      action: () => {
        const id = createConversation()
        navigate(`/chat/${id}`)
      },
    },
    { icon: Home, label: 'Open Home', action: () => navigate('/') },
    { icon: MessageSquare, label: 'Open Chat', action: () => navigate('/chat') },
    { icon: Target, label: 'Open Goals', action: () => navigate('/goals') },
    { icon: Map, label: 'Open Plans', action: () => navigate('/plans') },
    { icon: TrendingUp, label: 'Open Progress', action: () => navigate('/progress') },
    { icon: Wrench, label: 'Open Tools', action: () => navigate('/tools') },
    { icon: BookOpen, label: 'Open Knowledge', action: () => navigate('/knowledge') },
    { icon: Settings, label: 'Open Settings', action: () => navigate('/settings') },
    { icon: PanelLeft, label: 'Toggle sidebar', action: () => toggleSidebar() },
  ]

  const q = query.toLowerCase()
  const filteredCommands = commands.filter((c) =>
    c.label.toLowerCase().includes(q)
  )
  const filteredConversations = conversations
    .filter((c) => c.title.toLowerCase().includes(q) && !c.archived)
    .slice(0, 5)

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="w-full max-w-lg mx-4 bg-bg-surface border border-border rounded-xl overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-border px-4">
          <Search className="w-5 h-5 text-text-tertiary" aria-hidden />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-4 bg-transparent text-text-primary placeholder:text-text-tertiary focus:outline-none"
            placeholder="Search conversations or commands…"
            aria-label="Search"
          />
        </div>
        <div className="max-h-80 overflow-y-auto py-2">
          <div className="px-4 py-2 text-xs font-semibold text-text-tertiary uppercase">
            Commands
          </div>
          {filteredCommands.map((cmd, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                cmd.action()
                setIsOpen(false)
                setQuery('')
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-elevated transition-colors text-left"
            >
              <cmd.icon className="w-4 h-4 text-text-secondary" />
              <span className="text-text-primary">{cmd.label}</span>
            </button>
          ))}
          {filteredConversations.length > 0 && (
            <>
              <div className="px-4 py-2 mt-2 text-xs font-semibold text-text-tertiary uppercase">
                Conversations
              </div>
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => {
                    navigate(`/chat/${conv.id}`)
                    setIsOpen(false)
                    setQuery('')
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-elevated text-left"
                >
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span className="text-text-primary truncate">{conv.title}</span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
