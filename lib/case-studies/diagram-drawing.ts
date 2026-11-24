import { cacheLife, cacheTag } from 'next/cache'
import { CONTENT_TAG } from '@/lib/site-content'
import { publicSupabase } from '@/lib/supabase/public'

/** A diagram's saved drawing: one theme-following SVG, or a light/dark pair. */
export type DiagramDrawing = { svg: string } | { light: string; dark: string }

/**
 * The current drawing of a published diagram block (null when there isn't
 * one, or it's out of date with its source). Cached with the site content.
 */
export async function getDiagramDrawing(id: string): Promise<DiagramDrawing | null> {
  'use cache'
  cacheTag(CONTENT_TAG)
  const db = publicSupabase()
  const { data, error } = db
    ? await db.from('case_study_blocks').select('data').eq('id', id).eq('block_type', 'diagram').maybeSingle()
    : { data: null, error: null }
  if (error) {
    cacheLife('minutes') // the database didn't answer: try again soon
    return null
  }
  cacheLife('hours')
  const d = data?.data as Record<string, string | undefined> | undefined
  if (!d || d.svgSource !== d.source) return null
  if (d.svg) return { svg: d.svg }
  if (d.svgLight && d.svgDark) return { light: d.svgLight, dark: d.svgDark }
  return null
}
