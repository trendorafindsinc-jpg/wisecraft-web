import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { ContextPanel } from './ContextPanel'
import { CommandPalette } from '../CommandPalette'
import { ExperienceIntro } from '../ExperienceIntro'
import { useAppStore } from '../../stores/app-store'
import { cn } from '../../lib/utils'
import { ThemeManager } from '../ThemeManager'

export function AppShell() {
  const [showIntro, setShowIntro] = useState(true)

  const sidebarCollapsed = useAppStore((s) => s.settings.sidebarCollapsed)
  const setMobileNavOpen = useAppStore((s) => s.setMobileNavOpen)

  return (
    <>
      <ThemeManager />
      {showIntro && (
        <ExperienceIntro onComplete={() => setShowIntro(false)} />
      )}

      <div className="flex h-dvh w-screen overflow-hidden bg-bg-app text-text-primary">
        <Sidebar />

        <div
          className={cn(
            'flex flex-1 flex-col min-w-0 overflow-hidden transition-[margin] duration-300',
            sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
          )}
        >
          {/* Mobile top bar */}
          <div className="flex h-12 items-center gap-2 border-b border-border px-3 lg:hidden">
            <button
              type="button"
              className="p-2 rounded-lg text-text-secondary hover:bg-bg-elevated"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            <span className="text-sm font-semibold">WISECRAFT</span>
          </div>

          <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <Outlet />
          </main>
        </div>

        <div className="hidden xl:block w-80 border-l border-border bg-bg-sidebar overflow-y-auto shrink-0">
          <ContextPanel />
        </div>

        <CommandPalette />
      </div>
    </>
  )
}
