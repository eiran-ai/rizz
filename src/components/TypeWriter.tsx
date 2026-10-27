import { useEffect, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface TypeWriterProps {
  text: string
  speed?: number
  delay?: number
  onComplete?: () => void
  className?: string
}

export function TypeWriter({
  text,
  speed = 40,
  delay = 0,
  onComplete,
  className = '',
}: TypeWriterProps) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) {
      setDisplayed(text)
      onComplete?.()
      return
    }

    const startTimer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(startTimer)
  }, [delay, reduced, text, onComplete])

  useEffect(() => {
    if (!started || reduced) return

    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        onComplete?.()
      }
    }, speed)

    return () => clearInterval(interval)
  }, [started, text, speed, reduced, onComplete])

  return (
    <span className={className}>
      {displayed}
      {started && displayed.length < text.length && (
        <span className="animate-pulse">_</span>
      )}
    </span>
  )
}
