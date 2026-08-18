import { Wrench } from 'lucide-react'
import { PlaceholderPage } from '../components/PlaceholderPage'

export default function Tools() {
  return (
    <PlaceholderPage
      title="Tools"
      icon={<Wrench className="text-accent" size={22} />}
      description="Practical helpers (validators, calculators, opportunity finder) from the existing WISECRAFT Tools experience will plug in here during integration — not simulated in this package."
    />
  )
}
rtunity Finder', desc: 'Match skills and capital to real opportunities', soon: true },
]

export function Tools() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Tools</h1>
        <p className="text-sm text-slate-500 mt-1">Practical helpers that sit beside your AI mentor</p>
      </div>

      <div className="grid gap-3">
        {tools.map((t) => (
          <div key={t.title} className="glass-card p-4 flex items-start gap-3 opacity-90">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-cyan-300 shrink-0">
              <t.icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{t.title}</span>
                {t.soon && (
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">
                    Soon
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
