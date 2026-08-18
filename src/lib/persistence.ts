import type { Conversation, Goal, AppSettings } from '../types'

const KEYS = {
  CONVERSATIONS: 'wisecraft_conversations_v2',
  GOALS: 'wisecraft_goals_v2',
  SETTINGS: 'wisecraft_settings_v2',
  ONBOARDING: 'wisecraft_onboarding_v1',
  /** Legacy key from earlier WISECRAFT prototype — read-only bridge later */
  LEGACY_PROFILE: 'wisecraft_profile',
} as const

const defaultSettings: AppSettings = {
  theme: 'dark',
  sidebarCollapsed: false,
  mobileNavOpen: false,
}

export const persistence = {
  getConversations: (): Conversation[] => {
    try {
      return JSON.parse(localStorage.getItem(KEYS.CONVERSATIONS) || '[]')
    } catch {
      return []
    }
  },
  saveConversations: (data: Conversation[]) => {
    localStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(data))
  },

  getGoals: (): Goal[] => {
    try {
      return JSON.parse(localStorage.getItem(KEYS.GOALS) || '[]')
    } catch {
      return []
    }
  },
  saveGoals: (data: Goal[]) => {
    localStorage.setItem(KEYS.GOALS, JSON.stringify(data))
  },

  getSettings: (): AppSettings => {
    try {
      return {
        ...defaultSettings,
        ...JSON.parse(localStorage.getItem(KEYS.SETTINGS) || '{}'),
      }
    } catch {
      return { ...defaultSettings }
    }
  },
  saveSettings: (data: AppSettings) => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(data))
  },

  isOnboarded: () => localStorage.getItem(KEYS.ONBOARDING) === 'true',
  setOnboarded: () => localStorage.setItem(KEYS.ONBOARDING, 'true'),

  /** Existing prototype may have stored a simple profile object */
  getLegacyProfile: (): Record<string, string> | null => {
    try {
      const raw = localStorage.getItem(KEYS.LEGACY_PROFILE)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },
}
