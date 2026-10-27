import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'

interface Props {
  onComplete: (plan: DatePlan) => void
}

export interface DatePlan {
  where: 'coffee' | 'dinner' | 'picnic'
  when: 'afternoon' | 'evening'
  vibe: 'chill' | 'special'
}

type Step = 'where' | 'when' | 'vibe' | 'done'

interface Choice<T extends string> {
  value: T
  emoji: string
  label: string
  desc: string
}

const WHERE_CHOICES: Choice<DatePlan['where']>[] = [
  { value: 'coffee', emoji: '☕', label: 'Coffee', desc: 'Low-key. We talk for 3 hours and forget to check our phones.' },
  { value: 'dinner', emoji: '🍝', label: 'Dinner', desc: "Proper date energy. I'll even iron a shirt." },
  { value: 'picnic', emoji: '🧺', label: 'Picnic', desc: "Snacks, golden hour, good vibes. You'll look incredible." },
]

const WHEN_CHOICES: Choice<DatePlan['when']>[] = [
  { value: 'afternoon', emoji: '☀️', label: 'Afternoon', desc: 'Golden hour light. Everything looks better.' },
  { value: 'evening', emoji: '🌙', label: 'Evening', desc: 'City lights. Slightly mysterious. Very us.' },
]

const VIBE_CHOICES: Choice<DatePlan['vibe']>[] = [
  { value: 'chill', emoji: '😌', label: 'Keep it chill', desc: 'Just us, easy conversation, no pressure.' },
  { value: 'special', emoji: '✨', label: 'Make it a moment', desc: "We dress up, we feel great, we deserve it." },
]

const DATE_SUMMARIES: Record<string, string> = {
  'coffee-afternoon-chill': "Coffee in the afternoon. No rush, no agenda. Just talking until they kick us out.",
  'coffee-afternoon-special': "Coffee date, but elevated. We actually get dressed. You'll look unfair.",
  'coffee-evening-chill': "Evening coffee — underrated move. The whole place feels different after dark.",
  'coffee-evening-special': "Fancy coffee spot at night? That's a vibe. That's actually a vibe.",
  'dinner-afternoon-chill': "Early dinner, totally low-key. Best kept secret in dating.",
  'dinner-afternoon-special': "Lunch that becomes dinner because we lost track of time.",
  'dinner-evening-chill': "Dinner in the evening. Classic for a reason. I'll be nervous in a good way.",
  'dinner-evening-special': "Dinner. Evening. Dressed up. That's just a movie plot at this point.",
  'picnic-afternoon-chill': "Afternoon picnic. Snacks, a blanket, that golden hour light hitting just right.",
  'picnic-afternoon-special': "A proper picnic setup. Champagne optional. You being there: mandatory.",
  'picnic-evening-chill': "Sunset picnic — genuinely one of my better ideas.",
  'picnic-evening-special': "Picnic under the evening sky with everything set up just right. You'll remember it.",
}

export function DateBuilderScene({ onComplete }: Props) {
  const [step, setStep] = useState<Step>('where')
  const [plan, setPlan] = useState<Partial<DatePlan>>({})
  const doneRef = useRef(false)

  function choose<K extends keyof DatePlan>(key: K, value: DatePlan[K]) {
    const next = { ...plan, [key]: value }
    setPlan(next)

    if (key === 'where') setTimeout(() => setStep('when'), 400)
    else if (key === 'when') setTimeout(() => setStep('vibe'), 400)
    else if (key === 'vibe') {
      setTimeout(() => setStep('done'), 400)
    }
  }

  function handleContinue() {
    if (doneRef.current || !plan.where || !plan.when || !plan.vibe) return
    doneRef.current = true
    onComplete(plan as DatePlan)
  }

  const summaryKey = plan.where && plan.when && plan.vibe
    ? `${plan.where}-${plan.when}-${plan.vibe}`
    : null

  const stepLabel = { where: 'Where?', when: 'When?', vibe: 'Your call.' }
  const stepHint = {
    where: "Pick the setting.",
    when: "Pick the time.",
    vibe: "Set the tone.",
  }

  return (
    <div className="w-full min-h-dvh flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <p className="text-ink-soft text-sm mb-1" style={{ fontFamily: 'var(--font-body)' }}>
            You said yes.
          </p>
          <h2
            className="text-3xl font-bold text-ink"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Let's plan this.
          </h2>
        </motion.div>

        <AnimatePresence mode="wait">
          {step !== 'done' && (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              <div className="mb-5 text-center">
                <p className="text-lg font-semibold text-ink" style={{ fontFamily: 'var(--font-body)' }}>
                  {stepLabel[step as keyof typeof stepLabel]}
                </p>
                <p className="text-ink-soft text-sm">{stepHint[step as keyof typeof stepHint]}</p>
              </div>

              <div className="space-y-3">
                {step === 'where' && WHERE_CHOICES.map(c => (
                  <ChoiceCard
                    key={c.value}
                    choice={c}
                    selected={plan.where === c.value}
                    onSelect={() => choose('where', c.value)}
                  />
                ))}
                {step === 'when' && WHEN_CHOICES.map(c => (
                  <ChoiceCard
                    key={c.value}
                    choice={c}
                    selected={plan.when === c.value}
                    onSelect={() => choose('when', c.value)}
                  />
                ))}
                {step === 'vibe' && VIBE_CHOICES.map(c => (
                  <ChoiceCard
                    key={c.value}
                    choice={c}
                    selected={plan.vibe === c.value}
                    onSelect={() => choose('vibe', c.value)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {step === 'done' && summaryKey && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div
                className="bg-white rounded-2xl p-8 shadow-xl relative overflow-hidden"
                style={{ boxShadow: '0 8px 40px rgba(232,85,90,0.08)' }}
              >
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-coral via-plum to-coral-light" />

                <p className="text-3xl mb-4">
                  {plan.where === 'coffee' ? '☕' : plan.where === 'dinner' ? '🍝' : '🧺'}
                  {plan.when === 'afternoon' ? ' ☀️' : ' 🌙'}
                  {plan.vibe === 'special' ? ' ✨' : ''}
                </p>

                <p
                  className="text-ink text-base leading-relaxed mb-2"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {DATE_SUMMARIES[summaryKey]}
                </p>

                <p className="text-ink-soft text-sm mt-4" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
                  You, me, {plan.when === 'afternoon' ? 'afternoon' : 'evening'}. That's the plan.
                </p>
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={handleContinue}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="mt-8 px-8 py-3.5 rounded-full bg-gradient-to-r from-coral to-plum text-white font-semibold text-sm cursor-pointer shadow-lg"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                I'm in. →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step progress dots */}
        {step !== 'done' && (
          <div className="flex justify-center gap-2 mt-8">
            {(['where', 'when', 'vibe'] as Step[]).map((s) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'bg-coral scale-125'
                    : (step === 'when' && s === 'where') || (step === 'vibe' && s !== 'vibe')
                    ? 'bg-coral/30'
                    : 'bg-ink/10'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ChoiceCard<T extends string>({
  choice,
  selected,
  onSelect,
}: {
  choice: Choice<T>
  selected: boolean
  onSelect: () => void
}) {
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
        selected
          ? 'border-coral bg-coral/5'
          : 'border-transparent bg-white hover:border-ink/10'
      }`}
      style={{ boxShadow: selected ? '0 4px 20px rgba(232,85,90,0.1)' : '0 2px 8px rgba(0,0,0,0.04)' }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{choice.emoji}</span>
        <div>
          <p
            className={`font-semibold text-sm ${selected ? 'text-coral' : 'text-ink'}`}
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {choice.label}
          </p>
          <p className="text-ink-soft text-xs mt-0.5 leading-snug" style={{ fontFamily: 'var(--font-body)' }}>
            {choice.desc}
          </p>
        </div>
        {selected && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto text-coral text-sm font-bold"
          >
            ✓
          </motion.span>
        )}
      </div>
    </motion.button>
  )
}
