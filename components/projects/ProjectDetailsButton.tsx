'use client'

import type { Project } from '@/lib/data/projects'
import { useSiteActions } from '@/components/home/SiteActions'

/** "View Details" on a project card: opens the project popup. */
export default function ProjectDetailsButton({ project, disabled }: { project: Project; disabled: boolean }) {
  const { openProject } = useSiteActions()
  return (
    <button type="button" disabled={disabled} onClick={() => openProject(project)} className={`min-w-[120px] flex-1 rounded-[5px] border-none px-3.5 py-2.5 text-[13px] font-semibold text-white ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`} style={{ background: disabled ? `${project.accentColor}55` : project.accentColor }}>
      {disabled ? 'Coming Soon' : 'View Details'}
    </button>
  )
}
