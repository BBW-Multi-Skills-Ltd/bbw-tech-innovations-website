import { cacheLife, cacheTag } from 'next/cache'
import { fetchBusinessArms, fetchCompanyDetails, fetchMarqueeItems, fetchMusicUrl, fetchPrivacyPolicy, fetchProcessSteps, fetchProjects, fetchSocialLinks, fetchTechnologies } from '@/lib/cms/contentRepository'
import { defaultBusinessArms } from '@/lib/data/company'
import { clientWorks, productApps, productWebsites } from '@/lib/data/projects'
import { defaultCompanyDetails, defaultPrivacyPolicy, defaultProcessSteps, defaultTechnologies } from '@/lib/data/siteContent'
import { defaultSocialLinks } from '@/lib/data/socialLinks'
import { DEFAULT_MARQUEE_ITEMS } from '@/lib/data/store'
import { publicSupabase } from '@/lib/supabase/public'

/** Cache tag for all public content. The admin refreshes it after every save. */
export const CONTENT_TAG = 'content'

/** The bundled content, used when Supabase is not configured or can't be reached. */
function bundledContent() {
  return {
    apps: productApps,
    websites: productWebsites,
    works: clientWorks,
    businessArms: defaultBusinessArms,
    marqueeItems: DEFAULT_MARQUEE_ITEMS,
    musicUrl: '',
    socialLinks: defaultSocialLinks,
    processSteps: defaultProcessSteps,
    technologies: defaultTechnologies,
    privacyPolicy: defaultPrivacyPolicy,
    companyDetails: defaultCompanyDetails,
  }
}

export type SiteContent = ReturnType<typeof bundledContent>

/**
 * Everything the public pages show, read on the server. Same rules as the old
 * browser loader: empty lists keep the bundled defaults, and any error keeps
 * all of them.
 */
export async function getSiteContent(): Promise<SiteContent> {
  'use cache'
  cacheTag(CONTENT_TAG)
  cacheLife('minutes')

  const content = bundledContent()
  const db = publicSupabase()
  if (!db) return content
  try {
    const [projects, arms, marquee, music, social, process, technologies, privacy, company] = await Promise.all([
      fetchProjects(true, db), fetchBusinessArms(db), fetchMarqueeItems(db), fetchMusicUrl(db), fetchSocialLinks(true, db),
      fetchProcessSteps(defaultProcessSteps, db), fetchTechnologies(defaultTechnologies, db),
      fetchPrivacyPolicy(defaultPrivacyPolicy, db), fetchCompanyDetails(defaultCompanyDetails, db),
    ])
    if (projects.length) {
      content.apps = projects.filter(project => project.isOwn && project.type === 'app')
      content.websites = projects.filter(project => project.isOwn && project.type === 'website')
      content.works = projects.filter(project => !project.isOwn)
    }
    if (arms.length) content.businessArms = arms
    if (marquee.length) content.marqueeItems = marquee
    content.musicUrl = music
    if (social.length) content.socialLinks = social
    content.processSteps = process
    content.technologies = technologies
    content.privacyPolicy = privacy
    content.companyDetails = company
    return content
  } catch {
    // Keep the defaults (refreshed every minute or so, until Supabase answers again).
    cacheLife('minutes')
    return bundledContent()
  }
}
