import { Link } from 'react-router-dom'

export function Settings() {
  function clearProfile() {
    localStorage.removeItem('wisecraft_profile')
    window.location.reload()
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-md">
      <h1 className="text-xl font-semibold tracking-tight">Settings</h1>

      <section className="glass-panel p-5 space-y-4">
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Product</div>
          <div className="font-medium">WISECRAFT</div>
          <div className="text-sm text-slate-400">AI Mentor · Trendora Inc</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Knowledge source</div>
          <div className="text-sm text-slate-300">Trendorafinds.WordPress.com</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Design</div>
          <div className="text-sm text-slate-300">Trendora Design System (TDS) v1</div>
        </div>
      </section>

      <section className="space-y-2">
        <Link to="/onboarding" className="btn btn-secondary w-full justify-start">
          Re-run personalization
        </Link>
        <button type="button" onClick={clearProfile} className="btn btn-secondary w-full justify-start text-rose-300/90">
          Clear local profile
        </button>
      </section>

      <p className="text-[11px] text-slate-600 text-center pt-4">
        Version 0.1.0 · Web preview · Capacitor-ready later
      </p>
    </div>
  )
}
