import { NavLink, Outlet } from 'react-router-dom'
import { Home, MessageSquare, Target, Wrench, Settings } from 'lucide-react'

const nav = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/chat', label: 'Mentor', icon: MessageSquare },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/tools', label: 'Tools', icon: Wrench },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Layout() {
  return (
    <div className="min-h-dvh flex flex-col relative text-slate-100">
      <div className="bg-orbs" />

      {/* Header */}
      <header className="sticky top-0 z-20 glass-panel border-b border-white/[0.06] rounded-none">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center font-bold text-sm shadow-lg shadow-violet-900/40">
              W
            </div>
            <div>
              <div className="font-semibold leading-tight tracking-tight text-sm">WISECRAFT</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest">Trendora Inc</div>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 hidden sm:block">AI Mentor</div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 max-w-3xl w-full mx-auto px-4 py-4 pb-24">
        <Outlet />
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-30 border-t border-white/10 bg-[#0a0a0f]/95 backdrop-blur-xl safe-bottom">
        <div className="max-w-3xl mx-auto grid grid-cols-5 gap-0.5 px-1 pt-1.5 pb-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-1.5 rounded-lg text-[10px] font-medium transition ${
                  isActive ? 'text-violet-300' : 'text-slate-500 hover:text-slate-300'
                }`
              }
            >
              <Icon size={20} strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
