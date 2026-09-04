import { useEffect, useRef } from 'react'
import { createHeroPainters } from './heroCanvas'

export default function AnimatedHeroGrid({ dark }: { dark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    const painters = createHeroPainters(context, canvas, dark)
    let current = 0
    let next = 1
    let fading = false
    let phaseStart = performance.now()
    let animationFrame = 0

    const draw = (now: number) => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      const elapsed = now - phaseStart
      if (!fading) {
        painters[current](1)
        if (elapsed >= 3800) { fading = true; phaseStart = now }
      } else {
        const progress = Math.min(elapsed / 1100, 1)
        const eased = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress
        painters[current](1 - eased)
        painters[next](eased)
        if (progress >= 1) {
          current = next; next = (next + 1) % painters.length; fading = false; phaseStart = now
        }
      }
      animationFrame = requestAnimationFrame(draw)
    }
    animationFrame = requestAnimationFrame(draw)
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    return () => { cancelAnimationFrame(animationFrame); observer.disconnect() }
  }, [dark])

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', display: 'block' }} />
}
