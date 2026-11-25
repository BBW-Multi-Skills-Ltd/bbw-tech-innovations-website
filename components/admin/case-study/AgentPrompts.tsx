'use client'

import { useState } from 'react'
import { draftPrompt, screenshotsPrompt, type PromptFlow, type PromptProject } from '@/lib/case-studies/agent-prompts'
import type { Devices } from '@/lib/project-types'
import { LAPTOP_SCREENSHOT, PHONE_SCREENSHOT } from '@/lib/screens'

/**
 * "Prompts for your AI agent": copy one into the agent that has the project's
 * codebase, then bring the result back into the blocks. Built from the
 * project and its current case study (features, steps, devices).
 */
export function AgentPrompts({ project, devices, flows }: { project: PromptProject; devices: Devices; flows: PromptFlow[] }) {
  const [copied, setCopied] = useState<string | null>(null)
  const [error, setError] = useState('')
  const usesPhone = devices.hero !== 'desktop' || devices.journeys !== 'desktop'
  const usesLaptop = devices.hero !== 'phone' || devices.journeys !== 'phone'
  const sizes = [usesPhone ? `phone ${PHONE_SCREENSHOT}` : null, usesLaptop ? `laptop ${LAPTOP_SCREENSHOT}` : null].filter(Boolean).join(', ')

  const prompts = [
    { id: 'draft', title: 'Draft the case study', what: 'In our agency layout and “we” voice, for business owners: outcome headlines, business lines as [placeholders] unless real, no diagrams, nothing invented. Check it, then put it into the blocks.', text: () => draftPrompt(project, devices) },
    { id: 'screens', title: 'Screenshots', what: `Every cover and journey step at the exact frame sizes (${sizes}), with file names. Upload each into its block.`, text: () => screenshotsPrompt(project, devices, flows) },
  ]

  const copy = async (id: string, text: string) => {
    setError('')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      window.setTimeout(() => setCopied(current => (current === id ? null : current)), 2500)
    } catch {
      setError('Could not copy. Allow clipboard access for this site and try again.')
    }
  }

  return (
    <details className="group rounded-lg border border-bbw-border-hi bg-bbw-surface p-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <span>
          <span className="block text-[15px] font-semibold text-bbw-fg">Prompts for your AI agent</span>
          <span className="mt-1 block text-[12px] text-bbw-muted">Copy one into the agent that has {project.name}’s codebase, then bring the result back here.</span>
        </span>
        <span aria-hidden="true" className="font-mono text-[18px] text-bbw-muted transition-transform duration-300 group-open:rotate-45">+</span>
      </summary>
      <ul className="mt-5 grid gap-3 min-[900px]:grid-cols-2">
        {prompts.map(prompt => (
          <li key={prompt.id} className="flex flex-col gap-2.5 rounded-md border border-bbw-border p-4">
            <p className="text-[14px] font-semibold text-bbw-fg">{prompt.title}</p>
            <p className="flex-1 text-[12px] leading-[1.6] text-bbw-muted">{prompt.what}</p>
            <button type="button" className="admin-secondary-button self-start" onClick={() => void copy(prompt.id, prompt.text())}>
              {copied === prompt.id ? 'Copied ✓' : 'Copy prompt'}
            </button>
          </li>
        ))}
      </ul>
      {error ? <p role="alert" className="mt-3 text-[12px] text-[#ef4444]">{error}</p> : null}
    </details>
  )
}
