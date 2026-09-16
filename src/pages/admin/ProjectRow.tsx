import type { Project } from '../../data/projects'
import { STATUS_COLORS, STATUS_LABELS } from '../../data/projects'

interface ProjectRowProps {
  project: Project
  editing: boolean
  onEdit: () => void
  onToggleVisibility: () => void
  onDelete: () => void
}

export default function ProjectRow({ project, editing, onEdit, onToggleVisibility, onDelete }: ProjectRowProps) {
  const isPublished = project.isPublished !== false

  return (
    <article className={`admin-project-row${editing ? ' is-editing' : ''}${isPublished ? '' : ' is-hidden'}`}>
      <span className="admin-project-status-dot" style={{ background: STATUS_COLORS[project.status] }} />
      <div>
        <h3>{project.name || 'Unnamed'}</h3>
        <p><span style={{ color: STATUS_COLORS[project.status] }}>{STATUS_LABELS[project.status]}</span>{!isPublished && <span>Hidden from marketplace</span>}{project.badge && <span>{project.badge}</span>}<span>{project.category}</span>{project.review?.quote && <span>Review added</span>}</p>
      </div>
      <div className="admin-project-row-actions">
        <button type="button" onClick={onEdit}>{editing ? 'Close' : 'Edit'}</button>
        <button type="button" onClick={onToggleVisibility}>{isPublished ? 'Hide' : 'Show'}</button>
        <button type="button" className="is-danger" onClick={onDelete}>Delete</button>
      </div>
    </article>
  )
}
