import { useState } from 'react'
import type { Project, ProjectType } from '../../data/projects'
import { createEmptyProject } from './projectFormConfig'
import ProjectForm from './ProjectForm'
import ProjectRow from './ProjectRow'

interface ProjectManagerProps {
  items: Project[]
  type: ProjectType
  isWork: boolean
  onUpsert: (project: Project) => void
  onDelete: (id: string) => void
}

export default function ProjectManager({ items, type, isWork, onUpsert, onDelete }: ProjectManagerProps) {
  const [editing, setEditing] = useState<string | null>(null)
  const [addingNew, setAddingNew] = useState(false)
  const save = (project: Project) => { onUpsert(project); setEditing(null); setAddingNew(false) }

  return (
    <div>
      <div className="admin-manager-toolbar"><p>{items.length} item{items.length === 1 ? '' : 's'}</p><button type="button" className="btn-primary" onClick={() => { setAddingNew(true); setEditing(null) }}>+ Add New</button></div>
      {addingNew && <ProjectForm initial={createEmptyProject(type, isWork)} type={type} isWork={isWork} onSave={save} onCancel={() => setAddingNew(false)} />}
      <div className="admin-project-list">
        {items.map(project => (
          <div key={project.id}>
            <ProjectRow project={project} editing={editing === project.id} onEdit={() => { setEditing(editing === project.id ? null : project.id); setAddingNew(false) }} onDelete={() => { if (window.confirm(`Delete “${project.name}”?`)) onDelete(project.id) }} />
            {editing === project.id && <ProjectForm initial={project} type={type} isWork={isWork} onSave={save} onCancel={() => setEditing(null)} />}
          </div>
        ))}
        {items.length === 0 && !addingNew && <p className="admin-empty-state">No items yet. Select “Add New” to create one.</p>}
      </div>
    </div>
  )
}
