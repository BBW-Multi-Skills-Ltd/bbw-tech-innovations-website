'use client'

import { lazy, Suspense, useCallback, useMemo, useState, type ReactNode } from 'react'
import Header from '@/components/layout/Header'
import { ScrollSync } from '@/components/ScrollSync'
import { SmoothScroll } from '@/components/SmoothScroll'
import CookieConsent from '@/components/privacy/CookieConsentBanner'
import useTheme from '@/lib/hooks/useTheme'
import { SiteActionsContext } from './SiteActions'

const ContactForm = lazy(() => import('@/components/contact/ContactForm'))

/** The site's interactive frame (homepage and case studies): nav, theme, contact form, cookies. */
export default function HomeShell({ children }: { children: ReactNode }) {
  const { dark, toggleTheme } = useTheme()
  const [contactOpen, setContactOpen] = useState(false)
  const openContact = useCallback(() => setContactOpen(true), [])
  const actions = useMemo(() => ({ dark, toggleTheme, openContact }), [dark, toggleTheme, openContact])

  return (
    <SiteActionsContext.Provider value={actions}>
      <SmoothScroll>
      <ScrollSync />
      <div className="bg-bbw-bg text-bbw-fg font-sans">
        <Header />
        {children}
        {contactOpen && <Suspense fallback={null}><ContactForm open={contactOpen} onClose={() => setContactOpen(false)} /></Suspense>}
        <CookieConsent />
      </div>
      </SmoothScroll>
    </SiteActionsContext.Provider>
  )
}
