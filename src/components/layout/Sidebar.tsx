import { NavLink, useNavigate } from 'react-router-dom'
import {
  MessageSquarePlus,
  MessageSquare,
  Target,
  Settings,
  PanelLeftClose,
  PanelLeft,
  Trash2,
  Home,
  Wrench,
  BookOpen,
  Map,
  TrendingUp,
  X,
} from 'lucide-react'
import { useAppStore } from '../../stores/app-store'
import { cn } from '../../lib/utils'

const NAV = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/chat', label: 'Chat', icon: MessageSquare },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/plans', label: 'Plans', icon: Map },
  { to: '/progress', label: 'Progress', icon: TrendingUp },
  { to: '/tools', label: 'Tools', icon: Wrench },
  { to: '/knowledge', label: 'Knowledge', icon: BookOpen },
] as const

export function Sidebar() {
  const navigate = useNavigate()
  const collapsed = useAppStore((s) => s.settings.sidebarCollapsed)
  const mobileOpen = useAppStore((s) => s.settings.mobileNavOpen)
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)
  const setMobileNavOpen = useAppStore((s) => s.setMobileNavOpen)
  const conversations = useAppStore((s) => s.conversations)
  const createConversation = useAppStore((s) => s.createConversation)
  const deleteConversation = useAppStore((s) => s.deleteConversation)
  const activeId = useAppStore((s) => s.activeConversationId)

  const recent = conversations.filter((c) => !c.archived).slice(0, 15)

  function newChat() {
    const id = createConversation()
    setMobileNavOpen(false)
    navigate(`/chat/${id}`)
  }

  function closeMobile() {
    setMobileNavOpen(false)
  }

  const shell = (
    <aside
      className={cn(
        'glass-floating flex h-full flex-col border-r border-border',
        'fixed inset-y-0 left-0 z-40 transition-transform duration-300 lg:translate-x-0',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        collapsed ? 'lg:w-16 w-72' : 'w-72 lg:w-64'
      )}
    >
      <div className="glass-control flex h-14 items-center gap-2 border-b border-border px-3">
        {(!collapsed || mobileOpen) && (
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold tracking-tight">WISECRAFT</div>
            <div className="text-[10px] uppercase tracking-widest text-text-tertiary">
              Trendora Inc
            </div>
          </div>
        )}
        <button
          type="button"
          className="p-2 rounded-lg text-text-secondary hover:bg-bg-elevated lg:hidden"
          onClick={closeMobile}
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
        <button
          type="button"
          onClick={toggleSidebar}
          className="hidden lg:inline-flex p-2 rounded-lg text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <div className="p-2">
        <button
          type="button"
          onClick={newChat}
          className={cn(
            'flex w-full items-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition',
            collapsed && !mobileOpen && 'lg:justify-center lg:px-2'
          )}
        >
          <MessageSquarePlus size={18} />
          {(!collapsed || mobileOpen) && 'New chat'}
        </button>
      </div>

      <nav className="px-2 space-y-0.5" aria-label="Main">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={!!end}
            onClick={closeMobile}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition',
                isActive
                  ? 'bg-bg-elevated text-text-primary'
                  : 'text-text-secondary hover:bg-bg-elevated/60 hover:text-text-primary',
                collapsed && !mobileOpen && 'lg:justify-center lg:px-2'
              )
            }
          >
            <Icon size={18} className="shrink-0" />
            {(!collapsed || mobileOpen) && label}
          </NavLink>
        ))}
      </nav>

      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {(!collapsed || mobileOpen) && (
          <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
            Recent
          </div>
        )}
        {recent.map((c) => (
          <div key={c.id} className="group relative">
            <NavLink
              to={`/chat/${c.id}`}
              onClick={closeMobile}
              className={cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition',
                activeId === c.id
                  ? 'bg-bg-elevated text-text-primary'
                  : 'text-text-secondary hover:bg-bg-elevated/60',
                collapsed && !mobileOpen && 'lg:justify-center lg:px-2'
              )}
            >
              <MessageSquare size={16} className="shrink-0" />
              {(!collapsed || mobileOpen) && (
                <span className="truncate">{c.title}</span>
              )}
            </NavLink>
            {(!collapsed || mobileOpen) && (
              <button
                type="button"
                onClick={() => deleteConversation(c.id)}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-red-400"
                aria-label={`Delete ${c.title}`}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-border p-2">
        <NavLink
          to="/settings"
          onClick={closeMobile}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-bg-elevated',
              isActive && 'bg-bg-elevated text-text-primary',
              collapsed && !mobileOpen && 'lg:justify-center lg:px-2'
            )
          }
        >
          <Settings size={18} />
          {(!collapsed || mobileOpen) && 'Settings'}
        </NavLink>
      </div>
    </aside>
  )

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          aria-label="Close menu overlay"
          onClick={closeMobile}
        />
      )}
      {shell}
    </>
  )
}
