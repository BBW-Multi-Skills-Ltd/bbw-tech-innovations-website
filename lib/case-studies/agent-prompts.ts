// Prompts to copy into the AI coding agent that has a project's codebase
// (ported from the portfolio's lib/admin/agent-prompts.ts and rewritten for
// BBW's agency case studies): a first draft in our layout and voice, and the
// screenshots at the exact frame sizes. Built from the project and its current
// blocks, so each prompt is specific to that project. No diagrams.
import { isPlaceholder } from '@/lib/case-studies/text'
import { isPwa, type Devices } from '@/lib/project-types'
import { LAPTOP_SCREENSHOT, PHONE_SCREENSHOT } from '@/lib/screens'

export type PromptProject = {
  name: string
  typeLabel: string
  projectType: string
  webRole: string | null
  isOwn: boolean
  liveUrl: string | null
  tagline: string
}
export type PromptFlow = { number: string; title: string; steps: string[] }

const rules = `Rules:
- Use only what is really in the codebase, its README and docs, and its git history. Never invent features, numbers, clients, reviews, dates or results.
- If you can't tell something from the code, write it as a [placeholder in square brackets] saying what's missing.
- Plain, confident English for business owners (not developers). Short sentences. No jargon, no technical deep-dives.`

function about(p: PromptProject) {
  const role = p.webRole === 'marketing' ? '; the website is a marketing site for the app' : p.webRole === 'product' ? '; the website is the same product as the app' : ''
  const live = p.liveUrl && !isPlaceholder(p.liveUrl) ? ` Live at ${p.liveUrl}.` : ''
  const whose = p.isOwn ? 'one of our own products' : 'a project we built for a client'
  return `Project: ${p.name}, ${whose} (${p.typeLabel}${role}).${live}${p.tagline && !isPlaceholder(p.tagline) ? ` In one line: ${p.tagline}` : ''}`
}

/** The whole case study, in BBW's agency layout, "we" voice. */
export function draftPrompt(p: PromptProject, devices: Devices) {
  const screens = devices.journeys === 'both' ? 'on the phone and on desktop' : devices.journeys === 'desktop' ? 'on desktop' : 'on the phone'
  return `You have this project's codebase. Draft the case study for it on the BBW Tech Innovations website, from what's really in the code, its README and docs, and its git history.

${about(p)}

Who reads it: business owners deciding whether to hire BBW Tech Innovations. Write as the BBW Tech team, in "we" voice ("we built", "we designed"), never "I". The work is presented as a team's roles.

Write it in Markdown with exactly these sections, in this order (they map onto our case study blocks):

# Cover
- Label: "${p.isOwn ? 'Our product' : 'Client work'}"
- Summary: what it is, in one line, plus a short payoff phrase for the end customer (e.g. "Your business profile, prices and work, shared by QR." + "Clients book on WhatsApp.")
- Facts, one line each: Status, Timeline, Platforms, What we did
- Links: the live site${devices.hero !== 'desktop' ? ' and the app store or app link' : ''}

# The brief
The ${p.isOwn ? "market's" : "client's"} problem in business words: who has it, what it costs them, why the old way doesn't work. A short paragraph, then "Who it's for": 2–4 audiences, each a title and one line.

# What we built
A short paragraph on what it is and what it gives the business. Then the 3–4 key features, each as:
- Number
- Outcome headline: what the end customer can now do, in one sentence (e.g. "A business owner sets up one professional home for their business."), not the feature's technical name
- The user journey as 3–6 steps, each a short line in the user's words (e.g. "Business name and username"), with an optional line of detail. Each step becomes one screenshot ${screens}.
- Note: one line after the journey, if useful
- What this meant for the business: a real result from the code or data you can see (e.g. a count you can verify), otherwise exactly [Result to add, e.g. <the number that would show it>]

# The result
2–4 outcomes. Real results only; for numbers you don't have, write [Result to add, e.g. …] so we can fill them in.

# The team
The work as a team's roles (e.g. Product & design, Engineering, Release & support), each with 2–4 short points of what that role did on this project.

# Built with
The main technologies, as a short plain list (no explanations).

${p.isOwn ? '' : '# Client review\nOnly if the repository holds a real review from the client, quoted exactly with their name and role. Otherwise leave this section out.\n\n'}No system design or database diagrams, no "hard problems", no deployment details.

${rules}
- Mark the whole reply "DRAFT: to check" at the top.`
}

/** Screenshots at the exact frame sizes, one per cover device and journey step, with file names. */
export function screenshotsPrompt(p: PromptProject, devices: Devices, flows: PromptFlow[]) {
  const phone = `phone: exactly ${PHONE_SCREENSHOT} (portrait, 9 × 19)`
  const laptop = `laptop: exactly ${LAPTOP_SCREENSHOT} (16 × 10; 2880 × 1800 is fine for sharper images)`
  const journeyDevices: ('phone' | 'desktop')[] = devices.journeys === 'both' ? ['phone', 'desktop'] : [devices.journeys]
  const coverDevices: ('phone' | 'desktop')[] = devices.hero === 'both' ? ['phone', 'desktop'] : [devices.hero]
  const needed = [...new Set([...coverDevices, ...journeyDevices])]

  const list: string[] = coverDevices.map(d => `- cover-${d}.png: the main screen, the one that best shows what ${p.name} does for its users`)
  const real = flows.filter(flow => flow.steps.some(step => !isPlaceholder(step)))
  for (const flow of real) {
    const n = flow.number.padStart(2, '0')
    list.push(`\nFeature ${n}: ${flow.title}`)
    flow.steps.forEach((step, i) => {
      for (const d of journeyDevices) list.push(`- feature-${n}-step-${String(i + 1).padStart(2, '0')}-${d}.png: ${step}`)
    })
  }

  return `You have this project's codebase${devices.hero !== 'desktop' ? ' and can run the app' : ''}. I need screenshots for its case study on the BBW Tech Innovations website. The site draws the device frame around each one, so each screenshot must be the plain screen only (no device frame, no browser window, no shadows), at these exact sizes:
- ${needed.map(d => (d === 'phone' ? phone : laptop)).join('\n- ')}

${about(p)}

How to capture at those sizes:
${captureSteps(p.projectType, needed)}
- Use realistic sample data (no real customers' personal details), the theme the product normally uses, and hide dev banners or debug overlays.

The screenshots I need${real.length ? '' : " (the case study's feature journeys aren't written yet: list the 3–4 key features and their steps first, then capture them)"}:
${list.join('\n')}

Name the files exactly as above and tell me where you saved them. Never invent data that looks like real customers or real results.`
}

/** How to get each size, for what the project is (a native app, a PWA, a website). */
function captureSteps(type: string, needed: ('phone' | 'desktop')[]) {
  const steps: string[] = []
  if (needed.includes('phone')) {
    if (isPwa(type)) {
      steps.push('- The PWA on a phone: browser dev tools, device size 360 × 760 at 3× (= 1080 × 2280), then "Capture screenshot".')
    } else {
      steps.push(
        '- Android: an emulator or device set to 1080 × 2280 (e.g. `adb shell wm size 1080x2280`, then `adb exec-out screencap -p > file.png`; reset with `adb shell wm size reset`).',
        '- iOS: the Simulator (File → Save Screen), then crop or resize to exactly 1080 × 2280 without stretching.',
      )
    }
  }
  if (needed.includes('desktop')) steps.push('- Desktop web: browser dev tools, size 1440 × 900 at 1× (or 2×), then "Capture screenshot" (not "full size").')
  return steps.join('\n')
}
