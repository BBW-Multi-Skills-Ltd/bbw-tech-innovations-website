'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { refreshSoon } from '@/lib/phone-slides'

type Tab = { label: string; content: ReactNode }

/**
 * Segmented "All / Mobile apps / Websites" toggle (from the portfolio). Both
 * lists are rendered on the server and passed in; this only switches which
 * one is shown. The tabs are equal width, so the blue highlight slides across
 * by its own width; the newly shown list fades in (.tab-in).
 */
export function WorkTabs({ heading, tabs }: { heading: ReactNode; tabs: Tab[] }) {
  const [active, setActive] = useState(0)
  const [switches, setSwitches] = useState(0)
  const id = useId()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  // The tabs can differ in height: anything pinned further down must re-measure.
  useEffect(() => {
    if (switches) refreshSoon()
  }, [switches])

  function select(index: number) {
    if (index === active) return
    setActive(index)
    setSwitches(n => n + 1)
  }

  // Arrow keys move between tabs (WAI-ARIA tabs pattern).
  function onKeyDown(event: KeyboardEvent) {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    const next = (active + step + tabs.length) % tabs.length
    select(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <>
      <div className="flex flex-col gap-6 min-[760px]:flex-row min-[760px]:items-end min-[760px]:justify-between">
        {heading}
        <div role="tablist" aria-label="Project group" onKeyDown={onKeyDown} className="relative grid auto-cols-fr grid-flow-col self-start rounded-full border border-bbw-border bg-bbw-surface p-1.5 min-[760px]:self-auto">
          <span
            aria-hidden
            className="tab-highlight absolute top-1.5 bottom-1.5 left-1.5 rounded-full bg-bbw-accent"
            style={{ width: `calc((100% - 12px) / ${tabs.length})`, transform: `translateX(${active * 100}%)` }}
          />
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              ref={el => {
                tabRefs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={active === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => select(i)}
              className={`relative min-h-11 cursor-pointer rounded-full border-none bg-transparent px-5 font-mono text-[11px] tracking-[0.1em] whitespace-nowrap uppercase transition-colors duration-300 ease-soft ${
                active === i ? 'font-bold text-white' : 'font-medium text-bbw-muted hover:text-bbw-fg'
              }`}
            >
              <span className="relative">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {tabs.map((tab, i) => (
        <div key={tab.label} role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={active !== i} className="mt-10">
          {/* Fades in only after a switch, so the first render is visible */}
          <div key={active === i ? `shown-${switches}` : 'hidden'} className={switches > 0 ? 'tab-in' : undefined}>
            {tab.content}
          </div>
        </div>
      ))}
    </>
  )
}
