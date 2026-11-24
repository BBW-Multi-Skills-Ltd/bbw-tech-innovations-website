import { Reveal } from '@/components/Reveal'
import AgencyEmptyState from '@/components/ui/AgencyEmptyState'
import SectionHeading, { Eyebrow } from '@/components/ui/SectionHeading'
import type { Project } from '@/lib/data/projects'
import { WorkCard } from './WorkCard'
import { WorkTabs } from './WorkTabs'

function CardGrid({ projects }: { projects: Project[] }) {
  return (
    <ul className="grid gap-6 min-[768px]:grid-cols-2 min-[1100px]:grid-cols-3">
      {projects.map((project, i) => (
        <Reveal as="li" key={project.id} index={i % 3}>
          <WorkCard project={project} />
        </Reveal>
      ))}
    </ul>
  )
}

/**
 * The work section (like the portfolio's Selected work): tabs for our own
 * products and client work, cards linking to each project's case study.
 * Replaces the old Products and Work sections; #products still lands here.
 */
export function SelectedWork({ products, works }: { products: Project[]; works: Project[] }) {
  return (
    <section id="work" aria-labelledby="work-title" className="border-t border-bbw-border px-[clamp(20px,5vw,80px)] py-[clamp(80px,10vw,140px)]">
      {/* The old Products section's anchor (/#products, footer and nav links). In the
          page flow (not absolute), so the header's section tracking measures it right. */}
      <span id="products" aria-hidden className="block h-0 scroll-mt-[calc(80px+clamp(80px,10vw,140px))]" />
      <div className="mx-auto max-w-[1200px]">
        <WorkTabs
          heading={
            <div>
              <Eyebrow>Our Work</Eyebrow>
              <SectionHeading className="max-w-[560px]">
                <span id="work-title">Projects we&apos;ve built.</span>
              </SectionHeading>
            </div>
          }
          tabs={[
            {
              label: 'Our products',
              content: (
                <>
                  <p className="mb-8 max-w-[640px] text-[15px] leading-[1.7] text-bbw-muted">
                    Alongside client work, we create and grow our own <span className="text-bbw-fg">mobile apps</span> and <span className="text-bbw-fg">web platforms</span> to solve real business challenges.
                  </p>
                  {products.length ? (
                    <CardGrid projects={products} />
                  ) : (
                    <AgencyEmptyState title="The next mobile product starts with an idea." description="We’re preparing the next BBW mobile experience. Have an app idea worth building? Let’s talk." />
                  )}
                </>
              ),
            },
            {
              label: 'Client work',
              content: (
                <>
                  <p className="mb-8 max-w-[640px] text-[15px] leading-[1.7] text-bbw-muted">Real businesses, real problems, real digital solutions — delivered by BBW Tech.</p>
                  {works.length ? (
                    <CardGrid projects={works} />
                  ) : (
                    <AgencyEmptyState title="Your project could be the next story we tell." description="We partner with ambitious businesses to turn complex problems into practical digital products." />
                  )}
                </>
              ),
            },
          ]}
        />
      </div>
    </section>
  )
}
