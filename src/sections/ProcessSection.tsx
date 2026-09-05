import { useState } from 'react'
import { PROCESS_STEPS } from '../content/process'
import type { ProcessStep } from '../content/process'
import { BORDER, MUTED, SURFACE } from '../styles/theme'
import SectionHeading, { Eyebrow } from '../components/ui/SectionHeading'

export default function ProcessSection({ steps = PROCESS_STEPS }: { steps?: ProcessStep[] }) {
  const [openStep, setOpenStep] = useState<number | null>(0)
  const [allOpen, setAllOpen] = useState(false)
  const toggleStep = (index: number) => {
    setAllOpen(false)
    setOpenStep(current => current === index ? null : index)
  }

  return (
    <section id="process" style={{ padding: 'clamp(80px, 10vw, 140px) clamp(20px, 5vw, 80px)', borderTop: `1px solid ${BORDER}`, background: SURFACE }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'start' }}>
        <div className="process-intro" style={{ position: 'sticky', top: 100 }}>
          <Eyebrow>How We Work</Eyebrow>
          <SectionHeading maxWidth={400}>From idea to<br />shipped product.</SectionHeading>
          <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.75, marginTop: 20, maxWidth: 360 }}>A clear, repeatable process that keeps projects on track and clients informed at every stage.</p>
          <button type="button" className="process-expand-all" onClick={() => { setAllOpen(current => !current); setOpenStep(0) }} aria-expanded={allOpen}>
            {allOpen ? 'Show one step' : 'Expand to view all'}<span aria-hidden="true">{allOpen ? '−' : '+'}</span>
          </button>
        </div>
        <div>
          {steps.map((step, index) => (
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
          ))}
        </div>
      </div>
    </section>
  )
}
