import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type { Conversation, Goal, AppSettings, Message, ChatSource } from '../types'
import { persistence } from '../lib/persistence'

interface AppState {
  conversations: Conversation[]
  activeConversationId: string | null
  goals: Goal[]
  settings: AppSettings
  isOnboarded: boolean

  createConversation: (title?: string) => string
  setActiveConversation: (id: string | null) => void
  addMessage: (
    convId: string,
    role: 'user' | 'assistant',
    content: string,
    extras?: Partial<Message>
  ) => string
  setMessageContent: (
    convId: string,
    msgId: string,
    content: string,
    status?: Message['status'],
    sources?: ChatSource[]
  ) => void
  updateConversationTitle: (id: string, title: string) => void
  deleteConversation: (id: string) => void
  toggleSidebar: () => void
  setMobileNavOpen: (open: boolean) => void
  setTheme: (theme: AppSettings['theme']) => void
  setOnboarded: () => void
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'progress' | 'milestones' | 'status'> & Partial<Goal>) => string
}

function loadInitial() {
  if (typeof window === 'undefined') {
    return {
      conversations: [] as Conversation[],
      goals: [] as Goal[],
      settings: {
        theme: 'dark' as const,
        sidebarCollapsed: false,
        mobileNavOpen: false,
      },
      isOnboarded: false,
    }
  }
  return {
    conversations: persistence.getConversations(),
    goals: persistence.getGoals(),
    settings: persistence.getSettings(),
    isOnboarded: persistence.isOnboarded(),
  }
}

const initial = loadInitial()

export const useAppStore = create<AppState>((set, get) => ({
  conversations: initial.conversations,
  activeConversationId: null,
  goals: initial.goals,
  settings: initial.settings,
  isOnboarded: initial.isOnboarded,

  createConversation: (title = 'New Mentorship') => {
    const id = uuidv4()
    const newConv: Conversation = {
      id,
      title,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
      starred: false,
      archived: false,
    }
    set((state) => {
      const updated = [newConv, ...state.conversations]
      persistence.saveConversations(updated)
      return { conversations: updated, activeConversationId: id }
    })
    return id
  },

  setActiveConversation: (id) => set({ activeConversationId: id }),

  addMessage: (convId, role, content, extras = {}) => {
    const msgId = uuidv4()
    set((state) => {
      const updated = state.conversations.map((c) => {
        if (c.id !== convId) return c
        const msg: Message = {
          id: msgId,
          role,
          content,
          timestamp: Date.now(),
          status: extras.status || 'complete',
          sources: extras.sources,
        }
        return {
          ...c,
          updatedAt: Date.now(),
          messages: [...c.messages, msg],
        }
      })
      persistence.saveConversations(updated)
      return { conversations: updated }
    })
    return msgId
  },

  setMessageContent: (convId, msgId, content, status, sources) => {
    set((state) => {
      const updated = state.conversations.map((c) => {
        if (c.id !== convId) return c
        return {
          ...c,
          updatedAt: Date.now(),
          messages: c.messages.map((m) =>
            m.id === msgId
              ? {
                  ...m,
                  content,
                  status: status ?? m.status,
                  sources: sources !== undefined ? sources : m.sources,
                }
              : m
          ),
        }
      })
      persistence.saveConversations(updated)
      return { conversations: updated }
    })
  },

  updateConversationTitle: (id, title) =>
    set((state) => {
      const updated = state.conversations.map((c) =>
        c.id === id ? { ...c, title } : c
      )
      persistence.saveConversations(updated)
      return { conversations: updated }
    }),

  deleteConversation: (id) =>
    set((state) => {
      const updated = state.conversations.filter((c) => c.id !== id)
      persistence.saveConversations(updated)
      return {
        conversations: updated,
        activeConversationId:
          state.activeConversationId === id ? null : state.activeConversationId,
      }
    }),

  toggleSidebar: () =>
    set((state) => {
      const newSettings = {
        ...state.settings,
        sidebarCollapsed: !state.settings.sidebarCollapsed,
      }
      persistence.saveSettings(newSettings)
      return { settings: newSettings }
    }),

  setMobileNavOpen: (open) =>
    set((state) => ({
      settings: { ...state.settings, mobileNavOpen: open },
    })),

  setTheme: (theme) =>
    set((state) => {
      const newSettings = {
        ...state.settings,
        theme,
      }

      persistence.saveSettings(newSettings)
      return { settings: newSettings }
    }),

  setOnboarded: () => {
    persistence.setOnboarded()
    set({ isOnboarded: true })
  },

  addGoal: (partial) => {
    const id = uuidv4()
    const goal: Goal = {
      id,
      title: partial.title,
      category: partial.category || 'General',
      target: partial.target || '',
      deadline: partial.deadline,
      milestones: partial.milestones || [],
      progress: partial.progress ?? 0,
      status: partial.status || 'active',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    set((state) => {
      const updated = [goal, ...state.goals]
      persistence.saveGoals(updated)
      return { goals: updated }
    })
    return id
  },
}))
