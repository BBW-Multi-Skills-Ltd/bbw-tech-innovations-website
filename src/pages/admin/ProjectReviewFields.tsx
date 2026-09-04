import type { ClientReview, Project, ReviewSource } from '../../data/projects'
import ProjectField from './ProjectField'
import { REVIEW_SOURCES } from './projectFormConfig'
import type { ProjectUpdater } from './projectFormConfig'

export default function ProjectReviewFields({ project, update }: { project: Project; update: ProjectUpdater }) {
  const updateReview = <Key extends keyof ClientReview>(field: Key, value: ClientReview[Key]) => {
    const review = project.review ?? { quote: '', clientName: '', clientRole: '', source: 'email' as const }
    update('review', { ...review, [field]: value })
  }
  return (
    <section className="admin-project-review-fields" aria-labelledby={`review-${project.id}`}>
      <div><p className="eyebrow">Marketplace review</p><h4 id={`review-${project.id}`}>Client review</h4><span>Leave the review blank to hide it from the public card and details modal.</span></div>
      <div className="admin-project-form-grid">
        <ProjectField label="Review Quote" full><textarea rows={5} value={project.review?.quote ?? ''} onChange={event => updateReview('quote', event.target.value)} /></ProjectField>
        <ProjectField label="Client Name"><input required={Boolean(project.review?.quote.trim())} value={project.review?.clientName ?? ''} onChange={event => updateReview('clientName', event.target.value)} /></ProjectField>
        <ProjectField label="Role or Company"><input value={project.review?.clientRole ?? ''} onChange={event => updateReview('clientRole', event.target.value)} /></ProjectField>
        <ProjectField label="Review Source"><select value={project.review?.source ?? 'email'} onChange={event => updateReview('source', event.target.value as ReviewSource)}>{REVIEW_SOURCES.map(source => <option key={source} value={source}>{source === 'whatsapp' ? 'WhatsApp' : source[0].toUpperCase() + source.slice(1)}</option>)}</select></ProjectField>
      </div>
    </section>
  )
}
