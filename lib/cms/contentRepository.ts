import type { BusinessArm } from '@/lib/data/company'
import type { ClientReview, Project } from '@/lib/data/projects'
import type { SocialLink } from '@/lib/data/socialLinks'
import type { CompanyDetails, PrivacyPolicyContent } from '@/lib/data/siteContent'
import type { ProcessStep } from '@/lib/content/process'
import type { SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/browser'
import { externalUrl } from '@/lib/urls'
import { isCombined, isProjectType, legacyFields, projectTypeOf } from '@/lib/project-types'

type ProjectRow = Record<string, unknown> & { id: string }
type ReviewRow = { project_id: string; quote: string; client_name: string; client_role: string | null; source: ClientReview['source'] | null }
type ArmRow = { id: string; name: string; role: string; status: BusinessArm['status']; website_url: string | null }

// Reads take an optional client so server pages can pass their own (lib/site-content.ts).
const client = (): SupabaseClient => {
  if (!supabase) throw new Error('Supabase is not configured.')
  return supabase
}

const list = <T>(value: unknown): T[] => Array.isArray(value) ? value as T[] : []
const text = (value: unknown) => typeof value === 'string' ? value : ''
const websiteUrl = (value?: string) => {
  const trimmed = value?.trim()
  return trimmed && trimmed !== '#' && !/^https?:\/\/$/i.test(trimmed) ? externalUrl(trimmed) : null
}

function fromRow(row: ProjectRow, review?: ReviewRow): Project {
  return {
    id: row.id, type: text(row.kind) as Project['type'], name: text(row.name), tagline: text(row.tagline),
    shortDesc: text(row.short_description), about: text(row.about), category: text(row.category),
    status: text(row.status) as Project['status'], platform: text(row.platform) || undefined,
    androidAvailability: text(row.android_availability) as Project['androidAvailability'],
    iosAvailability: text(row.ios_availability) as Project['iosAvailability'], siteUrl: text(row.site_url) || undefined,
    accentColor: text(row.accent_color), mockBg: text(row.mock_bg), cardImageUrl: text(row.card_image_url) || undefined, logoUrl: text(row.logo_url) || undefined, screens: list<Project['screens'][number]>(row.screens),
    roles: list<Project['roles'][number]>(row.roles), features: list<Project['features'][number]>(row.features),
    tech: list<string>(row.tech), isOwn: row.is_own === true, isPublished: row.is_published !== false, isFeatured: row.is_featured === true, projectType: isProjectType(row.project_type) ? row.project_type : undefined,
    webRole: row.web_role === 'product' || row.web_role === 'marketing' ? row.web_role : null, year: text(row.year),
    badge: text(row.badge) as Project['badge'], demoVideoUrl: text(row.demo_video_url) || undefined, qrUrl: text(row.qr_url) || undefined,
    review: review ? { quote: review.quote, clientName: review.client_name, clientRole: review.client_role || undefined, source: review.source || 'other' } : undefined,
  }
}

// Writes the project type and, from it, the old kind/badge the live site (main) still reads.
const toRow = (project: Project, sortOrder: number) => {
  const projectType = projectTypeOf(project)
  const legacy = legacyFields(projectType)
  return {
  id: project.id, kind: legacy.kind, project_type: projectType, web_role: isCombined(projectType) ? (project.webRole ?? 'marketing') : null, name: project.name, tagline: project.tagline, short_description: project.shortDesc,
  about: project.about, category: project.category, status: project.status, platform: project.platform || null,
  android_availability: project.androidAvailability || null, ios_availability: project.iosAvailability || null,
  site_url: websiteUrl(project.siteUrl), accent_color: project.accentColor, mock_bg: project.mockBg, card_image_url: project.cardImageUrl || null, logo_url: project.logoUrl || null, screens: project.screens,
  roles: project.roles, features: project.features, tech: project.tech, is_own: project.isOwn, year: project.year,
  // Client work: the badge picks its card on the live site. Own projects keep theirs (unused).
  badge: project.isOwn ? (project.badge || null) : legacy.badge, demo_video_url: project.demoVideoUrl || null, qr_url: project.qrUrl || null, is_published: project.isPublished ?? true, is_featured: project.isFeatured ?? false, sort_order: sortOrder,
  }
}

export async function fetchProjects(publishedOnly = true, db: SupabaseClient = client()) {
  let query = db.from('projects').select('*').order('sort_order')
  if (publishedOnly) query = query.eq('is_published', true)
  const { data, error } = await query
  if (error) throw error
  const projects = data as ProjectRow[]
  if (!projects.length) return []

  let reviewQuery = db
    .from('project_reviews')
    .select('project_id, quote, client_name, client_role, source')
    .in('project_id', projects.map(project => project.id))
    .order('sort_order')
  if (publishedOnly) reviewQuery = reviewQuery.eq('is_published', true)
  const { data: reviewData, error: reviewError } = await reviewQuery
  if (reviewError) throw reviewError
  const reviews = new Map((reviewData as ReviewRow[]).map(review => [review.project_id, review]))
  return projects.map(project => fromRow(project, reviews.get(project.id)))
}

export async function saveProject(project: Project, sortOrder = 0) {
  const db = client()
  const { error } = await db.from('projects').upsert(toRow(project, sortOrder))
  if (error) throw error
  if (project.review?.quote.trim()) {
    const { error: reviewError } = await db.from('project_reviews').upsert({
      project_id: project.id, quote: project.review.quote.trim(), client_name: project.review.clientName.trim(),
      client_role: project.review.clientRole?.trim() || '', source: project.review.source || 'other', is_published: true, sort_order: 0,
    }, { onConflict: 'project_id' })
    if (reviewError) throw reviewError
    return
  }
  const { error: removeError } = await db.from('project_reviews').delete().eq('project_id', project.id)
  if (removeError) throw removeError
}

export async function removeProject(id: string) {
  const { error } = await client().from('projects').delete().eq('id', id)
  if (error) throw error
}

export async function setProjectPublished(id: string, isPublished: boolean) {
  const { error } = await client().from('projects').update({ is_published: isPublished }).eq('id', id)
  if (error) throw error
}

export async function fetchBusinessArms(db: SupabaseClient = client()) {
  const { data, error } = await db.from('business_arms').select('*').eq('is_published', true).order('sort_order')
  if (error) throw error
  return (data as ArmRow[]).map(({ website_url, ...arm }) => ({ ...arm, websiteUrl: website_url || undefined }))
}

export async function saveBusinessArms(arms: BusinessArm[]) {
  const db = client()
  const rows = arms.map((arm, sort_order) => ({
    id: arm.id, name: arm.name, role: arm.role, status: arm.status,
    website_url: arm.websiteUrl || null, is_published: true, sort_order,
  }))
  const { error } = await db.from('business_arms').upsert(rows)
  if (error) throw error
}

export async function fetchMarqueeItems(db: SupabaseClient = client()) {
  const { data, error } = await db.from('marquee_items').select('label').eq('is_enabled', true).order('sort_order')
  if (error) throw error
  return (data as { label: string }[]).map(item => item.label)
}

export async function replaceMarqueeItems(items: string[]) {
  const db = client()
  const { data, error } = await db.from('marquee_items').select('id')
  if (error) throw error
  const ids = (data as { id: string }[]).map(item => item.id)
  if (ids.length) {
    const { error: removeError } = await db.from('marquee_items').delete().in('id', ids)
    if (removeError) throw removeError
  }
  if (items.length) {
    const { error: insertError } = await db.from('marquee_items').insert(items.map((label, sort_order) => ({ label, sort_order })))
    if (insertError) throw insertError
  }
}

export async function fetchSiteSetting<T>(key: string, fallback: T, db: SupabaseClient = client()): Promise<T> {
  const { data, error } = await db.from('site_settings').select('value').eq('setting_key', key).maybeSingle()
  if (error) throw error
  return data?.value ? data.value as T : fallback
}

export async function saveSiteSetting<T>(key: string, value: T) {
  const { error } = await client().from('site_settings').upsert({ setting_key: key, value })
  if (error) throw error
}

export const fetchProcessSteps = (fallback: ProcessStep[], db?: SupabaseClient) => fetchSiteSetting('process_steps', fallback, db)
export const saveProcessSteps = (steps: ProcessStep[]) => saveSiteSetting('process_steps', steps)
export const fetchTechnologies = (fallback: string[], db?: SupabaseClient) => fetchSiteSetting('technologies', fallback, db)
export const saveTechnologies = (items: string[]) => saveSiteSetting('technologies', items)
export const fetchPrivacyPolicy = (fallback: PrivacyPolicyContent, db?: SupabaseClient) => fetchSiteSetting('privacy_policy', fallback, db)
export const savePrivacyPolicy = (policy: PrivacyPolicyContent) => saveSiteSetting('privacy_policy', policy)
export const fetchCompanyDetails = (fallback: CompanyDetails, db?: SupabaseClient) => fetchSiteSetting('company_details', fallback, db)
export const saveCompanyDetails = (details: CompanyDetails) => saveSiteSetting('company_details', details)

export async function fetchSocialLinks(enabledOnly = true, db: SupabaseClient = client()) {
  let query = db.from('social_links').select('id,platform,url,is_enabled').order('sort_order')
  if (enabledOnly) query = query.eq('is_enabled', true)
  const { data, error } = await query
  if (error) throw error
  return (data as { id: string; platform: string; url: string; is_enabled: boolean }[]).map(link => ({ id: link.id, platform: link.platform, url: link.url, isEnabled: link.is_enabled }))
}

export async function replaceSocialLinks(links: SocialLink[]) {
  const db = client()
  const rows = links.map(link => ({
    platform: link.platform.trim().toLowerCase(),
    url: link.url.trim(),
    is_enabled: link.isEnabled,
  }))
  const { error } = await db.rpc('replace_social_links', { next_links: rows.map(row => ({ platform: row.platform, url: row.url, isEnabled: row.is_enabled })) })
  if (error) throw new Error(error.message)
}
