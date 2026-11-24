import { Reveal } from '@/components/Reveal'
import { SERVICES } from '@/lib/content/site'
import SectionHeading, { Eyebrow } from '@/components/ui/SectionHeading'

export default function SolutionsSection() {
  return (
    <section id="solutions" className="border-t border-bbw-border px-[clamp(20px,5vw,80px)] py-[clamp(80px,10vw,140px)]">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-14">
          <Eyebrow>What We Build</Eyebrow>
          <SectionHeading className="max-w-[580px]">Technology that solves<br />real business problems.</SectionHeading>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-px overflow-hidden rounded-lg border border-bbw-border bg-bbw-border">
          {/* Each box's content appears one after another in a quick wave as the grid
              scrolls into view. The boxes themselves stay put: the grid's 1px lines are
              its background showing between them, which a fading box would expose. */}
          {SERVICES.map((service, i) => (
            <article key={service.title} className="service-card">
              <Reveal index={i}>
                <div className="service-icon"><span className="text-[15px]">{service.icon}</span></div>
                <h3 className="mb-2.5 text-base font-semibold text-bbw-fg">{service.title}</h3>
                <p className="text-sm leading-[1.7] text-bbw-muted">{service.desc}</p>
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
