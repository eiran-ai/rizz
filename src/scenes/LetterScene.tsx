import { motion } from 'framer-motion'
import { useRef } from 'react'

interface Props {
  name: string
  onComplete: () => void
}

export function LetterScene({ name, onComplete }: Props) {
  const doneRef = useRef(false)

  function handleContinue() {
    if (doneRef.current) return
    doneRef.current = true
    onComplete()
  }

  const paragraphs = [
    `Look, ${name}.`,
    `I could've just texted. "hey wanna hang?"`,
    `Two seconds. Zero effort. Completely forgettable.`,
    `But that felt wrong for someone who makes me forget\nwhat I was saying mid-sentence.`,
    `So I built this instead.`,
    `Entirely rational decision. I stand by it.`,
  ]

  const closing = `I think you're genuinely cool.\nAnd I'd really like to take you out — one evening,\nmy effort, your smile.`

  return (
    <div className="w-full min-h-dvh flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Paper card */}
        <div
          className="bg-white rounded-2xl shadow-xl p-8 md:p-10 relative overflow-hidden"
          style={{ boxShadow: '0 8px 40px rgba(232,85,90,0.08), 0 2px 8px rgba(0,0,0,0.04)' }}
        >
          {/* Top stripe */}
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-coral via-plum to-coral-light" />

          {/* Letter content */}
          <div className="space-y-4">
            {paragraphs.map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.35, duration: 0.5 }}
                className={`whitespace-pre-line leading-relaxed ${
                  i === 0
                    ? 'text-2xl font-semibold text-ink'
                    : i === paragraphs.length - 1
                    ? 'text-ink font-semibold text-lg'
                    : 'text-ink-muted'
                }`}
                style={{
                  fontFamily: i === 0 ? 'var(--font-display)' : 'var(--font-body)',
                  fontStyle: i === 0 ? 'italic' : 'normal',
                }}
              >
                {para}
              </motion.p>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + paragraphs.length * 0.35 + 0.2 }}
              className="pt-2 border-t border-gray-100"
            >
              <p
                className="text-ink whitespace-pre-line leading-relaxed text-base"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {closing}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + paragraphs.length * 0.35 + 1.0 }}
              className="pt-2 text-sm text-ink-soft italic"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              — Eiran
            </motion.div>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + paragraphs.length * 0.35 + 2.0 }}
          className="mt-8 text-center"
        >
          <motion.button
            onClick={handleContinue}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-coral to-plum text-white font-semibold text-sm tracking-wide cursor-pointer shadow-lg"
            style={{
              fontFamily: 'var(--font-body)',
              animation: 'pulse-soft 2.5s ease-in-out infinite',
            }}
          >
            Okay fine, what's the question? →
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}
