import { refreshPublicContent } from '@/app/actions/refresh-content'
import { supabase } from '@/lib/supabase/browser'
import type { Block, BlockType } from '@/lib/case-studies/types'

/**
 * Case study blocks in the admin: reads and writes with the signed-in user's
 * session, so Row Level Security decides (CMS owners and editors write; see
 * migration 20261124090000). After every write the public pages refresh
 * (the same server action as the other admin saves).
 */
export type BlockRow = {
  id: string
  project_id: string
  block_type: BlockType
  section_label: string | null
  data: Record<string, unknown>
  display_order: number
  is_published: boolean
}

function client() {
  if (!supabase) throw new Error('Supabase is not configured.')
  return supabase
}

const TABLE = 'case_study_blocks'
const COLUMNS = 'id, project_id, block_type, section_label, data, display_order, is_published'

/** Tells the server to refresh the public pages (best effort, as for other saves). */
async function refreshPublic() {
  const { data } = await client().auth.getSession()
  if (data.session) await refreshPublicContent(data.session.access_token).catch(() => undefined)
}

const fail = (error: { message: string } | null, what: string) => {
  if (error) throw new Error(`Could not ${what}: ${error.message}`)
}

/** Every block of the project, published or not, in order. */
export async function fetchCaseStudyBlocks(projectId: string): Promise<BlockRow[]> {
  const { data, error } = await client().from(TABLE).select(COLUMNS).eq('project_id', projectId).order('display_order', { ascending: true })
  fail(error, 'load the case study')
  return (data ?? []) as BlockRow[]
}

export async function insertCaseStudyBlock(projectId: string, block: { type: BlockType; sectionLabel: string | null; data: Record<string, unknown> }, displayOrder: number): Promise<BlockRow> {
  const { data, error } = await client()
    .from(TABLE)
    .insert({ project_id: projectId, block_type: block.type, section_label: block.sectionLabel, data: block.data, display_order: displayOrder })
    .select(COLUMNS)
    .single()
  fail(error, 'add the block')
  await refreshPublic()
  return data as BlockRow
}

export async function updateCaseStudyBlock(id: string, block: { sectionLabel: string | null; data: Record<string, unknown> }): Promise<BlockRow> {
  const { data, error } = await client().from(TABLE).update({ section_label: block.sectionLabel, data: block.data }).eq('id', id).select(COLUMNS).single()
  fail(error, 'save the block')
  await refreshPublic()
  return data as BlockRow
}

export async function deleteCaseStudyBlock(id: string) {
  const { error } = await client().from(TABLE).delete().eq('id', id)
  fail(error, 'delete the block')
  await refreshPublic()
}

export async function setCaseStudyBlockPublished(id: string, isPublished: boolean) {
  const { error } = await client().from(TABLE).update({ is_published: isPublished }).eq('id', id)
  fail(error, 'change that')
  await refreshPublic()
}

/** Saves the order: display_order 1, 2, 3… in the given order. */
export async function reorderCaseStudyBlocks(projectId: string, ids: string[]) {
  const results = await Promise.all(ids.map((id, i) => client().from(TABLE).update({ display_order: i + 1 }).eq('id', id).eq('project_id', projectId)))
  fail(results.find(result => result.error)?.error ?? null, 'save the new order')
  await refreshPublic()
}

/**
 * "Start from…": stores the blocks the page shows now (bundled or built from
 * the project's fields), so the public page looks the same. Refuses when the
 * project already has blocks.
 */
export async function startCaseStudyFrom(projectId: string, blocks: Block[]): Promise<BlockRow[]> {
  const { count, error: countError } = await client().from(TABLE).select('id', { count: 'exact', head: true }).eq('project_id', projectId)
  fail(countError, 'check the case study')
  if (count) throw new Error('This case study already has blocks. Reload the page.')
  const { data, error } = await client()
    .from(TABLE)
    .insert(blocks.map((block, i) => ({ project_id: projectId, block_type: block.type, section_label: block.sectionLabel, data: block.data, display_order: i + 1 })))
    .select(COLUMNS)
  fail(error, 'create the blocks')
  await refreshPublic()
  return ((data ?? []) as BlockRow[]).sort((a, b) => a.display_order - b.display_order)
}
