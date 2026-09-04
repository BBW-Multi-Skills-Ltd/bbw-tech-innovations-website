import { useEffect } from 'react'
import type { Project } from '../data/projects'
import { BG, BORDER } from '../styles/theme'
import ProjectDetails from '../features/projects/modal/ProjectDetails'
import ProjectModalHeader from '../features/projects/modal/ProjectModalHeader'
import ProjectPreviewPanel from '../features/projects/modal/ProjectPreviewPanel'

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (!project) return
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [project, onClose])

  if (!project) return null
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 'clamp(12px, 3vw, 32px)', overflowY: 'auto', animation: 'modal-overlay-in 0.25s ease' }} onClick={event => { if (event.target === event.currentTarget) onClose() }}>
      <div role="dialog" aria-modal="true" aria-labelledby="project-modal-title" style={{ width: '100%', maxWidth: 1100, background: BG, borderRadius: 12, border: `1px solid ${BORDER}`, overflow: 'hidden', animation: 'modal-in 0.3s cubic-bezier(0.16,1,0.3,1)', position: 'relative', marginTop: 16, marginBottom: 32 }}>
        <ProjectModalHeader project={project} onClose={onClose} />
        <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: 'clamp(220px, 35%, 340px) 1fr', minHeight: 600 }}>
          <ProjectPreviewPanel project={project} />
          <ProjectDetails project={project} onClose={onClose} />
        </div>
      </div>
    </div>
  )
}
