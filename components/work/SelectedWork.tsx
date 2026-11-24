import { Reveal } from '@/components/Reveal'
import AgencyEmptyState from '@/components/ui/AgencyEmptyState'
import SectionHeading, { Eyebrow } from '@/components/ui/SectionHeading'
import type { Project } from '@/lib/data/projects'
import { hasApp, hasWebsite, projectTypeOf } from '@/lib/project-types'
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
 * The work section (like the portfolio's Selected work): All · Mobile apps ·
 * Websites. Mobile apps = mobile, PWA and both combined types; Websites =
 * website and both combined types, so a combined project appears in both.
 * Each card says whether it's our product or client work. #products lands here.
 */
export function SelectedWork({ projects }: { projects: Project[] }) {
  const mobile = projects.filter(project => hasApp(projectTypeOf(project)))
  const websites = projects.filter(project => hasWebsite(projectTypeOf(project)))
  const tab = (list: Project[], empty: { title: string; description: string }) =>
    list.length ? <CardGrid projects={list} /> : <AgencyEmptyState {...empty} />

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
              <p className="mt-5 max-w-[520px] text-[15px] leading-[1.7] text-bbw-muted">Real businesses, real problems, real digital solutions — delivered by BBW Tech.</p>
            </div>
          }
          tabs={[
            {
              label: 'All',
              content: tab(projects, { title: 'Your project could be the next story we tell.', description: 'We partner with ambitious businesses to turn complex problems into practical digital products.' }),
            },
            {
              label: 'Mobile apps',
              content: tab(mobile, { title: 'The next mobile product starts with an idea.', description: 'We’re preparing the next BBW mobile experience. Have an app idea worth building? Let’s talk.' }),
            },
            {
              label: 'Websites',
              content: tab(websites, { title: 'Your next web platform could be here.', description: 'We turn real business needs into useful websites and web platforms. Let’s build yours.' }),
            },
          ]}
        />
      </div>
    </section>
  )
}
