import type { Project } from '@/lib/data/projects'
import SectionHeading, { Eyebrow } from '@/components/ui/SectionHeading'
import ProjectCard from '@/components/projects/ProjectCard'
import AgencyEmptyState from '@/components/ui/AgencyEmptyState'

function ShowcaseHeading({ label, title, description }: { label: string; title: string; description: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-1.5 font-mono text-[10px] tracking-[0.14em] text-bbw-accent uppercase">{label}</p>
        <h3 className="font-display text-[clamp(22px,3vw,30px)] font-bold tracking-[-0.02em] text-bbw-fg">{title}</h3>
      </div>
      <p className="max-w-[260px] text-[13px] leading-[1.7] text-bbw-muted">{description}</p>
    </div>
  )
}

export default function ProductsSection({ apps, websites }: { apps: Project[]; websites: Project[] }) {
  return (
    <section id="products" className="border-t border-bbw-border px-[clamp(20px,5vw,80px)] py-[clamp(80px,10vw,140px)]">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-16">
          <Eyebrow>Our Products</Eyebrow>
          <SectionHeading className="max-w-[760px]">We don&apos;t just build for businesses.<br /><em className="text-bbw-accent">We build innovative in-house products that bring solutions across Africa.</em></SectionHeading>
          <p className="mt-[18px] text-[15px] leading-[1.7] text-bbw-muted">Alongside client work, we create and grow our own <span className="text-bbw-fg">mobile apps</span> and <span className="text-bbw-fg">web platforms</span> to solve real business challenges.</p>
        </div>
        <div className="mb-20">
          <ShowcaseHeading label="App Showcase" title="Mobile apps we've shipped." description="Built mobile-first, designed for real users, engineered to scale." />
          <div className="product-app-grid">
            {apps.length ? apps.map(project => <ProjectCard key={project.id} project={project} variant="app" />) : <AgencyEmptyState title="The next mobile product starts with an idea." description="We’re preparing the next BBW mobile experience. Have an app idea worth building? Let’s talk." />}
          </div>
        </div>
        <div className="mb-20 border-t border-bbw-border" />
        <ShowcaseHeading label="Website Showcase" title="Websites and web platforms." description="From simple business sites to real-time platforms - each project solves a real problem." />
        <div className="product-website-grid">
          {websites.length ? websites.map(project => <ProjectCard key={project.id} project={project} variant="website" />) : <AgencyEmptyState title="Your next web platform could be here." description="We turn real business needs into useful websites and web platforms. Let’s build yours." />}
        </div>
      </div>
    </section>
  )
}
