import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import { Particles } from './components/Particles'
import { useName } from './hooks/useName'
import { usePhone } from './hooks/usePhone'
import { DateBuilderScene, type DatePlan } from './scenes/DateBuilderScene'
import { FinaleScene } from './scenes/FinaleScene'
import { IntroScene } from './scenes/IntroScene'
import { LetterScene } from './scenes/LetterScene'
import { QuestionScene } from './scenes/QuestionScene'

type Scene = 'intro' | 'letter' | 'question' | 'datepicker' | 'finale'
const FLOW: Scene[] = ['intro', 'letter', 'question', 'datepicker', 'finale']

export default function App() {
  const name = useName()
  const phone = usePhone()
  const [sceneIndex, setSceneIndex] = useState(0)
  const [datePlan, setDatePlan] = useState<DatePlan | null>(null)
  const scene = FLOW[sceneIndex]

  const advance = useCallback(() => {
    setSceneIndex(i => Math.min(i + 1, FLOW.length - 1))
  }, [])

  const handleDatePicked = useCallback((plan: DatePlan) => {
    setDatePlan(plan)
    advance()
  }, [advance])

  const replay = useCallback(() => {
    setDatePlan(null)
    setSceneIndex(0)
  }, [])

  return (
    <div className="relative w-full min-h-dvh overflow-hidden">
      <Particles />

      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="relative z-10"
        >
          {scene === 'intro' && <IntroScene name={name} onComplete={advance} />}
          {scene === 'letter' && <LetterScene name={name} onComplete={advance} />}
          {scene === 'question' && <QuestionScene name={name} onComplete={advance} />}
          {scene === 'datepicker' && <DateBuilderScene onComplete={handleDatePicked} />}
          {scene === 'finale' && datePlan && (
            <FinaleScene name={name} phone={phone} plan={datePlan} onReplay={replay} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
