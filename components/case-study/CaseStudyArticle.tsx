import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { BackLink } from '@/components/BackLink'
import { DrawnScreen } from '@/components/projects/DrawnScreen'
import { projectDevices } from '@/lib/project-types'
import type { Block } from '@/lib/case-studies/types'
import type { Project } from '@/lib/data/projects'
import { CaseStudyBlock, Cover, sectionId } from './Blocks'
import { SectionPills } from './SectionPills'

// The case study page body (ported from the portfolio). Kept apart from the
// page so the Phase 6 block editor can show exactly the same thing.

type Section<T> = { id: string | null; label: string | null; blocks: T[] }

/** Splits blocks into sections: a block with a section label starts one. The cover sits apart. */
export function toSections<T extends { type: string; sectionLabel: string | null }>(blocks: T[]): Section<T>[] {
  const sections: Section<T>[] = [{ id: null, label: null, blocks: [] }]
  for (const block of blocks) {
    if (block.type === 'cover') continue
    if (block.sectionLabel) sections.push({ id: sectionId(block.sectionLabel), label: block.sectionLabel, blocks: [block] })
    else sections[sections.length - 1].blocks.push(block)
  }
  return sections.filter(section => section.blocks.length)
}

/** Spacing for a section: the first sits close to the cover, the rest get a rule above. */
export const sectionClass = (i: number) =>
  `flex scroll-mt-[140px] flex-col gap-16 ${i === 0 ? 'pt-10' : 'mt-24 border-t border-bbw-border pt-20 min-[961px]:mt-28 min-[961px]:pt-24'}`

export function CaseStudyArticle({ project, blocks, next }: { project: Project; blocks: Block[]; next: { slug: string; name: string } | null }) {
  const sections = toSections(blocks)
  const devices = projectDevices(project)
  const pills = sections.filter(section => section.id).map(section => ({ id: section.id!, label: section.label! }))
  const cover = blocks.find(block => block.type === 'cover')

  return (
    <article>
      {cover?.type === 'cover' ? (
        <Cover
          name={project.name}
          data={cover.data}
          back={<BackLink href="/#work">All work</BackLink>}
          devices={devices}
          fallbackScreen={kind => <DrawnScreen project={project} kind={kind} />}
        />
      ) : (
        <header className="container-site pt-28 pb-12 min-[961px]:pt-32">
          <BackLink href="/#work">All work</BackLink>
          <h1 className="font-display text-[clamp(52px,7.4vw,104px)] leading-[0.95] font-bold tracking-[-0.035em] text-bbw-fg">{project.name}</h1>
          <p className="mt-6 max-w-[40ch] text-[18px] text-bbw-fg/80">{project.tagline}</p>
        </header>
      )}
      <SectionPills sections={pills} />
      <div className="container-site pb-24">
        {sections.map((section, i) => (
          <section key={section.id ?? `intro-${i}`} id={section.id ?? undefined} className={sectionClass(i)}>
            {section.blocks.map((block, j) => (
              <CaseStudyBlock key={block.id} block={block} section={j === 0 ? (section.id ? true : 'intro') : false} devices={devices} lazyDiagrams />
            ))}
          </section>
        ))}
        <MoreWork next={next} />
      </div>
    </article>
  )
}

function MoreWork({ next }: { next: { slug: string; name: string } | null }) {
  const tileClass = 'group flex flex-wrap items-end justify-between gap-6 rounded-[10px] border border-bbw-border bg-bbw-surface p-8 no-underline transition-[border-color,transform] duration-200 hover:-translate-y-1 hover:border-bbw-border-hi min-[640px]:p-10'
  const arrow = 'size-8 text-bbw-accent transition-transform duration-300 ease-soft group-hover:translate-x-1'
  return (
    <nav aria-label="More work" className="mt-28 border-t border-bbw-border pt-16">
      {next ? (
        <Link href={`/work/${next.slug}`} className={tileClass}>
          <span>
            <span className="font-mono text-[11px] tracking-[0.14em] text-bbw-muted uppercase">Next project</span>
            <span className="mt-3 block font-display text-[clamp(34px,4vw,60px)] leading-none font-bold tracking-[-0.03em] text-bbw-fg">{next.name}</span>
          </span>
          <ArrowRight className={arrow} aria-hidden="true" />
        </Link>
      ) : (
        <Link href="/#work" className={tileClass}>
          <span>
            <span className="font-mono text-[11px] tracking-[0.14em] text-bbw-muted uppercase">More work</span>
            <span className="mt-3 block font-display text-[clamp(34px,4vw,60px)] leading-none font-bold tracking-[-0.03em] text-bbw-fg">
              See all <em className="text-bbw-accent">work</em>
            </span>
          </span>
          <ArrowRight className={arrow} aria-hidden="true" />
        </Link>
      )}
    </nav>
  )
}
