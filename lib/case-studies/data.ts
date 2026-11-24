import { cacheLife, cacheTag } from 'next/cache'
import type { Project } from '@/lib/data/projects'
import { CONTENT_TAG, getSiteContent } from '@/lib/site-content'
import { publicSupabase } from '@/lib/supabase/public'
import { blocksFromProject } from './from-project'
import type { Block } from './types'

export type CaseStudy = {
  project: Project
  blocks: Block[]
  /** True when the blocks were built from the project's fields (no stored blocks yet). */
  derived: boolean
  next: { slug: string; name: string } | null
}

/** Own products that are "coming soon" have no page (as they had no popup). */
export const hasCaseStudy = (project: Project) => !(project.isOwn && project.status === 'coming-soon')

/** Every published project with a page, in list order: own products, then client work. */
async function caseStudyProjects() {
  const { apps, websites, works } = await getSiteContent()
  return [...apps, ...websites, ...works].filter(hasCaseStudy)
}

export async function getCaseStudySlugs(): Promise<string[]> {
  return (await caseStudyProjects()).map(project => project.id)
}

/** The project's stored, published blocks in order (empty when it has none, or on an error). */
async function storedBlocks(projectId: string): Promise<{ blocks: Block[]; reached: boolean }> {
  const db = publicSupabase()
  if (!db) return { blocks: [], reached: false }
  const { data, error } = await db
    .from('case_study_blocks')
    // public_data: the block's data without diagram drawings (fetched separately from /diagrams/[id]).
    .select('id, block_type, section_label, data:public_data')
    .eq('project_id', projectId)
    .order('display_order', { ascending: true })
  if (error || !data) return { blocks: [], reached: false }
  return {
    reached: true,
    blocks: data.map(row => ({ id: row.id, type: row.block_type, sectionLabel: row.section_label ?? null, data: row.data }) as Block),
  }
}

/** One case study, or null when the project doesn't exist, isn't published, or is a coming-soon product. */
export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  'use cache'
  cacheTag(CONTENT_TAG)

  const projects = await caseStudyProjects()
  const at = projects.findIndex(project => project.id === slug)
  if (at < 0) {
    cacheLife('minutes')
    return null
  }
  const project = projects[at]
  const stored = await storedBlocks(project.id)
  // Cache briefly when the database didn't answer, so a blip isn't kept.
  if (stored.reached) cacheLife('hours')
  else cacheLife('minutes')

  const derived = stored.blocks.length === 0
  const nextProject = projects.length > 1 ? projects[(at + 1) % projects.length] : null
  return {
    project,
    blocks: derived ? blocksFromProject(project) : stored.blocks,
    derived,
    next: nextProject ? { slug: nextProject.id, name: nextProject.name } : null,
  }
}
