import { useState } from 'react'
import type { Project, ProjectType } from '@/lib/data/projects'
import { formatPlatformAvailability } from '@/lib/data/projects'
import ProjectCoreFields from '@/components/admin/ProjectCoreFields'
import ProjectReviewFields from '@/components/admin/ProjectReviewFields'
import { platformAvailability } from '@/components/admin/projectFormConfig'
import { hasApp, projectTypeOf } from '@/lib/project-types'

interface ProjectFormProps {
  initial: Project
  type: ProjectType
  isWork: boolean
  onSave: (project: Project) => void
  onCancel: () => void
}

export default function ProjectForm({ initial, type, isWork, onSave, onCancel }: ProjectFormProps) {
  const [project, setProject] = useState<Project>(() => ({ ...initial, ...(hasApp(projectTypeOf(initial)) ? { androidAvailability: platformAvailability(initial, 'android'), iosAvailability: platformAvailability(initial, 'ios') } : {}) }))
  const [techInput, setTechInput] = useState(initial.tech.join(', '))
  const update = <Key extends keyof Project>(field: Key, value: Project[Key]) => setProject(current => ({ ...current, [field]: value }))

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const review = project.review?.quote.trim() ? { ...project.review, quote: project.review.quote.trim(), clientName: project.review.clientName.trim(), clientRole: project.review.clientRole?.trim() || undefined } : undefined
    const android = project.androidAvailability ?? 'not-supported'
    const ios = project.iosAvailability ?? 'not-supported'
    const platform = formatPlatformAvailability(android, ios) || (project.platform && !/android|ios/i.test(project.platform) ? project.platform : '')
    // The project type (not the admin section) decides whether the app fields apply.
    const projectType = projectTypeOf(project)
    onSave({ ...project, projectType, name: project.name.trim(), tech: techInput.split(',').map(item => item.trim()).filter(Boolean), review, ...(hasApp(projectType) ? { androidAvailability: android, iosAvailability: ios, platform } : {}) })
  }

  return (
    <form className="admin-project-form" onSubmit={submit}>
      <h3>{initial.name ? `Edit: ${initial.name}` : `Add New ${isWork ? 'Client Work' : type === 'app' ? 'App' : 'Website'}`}</h3>
      <ProjectCoreFields project={project} type={type} isWork={isWork} isNew={!initial.name} techInput={techInput} update={update} onTechChange={setTechInput} />
      {isWork && <ProjectReviewFields project={project} update={update} />}
      <div className="admin-project-form-actions"><button type="submit" className="btn-primary">Save</button><button type="button" className="admin-secondary-button" onClick={onCancel}>Cancel</button></div>
    </form>
  )
}
