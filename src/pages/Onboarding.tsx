import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft } from 'lucide-react'

const STEPS = [
  {
    key: 'goal',
    title: 'What is your main goal?',
    options: ['Start a business', 'Grow side income', 'Get better with money', 'Find remote / freelance work', 'Build emergency savings'],
  },
  {
    key: 'capital',
    title: 'How much capital can you work with right now?',
    options: ['Under ₦10,000', '₦10,000 – ₦50,000', '₦50,000 – ₦200,000', '₦200,000+', 'I mainly have time, not cash'],
  },
  {
    key: 'time',
    title: 'How much time can you put in weekly?',
    options: ['Under 5 hours', '5 – 15 hours', '15 – 30 hours', '30+ hours / full focus'],
  },
]

export function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const current = STEPS[step]
  const selected = answers[current.key]

  function select(option: string) {
    setAnswers((a) => ({ ...a, [current.key]: option }))
  }

  function next() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1)
    } else {
      // Save to localStorage for now
      localStorage.setItem('wisecraft_profile', JSON.stringify(answers))
      navigate('/chat')
    }
  }

  function back() {
    if (step > 0) setStep((s) => s - 1)
  }

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in">
      <div>
        <p className="text-xs text-slate-500 mb-1">
          Step {step + 1} of {STEPS.length}
        </p>
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <h1 className="text-xl font-semibold tracking-tight">{current.title}</h1>

      <div className="space-y-2">
        {current.options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => select(opt)}
            className={`w-full text-left px-4 py-3.5 rounded-xl text-sm transition border ${
              selected === opt
                ? 'bg-violet-600/20 border-violet-500/50 text-white'
                : 'glass-card border-transparent text-slate-300 hover:border-white/10'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        {step > 0 && (
          <button type="button" onClick={back} className="btn btn-secondary flex-1">
            <ArrowLeft size={16} />
            Back
          </button>
        )}
        <button
          type="button"
          onClick={next}
          disabled={!selected}
          className="btn btn-primary flex-1 disabled:opacity-40"
        >
          {step === STEPS.length - 1 ? 'Finish' : 'Continue'}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
