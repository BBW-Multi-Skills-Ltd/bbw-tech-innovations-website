import { useEffect, useState } from 'react'
import { getBusinessArms, getClientWorks, getMarqueeItems, getMusicUrl, getProductApps, getProductWebsites, getSocialLinks } from '../data/store'
import { defaultCompanyDetails, defaultPrivacyPolicy, defaultProcessSteps, defaultTechnologies } from '../data/siteContent'

const isSupabaseConfigured = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)

export default function useSiteContent() {
  const [apps, setApps] = useState(getProductApps)
  const [websites, setWebsites] = useState(getProductWebsites)
  const [works, setWorks] = useState(getClientWorks)
  const [businessArms, setBusinessArms] = useState(getBusinessArms)
  const [marqueeItems, setMarqueeItems] = useState(getMarqueeItems)
  const [musicUrl, setMusicUrl] = useState(getMusicUrl)
  const [socialLinks, setSocialLinks] = useState(getSocialLinks)
  const [processSteps, setProcessSteps] = useState(defaultProcessSteps)
  const [technologies, setTechnologies] = useState(defaultTechnologies)
  const [privacyPolicy, setPrivacyPolicy] = useState(defaultPrivacyPolicy)
  const [companyDetails, setCompanyDetails] = useState(defaultCompanyDetails)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    void import('../features/cms/contentRepository').then(({ fetchProjects, fetchBusinessArms, fetchMarqueeItems, fetchMusicUrl, fetchSocialLinks, fetchProcessSteps, fetchTechnologies, fetchPrivacyPolicy, fetchCompanyDetails }) => Promise.all([fetchProjects(), fetchBusinessArms(), fetchMarqueeItems(), fetchMusicUrl(), fetchSocialLinks(), fetchProcessSteps(defaultProcessSteps), fetchTechnologies(defaultTechnologies), fetchPrivacyPolicy(defaultPrivacyPolicy), fetchCompanyDetails(defaultCompanyDetails)]))
      .then(([projects, arms, marquee, music, social, process, technologies, privacy, company]) => {
        if (projects.length) {
          setApps(projects.filter(project => project.isOwn && project.type === 'app'))
          setWebsites(projects.filter(project => project.isOwn && project.type === 'website'))
          setWorks(projects.filter(project => !project.isOwn))
        }
        if (arms.length) setBusinessArms(arms)
        if (marquee.length) setMarqueeItems(marquee)
        setMusicUrl(music)
        if (social.length) setSocialLinks(social)
        setProcessSteps(process)
        setTechnologies(technologies)
        setPrivacyPolicy(privacy)
        setCompanyDetails(company)
      })
      .catch(() => undefined)
  }, [])

  return { apps, websites, works, businessArms, marqueeItems, musicUrl, socialLinks, processSteps, technologies, privacyPolicy, companyDetails }
}
