import { ArrowUpRight, Sparkles } from 'lucide-react'

interface AgencyEmptyStateProps {
  title: string
  description: string
  actionLabel?: string
}

export default function AgencyEmptyState({ title, description, actionLabel = 'Start a project' }: AgencyEmptyStateProps) {
  return (
    <div className="agency-empty-state grid min-h-[210px] place-items-center rounded-[10px] border border-dashed border-bbw-border bg-bbw-surface2 px-6 py-8 text-center">
      <div className="max-w-[440px]">
        <Sparkles size={19} className="text-bbw-accent" strokeWidth={1.7} aria-hidden="true" />
        <h4 className="mt-[13px] mb-2 text-lg font-semibold text-bbw-fg">{title}</h4>
        <p className="mx-auto mb-[18px] text-sm leading-[1.7] text-bbw-muted">{description}</p>
        <a href="#contact" className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] text-bbw-accent uppercase no-underline">{actionLabel}<ArrowUpRight size={14} aria-hidden="true" /></a>
      </div>
    </div>
  )
}
