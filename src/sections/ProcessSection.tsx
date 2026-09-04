import { useState } from 'react'
import { PROCESS_STEPS } from '../content/process'
import { BORDER, MUTED, SURFACE } from '../styles/theme'
import SectionHeading, { Eyebrow } from '../components/ui/SectionHeading'

export default function ProcessSection() {
  const [openSteps, setOpenSteps] = useState<Set<number>>(() => new Set([0]))
  const allOpen = openSteps.size === PROCESS_STEPS.length
  const toggleStep = (index: number) => setOpenSteps(current => {
    const next = new Set(current)
    if (next.has(index)) next.delete(index); else next.add(index)
    return next
  })

  return (
    <section id="process" style={{ padding: 'clamp(80px, 10vw, 140px) clamp(20px, 5vw, 80px)', borderTop: `1px solid ${BORDER}`, background: SURFACE }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'start' }}>
        <div style={{ position: 'sticky', top: 100 }}>
          <Eyebrow>How We Work</Eyebrow>
          <SectionHeading maxWidth={400}>From idea to<br />shipped product.</SectionHeading>
          <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.75, marginTop: 20, maxWidth: 360 }}>A clear, repeatable process that keeps projects on track and clients informed at every stage.</p>
          <button type="button" className="process-expand-all" onClick={() => setOpenSteps(allOpen ? new Set() : new Set(PROCESS_STEPS.map((_, index) => index)))} aria-expanded={allOpen}>
            {allOpen ? 'Collapse all details' : 'Expand all details'}<span aria-hidden="true">{allOpen ? '↑' : '↓'}</span>
          </button>
        </div>
        <div>
          {PROCESS_STEPS.map((step, index) => (
            <div key={step.num} className={`process-row${openSteps.has(index) ? ' is-open' : ''}`}>
              <button type="button" className="process-trigger" onClick={() => toggleStep(index)} aria-expanded={openSteps.has(index)} aria-controls={`process-details-${step.num}`}>
                <span className="process-num">{step.num}</span>
                <span className="process-summary"><span className="process-title">{step.title}</span><span className="process-description">{step.desc}</span></span>
                <span className="process-arrow" aria-hidden="true">{index === PROCESS_STEPS.length - 1 ? '↺' : '↓'}</span>
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
