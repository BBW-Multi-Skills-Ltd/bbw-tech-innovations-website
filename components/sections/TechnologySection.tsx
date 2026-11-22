import { TECHNOLOGIES } from '@/lib/content/site'
import AgencyEmptyState from '@/components/ui/AgencyEmptyState'

export default function TechnologySection({ technologies = TECHNOLOGIES }: { technologies?: string[] }) {
  return (
    <section className="border-t border-bbw-border px-[clamp(20px,5vw,80px)] py-[clamp(56px,7vw,96px)]">
      <div className="mx-auto max-w-[1200px] text-center">
        <p className="mb-7 font-mono text-[10px] tracking-[0.16em] text-bbw-muted uppercase">Technologies We Work With</p>
        {technologies.length ? <div className="flex flex-wrap justify-center gap-2">
          {technologies.map(technology => (
            <span key={technology} className="cursor-default rounded-full border border-bbw-border px-3.5 py-[5px] font-mono text-[11px] text-bbw-muted transition-[border-color,color] duration-200 hover:border-bbw-border-hi hover:text-bbw-fg">
              {technology}
            </span>
          ))}
        </div> : <AgencyEmptyState title="The right stack starts with the right problem." description="We choose technology around your goals, users, and the product you need to launch." />}
      </div>
    </section>
  )
}
