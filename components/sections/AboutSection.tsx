import { COMPANY_PILLARS } from '@/lib/content/site'
import SectionHeading, { Eyebrow } from '@/components/ui/SectionHeading'

/** About BBW Tech: the text (kept in view on wide screens) beside the four pillars. The business arms are in the intro's company card. */
export default function AboutSection() {
  return (
    <section id="about" className="border-t border-bbw-border bg-bbw-surface px-[clamp(20px,5vw,80px)] py-[clamp(80px,10vw,140px)]">
      <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-[clamp(48px,8vw,100px)]">
        <div className="min-[700px]:sticky min-[700px]:top-[100px]">
          <Eyebrow>About BBW Tech</Eyebrow>
          <SectionHeading className="max-w-[460px]">Young company.<br />Serious execution.<br /><em className="text-bbw-accent">Long-term vision.</em></SectionHeading>
          <p className="mt-6 max-w-[400px] text-[15px] leading-[1.75] text-bbw-muted">BBW Tech Innovations is the technology arm of BBW Multi-Skills Ltd — a Nigerian business ecosystem spanning technology, construction, infrastructure, maintenance, and lifestyle.</p>
          <p className="mt-3.5 max-w-[400px] text-[15px] leading-[1.75] text-bbw-muted">We are a startup. We don&apos;t pretend otherwise. But we build seriously, we ship real products, and our long-term goal is clear: to become Africa&apos;s leading hub for SaaS innovation.</p>
        </div>
        <div className="flex flex-col gap-[18px]">
          {COMPANY_PILLARS.map(({ label, text }) => (
            <article key={label} className="rounded-md border border-bbw-border bg-bbw-surface2 px-6 py-[22px]">
              <p className="mb-2.5 font-mono text-[10px] tracking-[0.15em] text-bbw-accent uppercase">{label}</p>
              <p className="text-sm leading-[1.7] text-bbw-muted">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
