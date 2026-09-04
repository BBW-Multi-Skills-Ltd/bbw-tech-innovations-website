import type { PlatformAvailability, Project, ProjectStatus, ProjectType, WorkBadge } from '../../data/projects'
import { STATUS_LABELS } from '../../data/projects'
import ProjectField from './ProjectField'
import DemoVideoUpload from './DemoVideoUpload'
import { PLATFORM_OPTIONS, PROJECT_STATUSES } from './projectFormConfig'
import type { ProjectUpdater } from './projectFormConfig'

interface CoreFieldsProps {
  project: Project
  type: ProjectType
  isWork: boolean
  isNew: boolean
  techInput: string
  update: ProjectUpdater
  onTechChange: (value: string) => void
}

export default function ProjectCoreFields({ project, type, isWork, isNew, techInput, update, onTechChange }: CoreFieldsProps) {
  const updateName = (name: string) => {
    update('name', name)
    if (isNew) update('id', name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `project-${Date.now()}`)
  }
  return (
    <div className="admin-project-form-grid">
      <ProjectField label="Name"><input required value={project.name} onChange={event => updateName(event.target.value)} /></ProjectField>
      <ProjectField label="Tagline"><input value={project.tagline} onChange={event => update('tagline', event.target.value)} /></ProjectField>
      <ProjectField label="Short Description" full><textarea rows={3} value={project.shortDesc} onChange={event => update('shortDesc', event.target.value)} /></ProjectField>
      <ProjectField label="About — Full Detail" full><textarea rows={5} value={project.about} onChange={event => update('about', event.target.value)} /></ProjectField>
      <ProjectField label="Category"><input value={project.category} onChange={event => update('category', event.target.value)} /></ProjectField>
      <ProjectField label="Status"><select value={project.status} onChange={event => update('status', event.target.value as ProjectStatus)}>{PROJECT_STATUSES.map(status => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}</select></ProjectField>
      {type === 'app' && <>
        <ProjectField label="Android"><select value={project.androidAvailability ?? 'not-supported'} onChange={event => update('androidAvailability', event.target.value as PlatformAvailability)}>{PLATFORM_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></ProjectField>
        <ProjectField label="iOS"><select value={project.iosAvailability ?? 'not-supported'} onChange={event => update('iosAvailability', event.target.value as PlatformAvailability)}>{PLATFORM_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></ProjectField>
      </>}
      {type === 'website' && <ProjectField label="Website URL"><input inputMode="url" value={project.siteUrl ?? ''} onChange={event => update('siteUrl', event.target.value)} placeholder="https://example.com" /></ProjectField>}
      {isWork && <ProjectField label="Project Badge"><select value={project.badge ?? 'website'} onChange={event => update('badge', event.target.value as WorkBadge)}><option value="website">Website</option><option value="mobile-app">Mobile App</option></select></ProjectField>}
      <ProjectField label="Accent Color"><div className="admin-color-input"><input type="color" value={project.accentColor} onChange={event => update('accentColor', event.target.value)} /><input value={project.accentColor} onChange={event => update('accentColor', event.target.value)} /></div></ProjectField>
      <ProjectField label="Year"><input value={project.year} onChange={event => update('year', event.target.value)} /></ProjectField>
      <ProjectField label="Demo Video URL"><input inputMode="url" value={project.demoVideoUrl ?? ''} onChange={event => update('demoVideoUrl', event.target.value)} /><DemoVideoUpload value={project.demoVideoUrl ?? ''} onChange={url => update('demoVideoUrl', url)} /></ProjectField>
      <ProjectField label="Tech Stack — Comma Separated"><input value={techInput} onChange={event => onTechChange(event.target.value)} /></ProjectField>
    </div>
  )
}
