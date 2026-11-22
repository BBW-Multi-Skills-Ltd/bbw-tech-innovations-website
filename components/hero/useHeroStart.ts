'use client'

import { useEffect, useState, type RefObject } from 'react'
import { hasWebGL, wantsLive3D } from '@/components/logo3d/webgl'

/**
 * When the hero starts: the intro plays on the first frame, then the live 3D
 * loads when the browser is idle (desktop with WebGL only). Also whether the
 * hero is on screen, so the walk and 3D can pause.
 */
export function useHeroStart(section: RefObject<HTMLElement | null>) {
  const [introIn, setIntroIn] = useState(false)
  const [load3D, setLoad3D] = useState(false)
  const [noWebGL, setNoWebGL] = useState(false)
  const [onScreen, setOnScreen] = useState(true)

  useEffect(() => {
    let cancelIdle: (() => void) | undefined
    const frame = requestAnimationFrame(() => {
      setIntroIn(true)
      // Phones keep the still render; desktop loads the live 3D.
      const start = () => (wantsLive3D() ? setLoad3D(true) : !hasWebGL() && setNoWebGL(true))
      if (typeof window.requestIdleCallback === 'function') {
        const id = window.requestIdleCallback(start, { timeout: 1500 })
        cancelIdle = () => window.cancelIdleCallback(id)
      } else {
        const id = window.setTimeout(start, 150)
        cancelIdle = () => window.clearTimeout(id)
      }
    })
    return () => {
      cancelAnimationFrame(frame)
      cancelIdle?.()
    }
  }, [])

  useEffect(() => {
    const el = section.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting))
    observer.observe(el)
    return () => observer.disconnect()
  }, [section])

  return { introIn, load3D, noWebGL, onScreen }
}
