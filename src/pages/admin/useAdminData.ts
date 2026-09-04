import { useEffect, useState } from 'react'
import { STORE_EVENT, getBusinessArms, getClientWorks, getMarqueeItems, getMusicUrl, getProductApps, getProductWebsites } from '../../data/store'

export default function useAdminData() {
  const [apps, setApps] = useState(getProductApps)
  const [websites, setWebsites] = useState(getProductWebsites)
  const [works, setWorks] = useState(getClientWorks)
  const [businessArms, setBusinessArms] = useState(getBusinessArms)
  const [marqueeItems, setMarqueeItems] = useState(getMarqueeItems)
  const [musicUrl, setMusicUrl] = useState(getMusicUrl)

  useEffect(() => {
    const refresh = () => {
      setApps(getProductApps()); setWebsites(getProductWebsites()); setWorks(getClientWorks())
      setBusinessArms(getBusinessArms()); setMarqueeItems(getMarqueeItems()); setMusicUrl(getMusicUrl())
    }
    window.addEventListener(STORE_EVENT, refresh)
    return () => window.removeEventListener(STORE_EVENT, refresh)
  }, [])

  return { apps, setApps, websites, setWebsites, works, setWorks, businessArms, setBusinessArms, marqueeItems, setMarqueeItems, musicUrl, setMusicUrl }
}
