import { Reveal } from '@/components/Reveal'
import AgencyEmptyState from '@/components/ui/AgencyEmptyState'
import { TECHNOLOGIES } from '@/lib/content/site'
import { groupTechnologies } from '@/lib/content/tech-groups'

/**
 * Technologies we work with, as words (clients don't read tech logos),
 * grouped by what they do for a client. The groups appear one after another
 * as you scroll (Reveal).
 */
export default function TechnologySection({ technologies = TECHNOLOGIES }: { technologies?: string[] }) {
  const { groups, andMore } = groupTechnologies(technologies)
  return (
    <section className="border-t border-bbw-border px-[clamp(20px,5vw,80px)] py-[clamp(56px,7vw,96px)]">
      <div className="mx-auto max-w-[1200px]">
        <p className="mb-10 text-center font-mono text-[10px] tracking-[0.16em] text-bbw-muted uppercase">Technologies We Work With</p>
        {groups.length ? (
          <>
            <div className="grid gap-x-10 gap-y-8 min-[700px]:grid-cols-2 min-[1100px]:grid-cols-3">
              {groups.map((group, i) => (
                <Reveal key={group.label} index={i} className="border-t border-bbw-border pt-5">
                  <h3 className="font-mono text-[10px] tracking-[0.14em] text-bbw-accent uppercase">{group.label}</h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {group.items.map(technology => (
                      <li key={technology} className="cursor-default rounded-full border border-bbw-border px-3.5 py-[5px] font-mono text-[11px] text-bbw-muted transition-[border-color,color] duration-200 hover:border-bbw-border-hi hover:text-bbw-fg">
                        {technology}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
            {andMore ? <p className="mt-10 text-center font-mono text-[11px] tracking-[0.12em] text-bbw-muted">And more</p> : null}
          </>
        ) : (
          <AgencyEmptyState title="The right stack starts with the right problem." description="We choose technology around your goals, users, and the product you need to launch." />
        )}
      </div>
    </section>
  )
}
