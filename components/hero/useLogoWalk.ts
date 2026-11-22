'use client'

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from 'react'
import type { LogoPose } from '@/components/logo3d/HeroLogoScene'
import { logoSize } from './logo-size'

// Behaviour tuning (same as the portfolio's hero; the yaw is smaller because
// the BBW logo is twice as wide as it is tall).
const START_DISTANCE = 50 // px: start walking when the target is further than this
const ARRIVE_DISTANCE = 14 // px: arrived, say hello
const MAX_YAW = 0.7 // rad, turned toward the direction of travel
const TURN_TAU = 0.09 // s: ~0.26s to turn
const MAX_LEAN = (2 * Math.PI) / 180
const IDLE_SPIN_AFTER = 6.5 // s
const SPIN_DURATION = 2.6 // s
const HELLO_DURATION = 0.75 // s
const BUBBLE_MS = 2400
const DUST_EVERY = 0.12 // s
export const DUST_PUFFS = 8

type Mode = 'rest' | 'walk' | 'hello'

const ease = (dt: number, tau: number) => 1 - Math.exp(-dt / tau)
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

type Options = {
  section: RefObject<HTMLElement | null>
  /** The intro has started (the idle spin counts from then). */
  introIn: boolean
  /** Runs only while the hero is on screen. */
  onScreen: boolean
  reduced: boolean
  greetings: string[]
}

/**
 * The hero logo's walk: it stands on the floor, follows a drag (click or
 * touch and hold), walks the rest of the way when let go and says hello,
 * spins once when idle. Each frame it writes every DOM layer (still logo,
 * shadow, dust, bubble, giant letters) and the pose the 3D scene reads.
 */
export function useLogoWalk({ section, introIn, onScreen, reduced, greetings }: Options) {
  const refs = {
    floorRef: useRef<HTMLDivElement>(null),
    lettersRef: useRef<(HTMLSpanElement | null)[]>([]),
    flatRef: useRef<HTMLDivElement>(null),
    shadowRef: useRef<HTMLDivElement>(null),
    bubbleRef: useRef<HTMLDivElement>(null),
    dustRef: useRef<(HTMLSpanElement | null)[]>([]),
    grabRef: useRef<HTMLDivElement>(null),
  }
  const { floorRef, lettersRef: letters, flatRef: flat, shadowRef: shadow, bubbleRef: bubble, dustRef: dust, grabRef: grab } = refs

  const pose = useRef<LogoPose>({ x: 0, floor: 0, height: 0, yaw: 0, lean: 0, tilt: 0, hop: 0 })
  const target = useRef<number | null>(null)
  const drag = useRef({ active: false, offset: 0, released: false })
  const lastInput = useRef(0)
  /** Being dragged (keeps the 3D redrawing with reduced motion). */
  const [held, setHeld] = useState(false)

  // The idle timer starts with the intro.
  useEffect(() => {
    if (introIn) lastInput.current = performance.now()
  }, [introIn])

  useEffect(() => {
    const el = section.current
    const floorEl = floorRef.current
    if (!el || !floorEl || !onScreen) return

    const layout = { w: 0, h: 0, floor: 0, logoH: 0, logoW: 0, margin: 16 }
    const measure = () => {
      const box = el.getBoundingClientRect()
      layout.w = el.clientWidth
      layout.h = el.clientHeight
      layout.floor = floorEl.getBoundingClientRect().top - box.top
      Object.assign(layout, logoSize(layout.w, layout.h, layout.floor))
    }
    measure()
    const resize = new ResizeObserver(measure)
    resize.observe(el)

    const s = {
      x: layout.w - (layout.logoW / 2 + layout.margin),
      vx: 0,
      yaw: 0,
      lean: 0,
      tilt: 0,
      mode: 'rest' as Mode,
      helloT: 0,
      spinT: -1,
      dustT: 0,
      dustNext: 0,
      greeting: 0,
      bubbleUntil: 0,
    }
    lastInput.current = performance.now()

    const showBubble = (now: number) => {
      const b = bubble.current
      if (!b) return
      b.textContent = greetings[s.greeting++ % greetings.length]
      b.style.opacity = '1'
      s.bubbleUntil = now + BUBBLE_MS
    }

    const puff = (x: number, dir: number) => {
      const node = dust.current[s.dustNext++ % dust.current.length]
      if (!node) return
      const y = layout.floor - 6
      const dx = -dir * (14 + Math.random() * 18)
      node.animate(
        [
          { transform: `translate(${x}px, ${y}px) scale(0.4)`, opacity: 0.55 },
          { transform: `translate(${x + dx}px, ${y - 10 - Math.random() * 10}px) scale(1.6)`, opacity: 0 },
        ],
        { duration: 700, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      )
    }

    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const { w, floor, logoH, logoW } = layout
      const half = logoW / 2 + layout.margin
      // Home is the right-hand side: where it stands on load, with reduced
      // motion, and until it is first dragged. After that it stays put.
      const home = w - half
      const goal = Math.min(home, Math.max(half, target.current ?? home))
      // Until it is first dragged it just stands at home, even when the
      // layout settles (fonts, resizes) and home moves.
      if (target.current === null) s.x = home
      const dist = goal - s.x

      if (!reduced) {
        // State changes. While held it is led along; once let go it walks
        // the rest of the way and says hello.
        const dragging = drag.current.active
        if (drag.current.released) {
          drag.current.released = false
          if (s.mode !== 'hello') s.mode = 'walk'
        }
        if (dragging) {
          s.mode = 'walk'
        } else if (s.mode === 'walk' && Math.abs(dist) < ARRIVE_DISTANCE) {
          s.mode = 'hello'
          s.helloT = 0
          showBubble(now)
        } else if (s.mode !== 'walk' && Math.abs(dist) > START_DISTANCE) {
          s.mode = 'walk'
        }

        // Turn toward travel, then glide; speed scales with distance, capped.
        const heading = dragging ? Math.max(-1, Math.min(1, s.vx / 250)) : Math.sign(dist)
        const yawGoal = s.mode === 'walk' ? heading * MAX_YAW : 0
        s.yaw += (yawGoal - s.yaw) * ease(dt, TURN_TAU)
        const turned = dragging ? 1 : s.mode === 'walk' ? Math.min(1, Math.abs(s.yaw) / (MAX_YAW * 0.7)) : 0
        const vMax = Math.min(1100, w * 0.8)
        const vGoal = s.mode === 'walk' ? Math.max(-vMax, Math.min(vMax, dist * (dragging ? 9 : 3.2))) * turned : 0
        s.vx += (vGoal - s.vx) * ease(dt, 0.18)
        s.x += s.vx * dt
        s.lean += (-(s.vx / vMax) * MAX_LEAN - s.lean) * ease(dt, 0.12)

        // Dust at the base while gliding fast
        s.dustT += dt
        if (s.mode === 'walk' && Math.abs(s.vx) > 140 && s.dustT > DUST_EVERY) {
          s.dustT = 0
          puff(s.x - Math.sign(s.vx) * logoW * 0.3, Math.sign(s.vx))
        }
      } else {
        // Reduced motion: no walk animation, it simply follows the drag.
        drag.current.released = false
        s.x = goal
      }

      // Hello: a gentle hop plus a quick, damped tilt
      let hop = 0
      let tilt = 0
      if (s.mode === 'hello') {
        s.helloT += dt
        const t = Math.min(1, s.helloT / HELLO_DURATION)
        hop = Math.sin(Math.PI * t) * logoH * 0.06
        tilt = Math.sin(t * Math.PI * 3) * 0.06 * (1 - t)
        if (t >= 1) s.mode = 'rest'
      }
      s.tilt += (tilt - s.tilt) * ease(dt, 0.05)

      // Idle: one slow full turn, then settle
      let spin = 0
      if (!reduced) {
        if (s.spinT < 0 && s.mode === 'rest' && now - lastInput.current > IDLE_SPIN_AFTER * 1000) {
          s.spinT = 0
        }
        if (s.spinT >= 0) {
          s.spinT += dt
          const t = Math.min(1, s.spinT / SPIN_DURATION)
          spin = easeInOut(t) * Math.PI * 2
          if (t >= 1) {
            s.spinT = -1
            lastInput.current = now
          }
        }
      }

      // Write the pose for the 3D scene
      const p = pose.current
      p.x = s.x
      p.floor = floor
      p.height = logoH
      p.yaw = s.yaw + spin
      p.lean = s.lean + s.tilt
      p.tilt = 0
      p.hop = hop

      // Still logo (while 3D loads / fallback), hit area, contact shadow, bubble
      const f = flat.current
      if (f) {
        f.style.width = `${logoW}px`
        f.style.transform = `translate(${s.x - logoW / 2}px, ${floor - hop - logoH}px) rotate(${p.lean}rad) scaleX(${Math.cos(p.yaw)})`
      }
      const g = grab.current
      if (g) {
        g.style.width = `${logoW}px`
        g.style.height = `${logoH}px`
        g.style.transform = `translate(${s.x - logoW / 2}px, ${floor - hop - logoH}px)`
      }
      const sh = shadow.current
      if (sh) {
        // The swoosh's lowest point is left of centre (about 40% across).
        const sw = logoW * 0.7
        const k = 1 - (hop / logoH) * 2.5
        sh.style.width = `${sw}px`
        sh.style.transform = `translate(${s.x - logoW * 0.12 - sw / 2}px, ${floor - 10}px) scale(${k})`
        sh.style.opacity = String(0.9 * k)
      }
      const b = bubble.current
      if (b) {
        if (s.bubbleUntil && now > s.bubbleUntil) {
          b.style.opacity = '0'
          s.bubbleUntil = 0
        }
        const bw = b.offsetWidth
        let bx = s.x + logoW * 0.38
        if (bx + bw > w - 16) bx = s.x - logoW * 0.38 - bw
        bx = Math.max(16, Math.min(w - 16 - bw, bx))
        const by = Math.max(84, floor - logoH * 1.02 - hop - b.offsetHeight)
        b.style.transform = `translate(${bx}px, ${by}px)`
      }

      // Giant letters drift against the logo
      const offset = s.x - w / 2
      letters.current.forEach((letter, i) => {
        if (letter) letter.style.transform = `translateX(${-offset * 0.03 * (0.5 + i / 8)}px)`
      })

      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
    }
    // The refs are stable objects; listing them keeps the lint rule happy.
  }, [section, floorRef, letters, flat, shadow, bubble, dust, grab, onScreen, reduced, greetings])

  // Drag handlers for the invisible hit area over the logo. touch-action:
  // pan-y keeps vertical swipes scrolling the page (they cancel the drag).
  const pointerX = (event: ReactPointerEvent) =>
    event.clientX - (section.current?.getBoundingClientRect().left ?? 0)
  const dragHandlers = {
    onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
      setHeld(true)
      event.currentTarget.setPointerCapture(event.pointerId)
      drag.current.active = true
      drag.current.offset = pointerX(event) - pose.current.x
      target.current = pointerX(event) - drag.current.offset
      lastInput.current = performance.now()
    },
    onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
      if (!drag.current.active) return
      target.current = pointerX(event) - drag.current.offset
      lastInput.current = performance.now()
    },
    onPointerUp: release,
    onPointerCancel: release,
  }
  function release() {
    if (!drag.current.active) return
    drag.current.active = false
    drag.current.released = true
    lastInput.current = performance.now()
    // Keep drawing briefly so the static (reduced-motion) scene shows where it landed.
    window.setTimeout(() => setHeld(false), 400)
  }

  return { ...refs, pose, held, dragHandlers }
}
