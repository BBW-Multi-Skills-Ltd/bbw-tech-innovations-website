'use client'

import { useEffect, useRef, useState } from 'react'
import { PROCESS_STEPS } from '@/lib/content/process'
import type { ProcessStep } from '@/lib/content/process'
import { useReducedMotion } from '@/lib/useReducedMotion'
import SectionHeading, { Eyebrow } from '@/components/ui/SectionHeading'
import AgencyEmptyState from '@/components/ui/AgencyEmptyState'

/** A step "is reached" when its top passes this share of the screen height. */
const REACH_AT = 0.62

/**
 * How we work: the steps as a scroll-driven timeline. The heading stays on
 * the left; on the right a line fills as you scroll, and each step lights up
 * and opens by itself when you reach it (reached steps stay open, so nothing
 * above you collapses and jumps the page). Clicking a step still opens or
 * closes it; "Expand to view all" opens every step. With reduced motion
 * nothing is scroll-driven: one step is open at a time, by click, as before.
 */
export default function ProcessSection({ steps = PROCESS_STEPS }: { steps?: ProcessStep[] }) {
  const reduced = useReducedMotion()
  const [openStep, setOpenStep] = useState<number | null>(0)
  const [allOpen, setAllOpen] = useState(false)
  /** Furthest step reached by scrolling (only ever grows). */
  const [reached, setReached] = useState(-1)
  /** Steps the visitor opened or closed by hand (wins over the scroll). */
  const [toggled, setToggled] = useState<Record<number, boolean>>({})
  const listRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list || reduced) return
    let frame = 0
    const update = () => {
      frame = 0
      const box = list.getBoundingClientRect()
      const at = window.innerHeight * REACH_AT
      // The line fills from the list's top to its bottom as the reach point passes.
      const progress = Math.min(1, Math.max(0, (at - box.top) / box.height))
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${progress})`
      const rows = Array.from(list.querySelectorAll<HTMLElement>('.process-row'))
      let last = -1
      rows.forEach((row, i) => {
        if (row.getBoundingClientRect().top < at) last = i
      })
      setReached(current => (last > current ? last : current))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    // First measurement on the next frame (not during the effect itself).
    frame = requestAnimationFrame(update)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [reduced, steps.length])

  const isOpen = (index: number) => {
    if (allOpen) return true
    if (reduced) return openStep === index
    return toggled[index] ?? index <= reached
  }

  const toggleStep = (index: number) => {
    if (reduced) {
      setAllOpen(false)
      setOpenStep(current => (current === index ? null : index))
      return
    }
    setAllOpen(false)
    setToggled(current => ({ ...current, [index]: !isOpen(index) }))
  }

  const toggleAll = () => {
    setAllOpen(current => !current)
    setOpenStep(0)
    // Back to the scroll's own choice when showing fewer again.
    setToggled({})
  }

  return (
    <section id="process" className="border-t border-bbw-border bg-bbw-surface px-[clamp(20px,5vw,80px)] py-[clamp(80px,10vw,140px)]">
      <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-16">
        <div className="process-intro sticky top-[100px]">
          <Eyebrow>How We Work</Eyebrow>
          <SectionHeading className="max-w-[400px]">From idea to<br />shipped product.</SectionHeading>
          <p className="mt-5 max-w-[360px] text-[15px] leading-[1.75] text-bbw-muted">A clear, repeatable process that keeps projects on track and clients informed at every stage.</p>
          {steps.length > 0 && <button type="button" className="process-expand-all" onClick={toggleAll} aria-expanded={allOpen}>
            {allOpen ? 'Show one step' : 'Expand to view all'}<span aria-hidden="true">{allOpen ? '−' : '+'}</span>
          </button>}
        </div>
        {steps.length ? (
          <div ref={listRef} className={`process-timeline${reduced ? '' : ' is-scroll-driven'}`}>
            {/* The line: a faint track, and the blue fill that follows the scroll */}
            <span aria-hidden className="process-line" />
            <span ref={fillRef} aria-hidden className="process-line-fill" style={{ transform: 'scaleY(0)' }} />
            {steps.map((step, index) => {
              const open = isOpen(index)
              const lit = reduced ? open : index <= reached || open
              return (
                <div key={step.num} className={`process-row${open ? ' is-open' : ''}${lit ? ' is-reached' : ''}`}>
                  <button type="button" className="process-trigger" onClick={() => toggleStep(index)} aria-expanded={open} aria-controls={`process-details-${step.num}`}>
                    <span className="process-num">{step.num}</span>
                    <span className="process-summary"><span className="process-title">{step.title}</span><span className="process-description">{step.desc}</span></span>
                    <span className="process-arrow" aria-hidden="true">{index === steps.length - 1 ? '↺' : '↓'}</span>
                  </button>
                  <div id={`process-details-${step.num}`} className="process-details">
                    <div className="process-details-inner">
                      <ul className="process-detail-list">{step.details.map(detail => <li key={detail}>{detail}</li>)}</ul>
                      <p className="process-output"><span>Output</span>{step.output}</p>
                      {step.note && <p className="process-note">{step.note}</p>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <AgencyEmptyState title="Every strong product begins with discovery." description="Tell us what you are building and we’ll shape a practical path from idea to launch." />
        )}
      </div>
    </section>
  )
}
