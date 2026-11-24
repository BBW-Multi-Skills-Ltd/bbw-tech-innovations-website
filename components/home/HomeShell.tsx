'use client'

import { lazy, Suspense, useCallback, useMemo, useState, type ReactNode } from 'react'
import Header from '@/components/layout/Header'
import MusicPlayer from '@/components/MusicPlayer'
import { ScrollSync } from '@/components/ScrollSync'
import { SmoothScroll } from '@/components/SmoothScroll'
import CookieConsent from '@/components/privacy/CookieConsentBanner'
import type { InquiryMode } from '@/components/contact/types'
import useTheme from '@/lib/hooks/useTheme'
import { SiteActionsContext } from './SiteActions'

const ContactForm = lazy(() => import('@/components/contact/ContactForm'))

/** The site's interactive frame (homepage and case studies): nav, theme, contact form, music, cookies. */
export default function HomeShell({ musicUrl, children }: { musicUrl: string; children: ReactNode }) {
  const { dark, toggleTheme } = useTheme()
  const [contactOpen, setContactOpen] = useState(false)
  const [contactMode, setContactMode] = useState<InquiryMode>('idle')
  const openContact = useCallback((mode?: Exclude<InquiryMode, 'idle'>) => {
    setContactMode(mode ?? 'idle')
    setContactOpen(true)
  }, [])
  const actions = useMemo(() => ({ dark, toggleTheme, openContact }), [dark, toggleTheme, openContact])

  return (
    <SiteActionsContext.Provider value={actions}>
      <SmoothScroll>
      <ScrollSync />
      <div className="bg-bbw-bg text-bbw-fg font-sans">
        <Header />
        {children}
        {contactOpen && <Suspense fallback={null}><ContactForm open={contactOpen} initialMode={contactMode} onClose={() => setContactOpen(false)} /></Suspense>}
        <MusicPlayer url={musicUrl} />
        <CookieConsent />
      </div>
      </SmoothScroll>
    </SiteActionsContext.Provider>
  )
}
