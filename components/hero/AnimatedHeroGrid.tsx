'use client'

import { useEffect, useRef } from 'react'
import { createHeroPainters } from '@/components/hero/heroCanvas'
import { useSiteActions } from '@/components/home/SiteActions'
import { useReducedMotion } from '@/lib/useReducedMotion'

const HOLD_MS = 3800
const FADE_MS = 1100

/**
 * The animated background (grid, dots, diamonds, circles, crosses fading into
 * each other). Runs only while on screen; with reduced motion it draws one
 * still pattern. Redraws in the right colours when the theme changes.
 */
export default function AnimatedHeroGrid() {
  const { dark } = useSiteActions()
  const reduced = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    const painters = createHeroPainters(context, canvas, dark)

    let current = 0
    let next = 1
    let fading = false
    let phaseStart = performance.now()
    let animationFrame = 0
    let running = false

    const drawStill = () => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      painters[0](1)
    }
    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      // Resizing clears the canvas: repaint the still pattern straight away.
      if (reduced || !running) drawStill()
    }

    const draw = (now: number) => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      const elapsed = now - phaseStart
      if (!fading) {
        painters[current](1)
        if (elapsed >= HOLD_MS) { fading = true; phaseStart = now }
      } else {
        const progress = Math.min(elapsed / FADE_MS, 1)
        const eased = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress
        painters[current](1 - eased)
        painters[next](eased)
        if (progress >= 1) {
          current = next; next = (next + 1) % painters.length; fading = false; phaseStart = now
        }
      }
      animationFrame = requestAnimationFrame(draw)
    }

    const start = () => {
      if (running || reduced) return
      running = true
      canvas.dataset.running = 'true'
      // Resume the current pattern where it was, not mid-fade from long ago.
      phaseStart = performance.now()
      fading = false
      animationFrame = requestAnimationFrame(draw)
    }
    const stop = () => {
      running = false
      canvas.dataset.running = 'false'
      cancelAnimationFrame(animationFrame)
    }

    resize()
    const sizeObserver = new ResizeObserver(resize)
    sizeObserver.observe(canvas)
    // Off screen: no frames at all.
    const screenObserver = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    screenObserver.observe(canvas)

    return () => {
      stop()
      sizeObserver.disconnect()
      screenObserver.disconnect()
    }
  }, [dark, reduced])

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 block h-full w-full" />
}
