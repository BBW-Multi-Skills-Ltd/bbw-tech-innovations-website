import { useEffect, useState } from 'react'

export default function useDemoCarousel(length: number) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || length < 2) return
    const timer = window.setInterval(() => setActive(current => (current + 1) % length), 3200)
    return () => window.clearInterval(timer)
  }, [length, paused])

  const safeActive = length > 0 ? active % length : 0
  return { active: safeActive, setActive, setPaused }
}
