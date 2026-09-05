import type { BusinessArm } from '../../data/company'
import type { ClientReview, Project } from '../../data/projects'
import type { SocialLink } from '../../data/socialLinks'
import { supabase } from '../../lib/supabase'

type ProjectRow = Record<string, unknown> & { id: string; project_reviews?: ReviewRow[] }
type ReviewRow = { quote: string; client_name: string; client_role: string | null; source: ClientReview['source'] | null }
type ArmRow = { id: string; name: string; role: string; status: BusinessArm['status']; website_url: string | null }

const client = () => {
  if (!supabase) throw new Error('Supabase is not configured.')
  return supabase
}

const list = <T>(value: unknown): T[] => Array.isArray(value) ? value as T[] : []
const text = (value: unknown) => typeof value === 'string' ? value : ''

function fromRow(row: ProjectRow): Project {
  const review = row.project_reviews?.[0]
  return {
    id: row.id, type: text(row.kind) as Project['type'], name: text(row.name), tagline: text(row.tagline),
    shortDesc: text(row.short_description), about: text(row.about), category: text(row.category),
    status: text(row.status) as Project['status'], platform: text(row.platform) || undefined,
    androidAvailability: text(row.android_availability) as Project['androidAvailability'],
    iosAvailability: text(row.ios_availability) as Project['iosAvailability'], siteUrl: text(row.site_url) || undefined,
    accentColor: text(row.accent_color), mockBg: text(row.mock_bg), cardImageUrl: text(row.card_image_url) || undefined, screens: list<Project['screens'][number]>(row.screens),
    roles: list<Project['roles'][number]>(row.roles), features: list<Project['features'][number]>(row.features),
    tech: list<string>(row.tech), isOwn: row.is_own === true, year: text(row.year),
    badge: text(row.badge) as Project['badge'], demoVideoUrl: text(row.demo_video_url) || undefined, qrUrl: text(row.qr_url) || undefined,
    review: review ? { quote: review.quote, clientName: review.client_name, clientRole: review.client_role || undefined, source: review.source || 'other' } : undefined,
  }
}

const toRow = (project: Project, sortOrder: number) => ({
  id: project.id, kind: project.type, name: project.name, tagline: project.tagline, short_description: project.shortDesc,
  about: project.about, category: project.category, status: project.status, platform: project.platform || null,
  android_availability: project.androidAvailability || null, ios_availability: project.iosAvailability || null,
  site_url: project.siteUrl || null, accent_color: project.accentColor, mock_bg: project.mockBg, card_image_url: project.cardImageUrl || null, screens: project.screens,
  roles: project.roles, features: project.features, tech: project.tech, is_own: project.isOwn, year: project.year,
  badge: project.badge || null, demo_video_url: project.demoVideoUrl || null, qr_url: project.qrUrl || null, is_published: true, sort_order: sortOrder,
})

export async function fetchProjects(publishedOnly = true) {
  let query = client().from('projects').select('*, project_reviews(*)').order('sort_order')
  if (publishedOnly) query = query.eq('is_published', true)
  const { data, error } = await query
  if (error) throw error
  return (data as ProjectRow[]).map(fromRow)
}

export async function saveProject(project: Project, sortOrder = 0) {
  const db = client()
  const { error } = await db.from('projects').upsert(toRow(project, sortOrder))
  if (error) throw error
  const { error: removeError } = await db.from('project_reviews').delete().eq('project_id', project.id)
  if (removeError) throw removeError
  if (project.review?.quote.trim()) {
    const { error: reviewError } = await db.from('project_reviews').insert({
      project_id: project.id, quote: project.review.quote.trim(), client_name: project.review.clientName.trim(),
      client_role: project.review.clientRole?.trim() || '', source: project.review.source || 'other', sort_order: 0,
    })
    if (reviewError) throw reviewError
  }
}

export async function removeProject(id: string) {
  const { error } = await client().from('projects').delete().eq('id', id)
  if (error) throw error
}

export async function fetchBusinessArms() {
  const { data, error } = await client().from('business_arms').select('*').eq('is_published', true).order('sort_order')
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

export async function fetchMarqueeItems() {
  const { data, error } = await client().from('marquee_items').select('label').eq('is_enabled', true).order('sort_order')
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

export async function fetchMusicUrl() {
  const { data, error } = await client().from('site_settings').select('value').eq('setting_key', 'music_url').maybeSingle()
  if (error) throw error
  return typeof (data?.value as { url?: unknown } | undefined)?.url === 'string' ? (data?.value as { url: string }).url : ''
}

export async function saveMusicUrl(url: string) {
  const { error } = await client().from('site_settings').upsert({ setting_key: 'music_url', value: { url } })
  if (error) throw error
}

export async function fetchSocialLinks(enabledOnly = true) {
  let query = client().from('social_links').select('id,platform,url,is_enabled').order('sort_order')
  if (enabledOnly) query = query.eq('is_enabled', true)
  const { data, error } = await query
  if (error) throw error
  return (data as { id: string; platform: string; url: string; is_enabled: boolean }[]).map(link => ({ id: link.id, platform: link.platform, url: link.url, isEnabled: link.is_enabled }))
}

export async function replaceSocialLinks(links: SocialLink[]) {
  const db = client()
  const isDatabaseId = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  const { data, error } = await db.from('social_links').select('id')
  if (error) throw error
  const existingIds = (data as { id: string }[]).map(link => link.id)
  const nextIds = links.map(link => link.id).filter(isDatabaseId)
  const removedIds = existingIds.filter(id => !nextIds.includes(id))
  if (removedIds.length) {
    const { error: removeError } = await db.from('social_links').delete().in('id', removedIds)
    if (removeError) throw removeError
  }
  const rows = links.map((link, sort_order) => ({
    ...(isDatabaseId(link.id) ? { id: link.id } : {}),
    platform: link.platform.trim().toLowerCase(),
    url: link.url.trim(),
    is_enabled: link.isEnabled,
    sort_order,
  }))
  if (rows.length) {
    const { error: saveError } = await db.from('social_links').upsert(rows, { onConflict: 'platform' })
    if (saveError) throw saveError
  }
}
