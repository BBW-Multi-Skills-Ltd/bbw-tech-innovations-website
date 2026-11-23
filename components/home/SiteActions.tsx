'use client'

import { createContext, useContext, type CSSProperties, type ReactNode } from 'react'
import type { InquiryMode } from '@/components/contact/types'
import type { Project } from '@/lib/data/projects'

interface SiteActions {
  dark: boolean
  toggleTheme: () => void
  /** Opens the contact form; 'video' opens it straight on the video recorder. */
  openContact: (mode?: Exclude<InquiryMode, 'idle'>) => void
  openProject: (project: Project) => void
}

export const SiteActionsContext = createContext<SiteActions | null>(null)

export function useSiteActions() {
  const actions = useContext(SiteActionsContext)
  if (!actions) throw new Error('useSiteActions must be used inside HomeShell.')
  return actions
}

/** "Start a Project" buttons: open the contact form. */
export function StartProjectButton({ className = 'btn-primary', style, children = 'Start a Project →' }: { className?: string; style?: CSSProperties; children?: ReactNode }) {
  const { openContact } = useSiteActions()
  return <button type="button" onClick={() => openContact()} className={className} style={style}>{children}</button>
}
