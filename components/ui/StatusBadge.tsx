import { STATUS_COLORS, STATUS_LABELS } from '@/lib/data/projects'
import type { Project } from '@/lib/data/projects'

export default function StatusBadge({ status }: { status: Project['status'] }) {
  const color = STATUS_COLORS[status]
  return (
    <span className="shrink-0 rounded-full border px-[7px] py-0.5 font-mono text-[9px] tracking-[0.1em] whitespace-nowrap uppercase" style={{ color, borderColor: `${color}38` }}>
      {STATUS_LABELS[status]}
    </span>
  )
}
