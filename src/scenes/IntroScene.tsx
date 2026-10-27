import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface Props {
  name: string
  onComplete: () => void
}

type Phase = 'typing' | 'tagline' | 'envelope' | 'done'

export function IntroScene({ name, onComplete }: Props) {
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState<Phase>('typing')
  const [envelopeOpen, setEnvelopeOpen] = useState(false)
  const doneRef = useRef(false)

  useEffect(() => {
    let i = 0
    const typeTimer = setInterval(() => {
      i++
      setDisplayed(name.slice(0, i))
      if (i >= name.length) {
        clearInterval(typeTimer)
        setTimeout(() => setPhase('tagline'), 500)
        setTimeout(() => setPhase('envelope'), 1400)
      }
    }, 110)
    return () => clearInterval(typeTimer)
  }, [name])

  function handleEnvelope() {
    if (doneRef.current) return
    doneRef.current = true
    setEnvelopeOpen(true)
    setTimeout(onComplete, 750)
  }

  return (
    <div className="w-full min-h-dvh flex items-center justify-center px-6">
      <div className="text-center max-w-md mx-auto">

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-ink-soft text-base mb-3"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Hi,
        </motion.p>

        <h1
          className="text-6xl md:text-8xl font-bold text-ink leading-none mb-2 min-h-[1.2em]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {displayed}
          {displayed.length < name.length && (
            <span className="inline-block w-1 h-16 md:h-20 bg-coral ml-1 animate-pulse align-middle" />
          )}
          {displayed.length === name.length && displayed.length > 0 && '.'}
        </h1>

        <AnimatePresence>
          {(phase === 'tagline' || phase === 'envelope') && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-ink-muted text-base mt-4"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Someone made something for you.
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === 'envelope' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 12, delay: 0.1 }}
              className="mt-10 flex flex-col items-center gap-4"
            >
              <motion.button
                onClick={handleEnvelope}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="cursor-pointer focus:outline-none"
                style={{ animation: 'float 4s ease-in-out infinite' }}
                aria-label="Open envelope"
              >
                <EnvelopeSVG open={envelopeOpen} />
              </motion.button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-ink-soft text-sm"
              >
                tap to open
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}

function EnvelopeSVG({ open }: { open: boolean }) {
  return (
    <svg width="120" height="88" viewBox="0 0 120 88" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Envelope body */}
      <rect x="3" y="22" width="114" height="63" rx="7" fill="white" stroke="#F0CDCD" strokeWidth="2" />

      {/* Bottom fold lines */}
      <line x1="3" y1="85" x2="48" y2="54" stroke="#F0CDCD" strokeWidth="1.5" />
      <line x1="117" y1="85" x2="72" y2="54" stroke="#F0CDCD" strokeWidth="1.5" />

      {/* Flap */}
      <motion.path
        d={open
          ? 'M 3 22 L 60 2 L 117 22'
          : 'M 3 22 L 60 52 L 117 22'
        }
        fill={open ? '#FFF0F0' : 'white'}
        stroke="#F0CDCD"
        strokeWidth="2"
        animate={{
          d: open ? 'M 3 22 L 60 2 L 117 22' : 'M 3 22 L 60 52 L 117 22'
        }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      />

      {/* Wax seal — only when closed */}
      {!open && (
        <>
          <circle cx="60" cy="54" r="13" fill="#E8555A" />
          <text x="60" y="59" textAnchor="middle" fontSize="11" fill="white" fontFamily="serif">♥</text>
        </>
      )}

      {/* Paper peek when opened */}
      {open && (
        <motion.rect
          initial={{ y: 60 }}
          animate={{ y: 42 }}
          x="30" y="42" width="60" height="30" rx="3"
          fill="#FFF8F3"
          stroke="#F0CDCD"
          strokeWidth="1"
          transition={{ delay: 0.3, duration: 0.4 }}
        />
      )}
    </svg>
  )
}
