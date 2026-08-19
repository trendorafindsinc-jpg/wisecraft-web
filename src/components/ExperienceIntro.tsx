import { useEffect, useState } from 'react'
import { ArrowRight, Brain, BriefcaseBusiness, Coins, Sparkles, Target } from 'lucide-react'

type Stage = {
  label: string
  title: string
  description: string
  icon: typeof Brain
}

const STAGES: Stage[] = [
  {
    label: 'LEARN',
    title: 'Turn knowledge into practical skills.',
    description: 'Learn what matters, understand it clearly, and put it to work.',
    icon: Brain,
  },
  {
    label: 'BUILD',
    title: 'Turn skills into opportunities.',
    description: 'Find practical ways to create value, businesses, and income.',
    icon: BriefcaseBusiness,
  },
  {
    label: 'EARN',
    title: 'Build income around what you can do.',
    description: 'Make smarter decisions about work, pricing, selling, and growth.',
    icon: Coins,
  },
  {
    label: 'GROW',
    title: 'Build a stronger financial future.',
    description: 'Set goals, manage your money, and keep moving forward.',
    icon: Target,
  },
]

const TOTAL_MS = 10000
const STAGE_MS = 2500

type Props = {
  onComplete: () => void
}

export function ExperienceIntro({ onComplete }: Props) {
  const [stage, setStage] = useState(-1)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const startTimer = window.setTimeout(() => setStage(0), 250)

    const finishTimer = window.setTimeout(() => {
      setLeaving(true)
      window.setTimeout(onComplete, 500)
    }, TOTAL_MS)

    return () => {
      window.clearTimeout(startTimer)
      window.clearTimeout(finishTimer)
    }
  }, [onComplete])

  useEffect(() => {
    if (stage < 0 || stage >= STAGES.length - 1) return

    const timer = window.setTimeout(() => {
      setStage((current) => Math.min(current + 1, STAGES.length - 1))
    }, STAGE_MS)

    return () => window.clearTimeout(timer)
  }, [stage])

  function skip() {
    setLeaving(true)
    window.setTimeout(onComplete, 350)
  }

  const current = stage >= 0 ? STAGES[stage] : null
  const Icon = current?.icon ?? Sparkles
  const progress = stage < 0 ? 0 : ((stage + 1) / STAGES.length) * 100

  return (
    <div
      className={[
        'fixed inset-0 z-[9999] overflow-hidden bg-[#050507] text-white',
        'transition-opacity duration-500',
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100',
      ].join(' ')}
      role="dialog"
      aria-label="WISECRAFT introduction"
    >
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/20 blur-[100px]" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-[110px]" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-blue-600/10 blur-[100px]" />

        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:42px_42px]" />
      </div>

      <div className="relative flex min-h-dvh flex-col">
        <header className="flex items-center justify-between px-5 py-5 sm:px-8 sm:py-7">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.08] ring-1 ring-white/10">
              <Sparkles size={17} />
            </div>

            <span className="text-sm font-semibold tracking-[0.18em]">
              WISECRAFT
            </span>
          </div>

          <button
            type="button"
            onClick={skip}
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-slate-300 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
          >
            Skip
            <ArrowRight size={13} className="ml-1.5 inline" />
          </button>
        </header>

        <main className="flex flex-1 items-center justify-center px-5 pb-16">
          <div className="w-full max-w-3xl text-center">
            <div className="mb-8 flex justify-center sm:mb-10">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-[26px] border border-white/10 bg-white/[0.055] shadow-2xl shadow-violet-950/40 backdrop-blur-xl sm:h-24 sm:w-24">
                <div className="absolute inset-0 rounded-[26px] bg-gradient-to-br from-violet-500/20 to-cyan-400/10" />
                <Icon
                  key={stage}
                  size={34}
                  strokeWidth={1.6}
                  className="relative animate-pulse text-white"
                />
              </div>
            </div>

            <div className="min-h-[190px]">
              <p
                key={`label-${stage}`}
                className="mb-4 text-xs font-semibold tracking-[0.32em] text-violet-300 animate-[fadeIn_.6s_ease-out]"
              >
                {current?.label ?? 'WELCOME'}
              </p>

              <h1
                key={`title-${stage}`}
                className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-5xl sm:leading-[1.08] animate-[fadeIn_.7s_ease-out]"
              >
                {current?.title ?? 'Your growth starts here.'}
              </h1>

              <p
                key={`description-${stage}`}
                className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base animate-[fadeIn_.8s_ease-out]"
              >
                {current?.description ??
                  'A practical place to learn, build, earn, and grow.'}
              </p>
            </div>

            <div className="mx-auto mt-8 flex max-w-xs items-center justify-center gap-2">
              {STAGES.map((item, index) => (
                <div
                  key={item.label}
                  className={[
                    'h-1 flex-1 overflow-hidden rounded-full bg-white/10 transition-all duration-700',
                    index <= stage ? 'bg-white/70' : '',
                  ].join(' ')}
                />
              ))}
            </div>

            <p className="mt-6 text-[11px] tracking-wide text-slate-600">
              AI-powered guidance · practical tools · financial growth
            </p>
          </div>
        </main>

        <footer className="px-5 pb-5 text-center sm:px-8 sm:pb-7">
          <div className="mx-auto h-px max-w-xl bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <p className="mt-4 text-[10px] uppercase tracking-[0.22em] text-slate-700">
            Trendora Inc.
          </p>
        </footer>
      </div>
    </div>
  )
}
