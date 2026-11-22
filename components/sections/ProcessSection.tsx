'use client'

import { useState } from 'react'
import { PROCESS_STEPS } from '@/lib/content/process'
import type { ProcessStep } from '@/lib/content/process'
import SectionHeading, { Eyebrow } from '@/components/ui/SectionHeading'
import AgencyEmptyState from '@/components/ui/AgencyEmptyState'

export default function ProcessSection({ steps = PROCESS_STEPS }: { steps?: ProcessStep[] }) {
  const [openStep, setOpenStep] = useState<number | null>(0)
  const [allOpen, setAllOpen] = useState(false)
  const toggleStep = (index: number) => {
    setAllOpen(false)
    setOpenStep(current => current === index ? null : index)
  }

  return (
    <section id="process" className="border-t border-bbw-border bg-bbw-surface px-[clamp(20px,5vw,80px)] py-[clamp(80px,10vw,140px)]">
      <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-16">
        <div className="process-intro sticky top-[100px]">
          <Eyebrow>How We Work</Eyebrow>
          <SectionHeading className="max-w-[400px]">From idea to<br />shipped product.</SectionHeading>
          <p className="mt-5 max-w-[360px] text-[15px] leading-[1.75] text-bbw-muted">A clear, repeatable process that keeps projects on track and clients informed at every stage.</p>
          {steps.length > 0 && <button type="button" className="process-expand-all" onClick={() => { setAllOpen(current => !current); setOpenStep(0) }} aria-expanded={allOpen}>
            {allOpen ? 'Show one step' : 'Expand to view all'}<span aria-hidden="true">{allOpen ? '−' : '+'}</span>
          </button>}
        </div>
        <div>
          {steps.length ? steps.map((step, index) => (
            <div key={step.num} className={`process-row${allOpen || openStep === index ? ' is-open' : ''}`}>
              <button type="button" className="process-trigger" onClick={() => toggleStep(index)} aria-expanded={allOpen || openStep === index} aria-controls={`process-details-${step.num}`}>
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
          )) : <AgencyEmptyState title="Every strong product begins with discovery." description="Tell us what you are building and we’ll shape a practical path from idea to launch." />}
        </div>
      </div>
    </section>
  )
}
