import { useEffect, useState } from 'react'
import { getBusinessArms, getClientWorks, getMarqueeItems, getProductApps, getProductWebsites, STORE_EVENT } from '../data/store'

export default function useSiteContent() {
  const [apps, setApps] = useState(getProductApps)
  const [websites, setWebsites] = useState(getProductWebsites)
  const [works, setWorks] = useState(getClientWorks)
  const [businessArms, setBusinessArms] = useState(getBusinessArms)
  const [marqueeItems, setMarqueeItems] = useState(getMarqueeItems)

  useEffect(() => {
    const refresh = () => {
      setApps(getProductApps())
      setWebsites(getProductWebsites())
      setWorks(getClientWorks())
      setBusinessArms(getBusinessArms())
      setMarqueeItems(getMarqueeItems())
    }
    window.addEventListener(STORE_EVENT, refresh)
    return () => window.removeEventListener(STORE_EVENT, refresh)
  }, [])

  return { apps, websites, works, businessArms, marqueeItems }
}
