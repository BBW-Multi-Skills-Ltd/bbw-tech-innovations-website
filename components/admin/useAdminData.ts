'use client'

import { useCallback, useEffect, useState } from 'react'
import { refreshPublicContent } from '@/app/actions/refresh-content'
import { supabase } from '@/lib/supabase/browser'
import type { BusinessArm } from '@/lib/data/company'
import { getBusinessArms, getClientWorks, getMarqueeItems, getProductApps, getProductWebsites, getSocialLinks } from '@/lib/data/store'
import type { Project } from '@/lib/data/projects'
import type { SocialLink } from '@/lib/data/socialLinks'
import type { CompanyDetails, PrivacyPolicyContent } from '@/lib/data/siteContent'
import { defaultCompanyDetails, defaultPrivacyPolicy, defaultProcessSteps, defaultTechnologies } from '@/lib/data/siteContent'
import type { ProcessStep } from '@/lib/content/process'
import { fetchBusinessArms, fetchCompanyDetails, fetchMarqueeItems, fetchPrivacyPolicy, fetchProcessSteps, fetchProjects, fetchSocialLinks, fetchTechnologies, removeProject, replaceMarqueeItems, replaceSocialLinks, saveBusinessArms, saveCompanyDetails, savePrivacyPolicy, saveProcessSteps, saveProject, saveTechnologies, setProjectPublished } from '@/lib/cms/contentRepository'

export default function useAdminData() {
  const [apps, setApps] = useState(getProductApps)
  const [websites, setWebsites] = useState(getProductWebsites)
  const [works, setWorks] = useState(getClientWorks)
  const [businessArms, setBusinessArms] = useState(getBusinessArms)
  const [marqueeItems, setMarqueeItems] = useState(getMarqueeItems)
  const [socialLinks, setSocialLinks] = useState(getSocialLinks)
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>(defaultProcessSteps)
  const [technologies, setTechnologies] = useState<string[]>(defaultTechnologies)
  const [privacyPolicy, setPrivacyPolicy] = useState<PrivacyPolicyContent>(defaultPrivacyPolicy)
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>(defaultCompanyDetails)
  const [needsInitialImport, setNeedsInitialImport] = useState(false)

  const refresh = useCallback(async () => {
    const [projects, arms, marquee, social, process, technologies, privacy, company] = await Promise.all([fetchProjects(false), fetchBusinessArms(), fetchMarqueeItems(), fetchSocialLinks(false), fetchProcessSteps(defaultProcessSteps), fetchTechnologies(defaultTechnologies), fetchPrivacyPolicy(defaultPrivacyPolicy), fetchCompanyDetails(defaultCompanyDetails)])
    setNeedsInitialImport(projects.length === 0 || arms.length === 0 || marquee.length === 0)
    if (projects.length) {
      setApps(projects.filter(project => project.isOwn && project.type === 'app'))
      setWebsites(projects.filter(project => project.isOwn && project.type === 'website'))
      setWorks(projects.filter(project => !project.isOwn))
    }
    if (arms.length) setBusinessArms(arms)
    if (marquee.length) setMarqueeItems(marquee)
    if (social.length) setSocialLinks(social)
    setProcessSteps(process)
    setTechnologies(technologies)
    setPrivacyPolicy(privacy)
    setCompanyDetails(company)
  }, [])

  // After a save: reload the admin's copy, then tell the server to refresh the
  // public pages' cached content (they read Supabase on the server).
  const saved = useCallback(async () => {
    await refresh()
    const { data } = await supabase?.auth.getSession() ?? { data: { session: null } }
    if (data.session) void refreshPublicContent(data.session.access_token).catch(() => undefined)
  }, [refresh])

  useEffect(() => {
    const initialRefresh = window.setTimeout(() => void refresh().catch(() => undefined), 0)
    return () => window.clearTimeout(initialRefresh)
  }, [refresh])

  const persistProject = async (project: Project) => {
    const collection = project.isOwn ? (project.type === 'app' ? apps : websites) : works
    await saveProject(project, Math.max(collection.findIndex(item => item.id === project.id), 0))
    await saved()
  }
  const deleteProject = async (id: string) => { await removeProject(id); await saved() }
  const persistProjectVisibility = async (id: string, isPublished: boolean) => { await setProjectPublished(id, isPublished); await saved() }
  const persistArms = async (arms: BusinessArm[]) => { await saveBusinessArms(arms); await saved() }
  const persistMarquee = async (items: string[]) => { await replaceMarqueeItems(items); await saved() }
  const persistSocialLinks = async (links: SocialLink[]) => { await replaceSocialLinks(links); await saved() }
  const persistProcessSteps = async (steps: ProcessStep[]) => { await saveProcessSteps(steps); await saved() }
  const persistTechnologies = async (items: string[]) => { await saveTechnologies(items); await saved() }
  const persistPrivacyPolicy = async (policy: PrivacyPolicyContent) => { await savePrivacyPolicy(policy); await saved() }
  const persistCompanyDetails = async (details: CompanyDetails) => { await saveCompanyDetails(details); await saved() }
  const importCurrentContent = async () => {
    await Promise.all([...apps, ...websites, ...works].map((project, index) => saveProject(project, index)))
    await saveBusinessArms(businessArms)
    await replaceMarqueeItems(marqueeItems)
    await saved()
  }

  return { apps, setApps, websites, setWebsites, works, setWorks, businessArms, setBusinessArms, marqueeItems, setMarqueeItems, socialLinks, setSocialLinks, processSteps, setProcessSteps, technologies, setTechnologies, privacyPolicy, setPrivacyPolicy, companyDetails, setCompanyDetails, needsInitialImport, persistProject, deleteProject, persistProjectVisibility, persistArms, persistMarquee, persistSocialLinks, persistProcessSteps, persistTechnologies, persistPrivacyPolicy, persistCompanyDetails, importCurrentContent }
}
