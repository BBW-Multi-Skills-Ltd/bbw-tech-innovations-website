import { useCallback, useEffect, useState } from 'react'
import type { BusinessArm } from '../../data/company'
import { getBusinessArms, getClientWorks, getMarqueeItems, getMusicUrl, getProductApps, getProductWebsites, getSocialLinks } from '../../data/store'
import type { Project } from '../../data/projects'
import type { SocialLink } from '../../data/socialLinks'
import { fetchBusinessArms, fetchMarqueeItems, fetchMusicUrl, fetchProjects, fetchSocialLinks, removeProject, replaceMarqueeItems, replaceSocialLinks, saveBusinessArms, saveMusicUrl, saveProject } from '../../features/cms/contentRepository'

export default function useAdminData() {
  const [apps, setApps] = useState(getProductApps)
  const [websites, setWebsites] = useState(getProductWebsites)
  const [works, setWorks] = useState(getClientWorks)
  const [businessArms, setBusinessArms] = useState(getBusinessArms)
  const [marqueeItems, setMarqueeItems] = useState(getMarqueeItems)
  const [musicUrl, setMusicUrl] = useState(getMusicUrl)
  const [socialLinks, setSocialLinks] = useState(getSocialLinks)
  const [needsInitialImport, setNeedsInitialImport] = useState(false)

  const refresh = useCallback(async () => {
    const [projects, arms, marquee, music, social] = await Promise.all([fetchProjects(false), fetchBusinessArms(), fetchMarqueeItems(), fetchMusicUrl(), fetchSocialLinks(false)])
    setNeedsInitialImport(projects.length === 0 || arms.length === 0 || marquee.length === 0)
    if (projects.length) {
      setApps(projects.filter(project => project.isOwn && project.type === 'app'))
      setWebsites(projects.filter(project => project.isOwn && project.type === 'website'))
      setWorks(projects.filter(project => !project.isOwn))
    }
    if (arms.length) setBusinessArms(arms)
    if (marquee.length) setMarqueeItems(marquee)
    setMusicUrl(music)
    if (social.length) setSocialLinks(social)
  }, [])

  useEffect(() => {
    const initialRefresh = window.setTimeout(() => void refresh().catch(() => undefined), 0)
    return () => window.clearTimeout(initialRefresh)
  }, [refresh])

  const persistProject = async (project: Project) => {
    const collection = project.isOwn ? (project.type === 'app' ? apps : websites) : works
    await saveProject(project, Math.max(collection.findIndex(item => item.id === project.id), 0))
    await refresh()
  }
  const deleteProject = async (id: string) => { await removeProject(id); await refresh() }
  const persistArms = async (arms: BusinessArm[]) => { await saveBusinessArms(arms); await refresh() }
  const persistMarquee = async (items: string[]) => { await replaceMarqueeItems(items); await refresh() }
  const persistMusic = async (url: string) => { await saveMusicUrl(url); await refresh() }
  const persistSocialLinks = async (links: SocialLink[]) => { await replaceSocialLinks(links); await refresh() }
  const importCurrentContent = async () => {
    await Promise.all([...apps, ...websites, ...works].map((project, index) => saveProject(project, index)))
    await saveBusinessArms(businessArms)
    await replaceMarqueeItems(marqueeItems)
    await saveMusicUrl(musicUrl)
    await refresh()
  }

  return { apps, setApps, websites, setWebsites, works, setWorks, businessArms, setBusinessArms, marqueeItems, setMarqueeItems, musicUrl, socialLinks, setSocialLinks, needsInitialImport, persistProject, deleteProject, persistArms, persistMarquee, persistMusic, persistSocialLinks, importCurrentContent }
}
