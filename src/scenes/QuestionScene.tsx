import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useRef, useState } from 'react'

interface Props {
  name: string
  onComplete: () => void
}

const NO_STAGES = [
  { label: 'No', size: 1.0 },
  { label: 'nope', size: 0.95 },
  { label: 'uh uh', size: 0.88 },
  { label: '...no', size: 0.78 },
  { label: 'leave me alone', size: 0.65 },
  { label: 'please don\'t', size: 0.52 },
  { label: 'i give up', size: 0.38 },
  { label: '🏳️', size: 0.28 },
]

const RIZZ_LINES = [
  { line: null, sub: null },
  {
    line: 'Are you a parking ticket?',
    sub: 'Because you\'ve got fine written all over you.',
  },
  {
    line: 'If I could rearrange the alphabet,',
    sub: 'I\'d put U and I together.',
  },
  {
    line: 'Is your name Wi-Fi?',
    sub: 'Because I\'m feeling a serious connection.',
  },
  {
    line: 'Do you have a map?',
    sub: 'I just got lost in your eyes.',
  },
  {
    line: 'I\'m not a photographer,',
    sub: 'but I can definitely picture us together.',
  },
  {
    line: 'Are you a magician?',
    sub: 'Because when I look at you, everyone else disappears.',
  },
  {
    line: 'Even the button gave up.',
    sub: 'Maybe take the hint? 👀',
  },
]

export function QuestionScene({ name, onComplete }: Props) {
  const [attempts, setAttempts] = useState(0)
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null)
  const [surrendered, setSurrendered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const cooldownRef = useRef(false)
  const doneRef = useRef(false)

  const getRandomPos = useCallback(() => {
    const el = containerRef.current
    if (!el) return { x: 50, y: 50 }
    const { width, height } = el.getBoundingClientRect()
    const margin = 80
    return {
      x: margin + Math.random() * (width - margin * 2 - 110),
      y: margin + Math.random() * (height - margin * 2 - 48),
    }
  }, [])

  const handleNoDodge = useCallback(() => {
    if (cooldownRef.current) return
    cooldownRef.current = true
    setTimeout(() => { cooldownRef.current = false }, 600)

    const next = attempts + 1
    setAttempts(next)

    if (next >= NO_STAGES.length) {
      setSurrendered(true)
      return
    }

    setNoPos(getRandomPos())
  }, [attempts, getRandomPos])

  const handleYes = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    onComplete()
  }, [onComplete])

  const stage = NO_STAGES[Math.min(attempts, NO_STAGES.length - 1)]
  const rizz = RIZZ_LINES[Math.min(attempts, RIZZ_LINES.length - 1)]
  const yesScale = 1 + Math.min(attempts, 7) * 0.09

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-dvh flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      {/* Main question */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 max-w-sm"
      >
        <p className="text-ink-soft text-base mb-3" style={{ fontFamily: 'var(--font-body)' }}>
          {name},
        </p>
        <h2
          className="text-3xl md:text-5xl font-bold text-ink leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Will you go on a date with me?
        </h2>
      </motion.div>

      {/* Rizz line reactions */}
      <div className="h-14 flex items-center justify-center mb-8">
        <AnimatePresence mode="wait">
          {rizz?.line && (
            <motion.div
              key={attempts}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.35 }}
              className="text-center px-4"
            >
              <p className="text-coral font-semibold text-sm md:text-base italic" style={{ fontFamily: 'var(--font-display)' }}>
                "{rizz.line}
              </p>
              <p className="text-coral/80 text-sm italic" style={{ fontFamily: 'var(--font-display)' }}>
                {rizz.sub}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* YES button — static, grows with each NO */}
      <motion.button
        animate={{ scale: yesScale }}
        whileHover={{ scale: yesScale * 1.06 }}
        whileTap={{ scale: yesScale * 0.94 }}
        onClick={handleYes}
        className="relative z-10 px-10 py-4 rounded-full bg-gradient-to-r from-coral to-plum text-white font-semibold text-lg cursor-pointer shadow-xl"
        style={{
          fontFamily: 'var(--font-body)',
          animation: 'pulse-soft 2s ease-in-out infinite',
        }}
      >
        Yes!
        {attempts >= 4 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 text-xs bg-amber-400 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold"
          >
            ✓
          </motion.span>
        )}
      </motion.button>

      {/* Surrendered — second YES */}
      <AnimatePresence>
        {surrendered && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            onClick={handleYes}
            className="mt-4 px-8 py-3 rounded-full border-2 border-coral text-coral font-semibold cursor-pointer"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Also yes! (the button surrendered)
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating NO button */}
      {!surrendered && (
        <motion.button
          key={`no-${attempts}`}
          initial={noPos ? { opacity: 0, scale: 0.6 } : { opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: stage.size }}
          style={
            noPos
              ? {
                  position: 'absolute',
                  left: noPos.x,
                  top: noPos.y,
                  fontFamily: 'var(--font-body)',
                }
              : {
                  position: 'relative',
                  marginTop: '16px',
                  fontFamily: 'var(--font-body)',
                }
          }
          onMouseEnter={handleNoDodge}
          onClick={handleNoDodge}
          className="px-7 py-3 rounded-full border border-ink/10 text-ink-muted text-sm cursor-pointer hover:border-ink/20 z-20 bg-white/80 backdrop-blur-sm"
        >
          {stage.label}
        </motion.button>
      )}

      {/* Hint after 4 attempts */}
      {attempts >= 4 && !surrendered && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.45 }}
          className="absolute bottom-8 text-xs text-ink-soft text-center"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          psst... the YES button is literally right there
        </motion.p>
      )}
    </div>
  )
}
