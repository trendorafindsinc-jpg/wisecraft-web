export type ChatSource = {
  title: string
  link: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  status?: 'pending' | 'complete' | 'error'
  sources?: ChatSource[]
}

export interface Conversation {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  messages: Message[]
  starred: boolean
  archived: boolean
  goalId?: string
}

export interface Milestone {
  id: string
  title: string
  completed: boolean
}

export interface Goal {
  id: string
  title: string
  category: string
  target: string
  deadline?: string
  milestones: Milestone[]
  progress: number
  status: 'active' | 'completed' | 'paused'
  createdAt: number
  updatedAt: number
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'system'
  sidebarCollapsed: boolean
  mobileNavOpen: boolean
}
