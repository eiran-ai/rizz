import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface ConfettiPiece {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  width: number
  height: number
  color: string
  gravity: number
}

const COLORS = ['#e11d63', '#8b5cf6', '#0ea5e9', '#fb7199', '#f59e0b', '#10b981']

export function Confetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!active || reduced) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const pieces: ConfettiPiece[] = []
    for (let i = 0; i < 120; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 200,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        width: Math.random() * 8 + 4,
        height: Math.random() * 4 + 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        gravity: 0.05 + Math.random() * 0.05,
      })
    }

    let animId: number
    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      let alive = false
      for (const p of pieces) {
        p.vy += p.gravity
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed

        if (p.y < canvas!.height + 50) alive = true

        ctx!.save()
        ctx!.translate(p.x, p.y)
        ctx!.rotate((p.rotation * Math.PI) / 180)
        ctx!.fillStyle = p.color
        ctx!.fillRect(-p.width / 2, -p.height / 2, p.width, p.height)
        ctx!.restore()
      }
      if (alive) animId = requestAnimationFrame(draw)
    }
    draw()

    return () => cancelAnimationFrame(animId)
  }, [active, reduced])

  if (!active || reduced) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      aria-hidden="true"
    />
  )
}
