import { Target, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Goals() {
  const profile = (() => {
    try {
      return JSON.parse(localStorage.getItem('wisecraft_profile') || '{}')
    } catch {
      return {}
    }
  })()

  const hasProfile = Object.keys(profile).length > 0

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Your goals</h1>
        <button type="button" className="btn btn-secondary text-sm py-2 px-3">
          <Plus size={16} />
          Add
        </button>
      </div>

      {hasProfile ? (
        <div className="glass-panel p-5 space-y-3">
          <p className="text-xs uppercase tracking-widest text-cyan-400/90">From onboarding</p>
          {profile.goal && (
            <div>
              <div className="text-xs text-slate-500">Main goal</div>
              <div className="text-sm font-medium">{profile.goal}</div>
            </div>
          )}
          {profile.capital && (
            <div>
              <div className="text-xs text-slate-500">Capital</div>
              <div className="text-sm font-medium">{profile.capital}</div>
            </div>
          )}
          {profile.time && (
            <div>
              <div className="text-xs text-slate-500">Time available</div>
              <div className="text-sm font-medium">{profile.time}</div>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-panel p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/15 flex items-center justify-center mx-auto text-violet-300">
            <Target size={22} />
          </div>
          <p className="text-sm text-slate-400">
            Complete personalization so WISECRAFT can coach you toward clear goals.
          </p>
          <Link to="/onboarding" className="btn btn-primary inline-flex">
            Start personalization
          </Link>
        </div>
      )}

      <p className="text-xs text-slate-600 text-center">
        Goal tracking and weekly reviews will connect here once the mentor engine is live.
      </p>
    </div>
  )
}
