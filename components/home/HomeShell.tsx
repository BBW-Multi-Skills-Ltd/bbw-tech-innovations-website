'use client'

import { lazy, Suspense, useCallback, useMemo, useState, type ReactNode } from 'react'
import Header from '@/components/layout/Header'
import MusicPlayer from '@/components/MusicPlayer'
import { ScrollSync } from '@/components/ScrollSync'
import { SmoothScroll } from '@/components/SmoothScroll'
import CookieConsent from '@/components/privacy/CookieConsentBanner'
import type { InquiryMode } from '@/components/contact/types'
import type { Project } from '@/lib/data/projects'
import useTheme from '@/lib/hooks/useTheme'
import { SiteActionsContext } from './SiteActions'

const ContactForm = lazy(() => import('@/components/contact/ContactForm'))
const ProjectModal = lazy(() => import('@/components/projects/ProjectModal'))

/** The homepage's interactive frame: nav, theme, contact form, project popup, music, cookies. */
export default function HomeShell({ musicUrl, children }: { musicUrl: string; children: ReactNode }) {
  const { dark, toggleTheme } = useTheme()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [contactOpen, setContactOpen] = useState(false)
  const [contactMode, setContactMode] = useState<InquiryMode>('idle')
  const openProject = useCallback((project: Project) => {
    if (project.isOwn && project.status === 'coming-soon') return
    setSelectedProject(project)
  }, [])
  const closeProject = useCallback(() => setSelectedProject(null), [])
  const openContact = useCallback((mode?: Exclude<InquiryMode, 'idle'>) => {
    setContactMode(mode ?? 'idle')
    setContactOpen(true)
  }, [])
  const actions = useMemo(() => ({ dark, toggleTheme, openContact, openProject }), [dark, toggleTheme, openContact, openProject])

  return (
    <SiteActionsContext.Provider value={actions}>
      <SmoothScroll>
      <ScrollSync />
      <div className="bg-bbw-bg text-bbw-fg font-sans">
        <Header />
        {children}
        {selectedProject && <Suspense fallback={null}><ProjectModal project={selectedProject} onClose={closeProject} /></Suspense>}
        {contactOpen && <Suspense fallback={null}><ContactForm open={contactOpen} initialMode={contactMode} onClose={() => setContactOpen(false)} /></Suspense>}
        <MusicPlayer url={musicUrl} />
        <CookieConsent />
      </div>
      </SmoothScroll>
    </SiteActionsContext.Provider>
  )
}
