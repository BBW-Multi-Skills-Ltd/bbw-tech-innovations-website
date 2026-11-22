import { BUSINESS_PROBLEMS } from '@/lib/content/site'
import SectionHeading, { Eyebrow } from '@/components/ui/SectionHeading'

export default function ProblemSection() {
  return (
    <section className="px-[clamp(20px,5vw,80px)] py-[clamp(80px,10vw,140px)]">
      <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-center gap-[clamp(48px,8vw,100px)]">
        <div>
          <Eyebrow>The Problem</Eyebrow>
          <SectionHeading className="max-w-[440px]">Is your business<br />stuck like this?</SectionHeading>
          <p className="mt-5 max-w-[380px] text-[15px] leading-[1.75] text-bbw-muted">Most businesses across Nigeria and Africa are growing — but running on WhatsApp, paper, and spreadsheets. Their systems haven&apos;t kept up.</p>
          <p className="mt-3 max-w-[380px] text-[15px] leading-[1.75] text-bbw-muted">Technology should solve that. That&apos;s what we build.</p>
        </div>
        <div className="flex flex-col gap-2">
          {BUSINESS_PROBLEMS.map(problem => (
            <div key={problem} className="flex items-center gap-3 rounded-md border border-bbw-border bg-bbw-surface px-[18px] py-[13px] text-sm text-bbw-muted">
              <span className="shrink-0 text-[13px] text-[#EF4444]">✗</span>{problem}
            </div>
          ))}
          <div className="mt-2 flex items-center gap-3 rounded-md border border-[rgba(41,121,255,0.28)] bg-bbw-accent-dim px-[18px] py-[15px] text-sm font-medium text-bbw-fg">
            <span className="text-bbw-accent">→</span>BBW Tech builds the digital systems that fix this.
          </div>
        </div>
      </div>
    </section>
  )
}
