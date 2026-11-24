import type { PlatformAvailability, Project, ProjectStatus, ProjectType } from '@/lib/data/projects'
import { hasApp, hasWebsite, isCombined, PROJECT_TYPES, projectTypeOf, WEB_ROLES, type ProjectType as KindOfProject, type WebRole } from '@/lib/project-types'
import { STATUS_LABELS } from '@/lib/data/projects'
import ProjectField from '@/components/admin/ProjectField'
import CloudinaryMediaUpload from '@/components/admin/CloudinaryMediaUpload'
import { PLATFORM_OPTIONS, PROJECT_STATUSES } from '@/components/admin/projectFormConfig'
import type { ProjectUpdater } from '@/components/admin/projectFormConfig'

interface CoreFieldsProps {
  project: Project
  /** The admin section it was opened from (unused: the project type decides). */
  type?: ProjectType
  isWork?: boolean
  isNew: boolean
  techInput: string
  update: ProjectUpdater
  onTechChange: (value: string) => void
}

export default function ProjectCoreFields({ project, isNew, techInput, update, onTechChange }: CoreFieldsProps) {
  // The project type decides which fields apply (app availability, website URL).
  const projectType = projectTypeOf(project)
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
      <ProjectField label="Project type"><select value={projectType} onChange={event => update('projectType', event.target.value as KindOfProject)}>{PROJECT_TYPES.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select><small>Decides the work tabs it appears in and its device frames (phone, laptop, or both).</small></ProjectField>
      {isCombined(projectType) && <ProjectField label="Website role"><select value={project.webRole ?? 'marketing'} onChange={event => update('webRole', event.target.value as WebRole)}>{WEB_ROLES.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></ProjectField>}
      <ProjectField label="Status"><select value={project.status} onChange={event => update('status', event.target.value as ProjectStatus)}>{PROJECT_STATUSES.map(status => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}</select></ProjectField>
      {hasApp(projectType) && <>
        <ProjectField label="Android"><select value={project.androidAvailability ?? 'not-supported'} onChange={event => update('androidAvailability', event.target.value as PlatformAvailability)}>{PLATFORM_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></ProjectField>
        <ProjectField label="iOS"><select value={project.iosAvailability ?? 'not-supported'} onChange={event => update('iosAvailability', event.target.value as PlatformAvailability)}>{PLATFORM_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></ProjectField>
        <ProjectField label="QR Destination URL" full><input inputMode="url" value={project.qrUrl ?? ''} onChange={event => update('qrUrl', event.target.value)} placeholder="https://play.google.com/... or your download page" /><small>Shown as a real download QR code in product details. Leave blank to hide it.</small></ProjectField>
      </>}
      {hasWebsite(projectType) && <ProjectField label="Website URL"><input type="url" inputMode="url" value={!project.siteUrl || project.siteUrl === '#' ? 'https://' : project.siteUrl} onChange={event => update('siteUrl', event.target.value || 'https://')} placeholder="yourwebsite.com" /><small>Type the domain after <code>https://</code>. The marketplace “Visit website” link opens it in a new tab.</small></ProjectField>}
      <ProjectField label="Accent Color"><div className="admin-color-input"><input type="color" value={project.accentColor} onChange={event => update('accentColor', event.target.value)} /><input value={project.accentColor} onChange={event => update('accentColor', event.target.value)} /></div></ProjectField>
      <ProjectField label="Year"><input value={project.year} onChange={event => update('year', event.target.value)} /></ProjectField>
      <ProjectField label="Card Preview Image"><input inputMode="url" value={project.cardImageUrl ?? ''} onChange={event => update('cardImageUrl', event.target.value)} /><CloudinaryMediaUpload assetType="image" value={project.cardImageUrl ?? ''} onChange={url => update('cardImageUrl', url)} /></ProjectField>
      <ProjectField label="Demo Video URL"><input inputMode="url" value={project.demoVideoUrl ?? ''} onChange={event => update('demoVideoUrl', event.target.value)} /><CloudinaryMediaUpload assetType="video" value={project.demoVideoUrl ?? ''} onChange={url => update('demoVideoUrl', url)} /></ProjectField>
      <ProjectField label="Featured on homepage"><div className="admin-featured-toggle"><input type="checkbox" checked={project.isFeatured ?? false} onChange={event => update('isFeatured', event.target.checked)} /> Show in “What we’ve built” on the homepage</div><small>Up to 3 featured projects show there, in list order (own products first, then client work).</small></ProjectField>
      <ProjectField label="Tech Stack — Comma Separated"><input value={techInput} onChange={event => onTechChange(event.target.value)} /></ProjectField>
    </div>
  )
}
