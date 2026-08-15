import { Link } from 'react-router-dom'
import { MessageSquare, Target, Sparkles, ArrowRight } from 'lucide-react'

export function Home() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <section className="glass-panel p-6">
        <p className="text-xs uppercase tracking-widest text-cyan-400/90 mb-2">Your AI Mentor</p>
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          Build income. Grow your business. Get clearer with money.
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-5">
          WISECRAFT coaches you with practical steps grounded in real educational content from Trendorafinds — not generic advice.
        </p>
        <Link to="/chat" className="btn btn-primary w-full sm:w-auto">
          <MessageSquare size={18} />
          Start coaching
        </Link>
      </section>

      {/* Quick actions */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link to="/onboarding" className="glass-interactive p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-300 shrink-0">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="font-medium text-sm">Personalize</div>
            <div className="text-xs text-slate-500 mt-0.5">Tell us your goals, capital & skills</div>
          </div>
        </Link>
        <Link to="/goals" className="glass-interactive p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-300 shrink-0">
            <Target size={18} />
          </div>
          <div>
            <div className="font-medium text-sm">Your goals</div>
            <div className="text-xs text-slate-500 mt-0.5">Track progress over time</div>
          </div>
        </Link>
      </section>

      {/* Example prompts */}
      <section>
        <h2 className="text-sm font-medium text-slate-300 mb-3">Try asking</h2>
        <div className="space-y-2">
          {[
            'I have ₦20,000. What business can I start?',
            'How do I build an emergency fund in Nigeria?',
            'Best side hustles for a student with limited time?',
          ].map((q) => (
            <Link
              key={q}
              to={`/chat?q=${encodeURIComponent(q)}`}
              className="glass-card px-4 py-3 flex items-center justify-between gap-3 text-sm text-slate-300 hover:text-white transition"
            >
              <span className="line-clamp-1">{q}</span>
              <ArrowRight size={16} className="shrink-0 text-slate-500" />
            </Link>
          ))}
        </div>
      </section>

      <p className="text-center text-[11px] text-slate-600 pt-2">
        Powered by Trendorafinds · Trendora Inc
      </p>
    </div>
  )
}
