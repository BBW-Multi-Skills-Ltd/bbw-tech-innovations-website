import { STATUS_COLORS, STATUS_LABELS } from '../../data/projects'
import type { Project } from '../../data/projects'
import { mono } from '../../styles/theme'

export default function StatusBadge({ status }: { status: Project['status'] }) {
  const color = STATUS_COLORS[status]
  return (
    <span style={{ ...mono, fontSize: 9, color, border: `1px solid ${color}38`, padding: '2px 7px', borderRadius: 100, whiteSpace: 'nowrap', flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
      {STATUS_LABELS[status]}
    </span>
  )
}
