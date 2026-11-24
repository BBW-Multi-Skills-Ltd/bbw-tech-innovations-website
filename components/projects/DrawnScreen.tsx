import BrowserScreen from '@/components/projects/BrowserScreen'
import PhoneScreen from '@/components/projects/PhoneScreen'
import type { Project } from '@/lib/data/projects'

type DrawnProject = Pick<Project, 'accentColor' | 'mockBg' | 'screens'>

/**
 * The project's drawn preview screen (its first mock screen, in its own
 * colours), filling a PhoneFrame or LaptopFrame until real screenshots exist.
 * The same drawings the old project popup showed.
 */
export function DrawnScreen({ project, kind }: { project: DrawnProject; kind: 'phone' | 'desktop' }) {
  const screen = project.screens[0] ?? { label: 'Preview', colorA: project.accentColor, colorB: project.mockBg, colorC: project.accentColor }
  return kind === 'phone' ? (
    <div aria-hidden className="absolute inset-0 px-2 pt-7 pb-3" style={{ background: `linear-gradient(160deg, ${screen.colorB}99, ${screen.colorA}22), ${project.mockBg}` }}>
      <PhoneScreen screen={screen} index={0} />
    </div>
  ) : (
    <div aria-hidden className="absolute inset-0 p-[3.5%]" style={{ background: `linear-gradient(155deg, ${screen.colorB}88, ${screen.colorA}18), ${project.mockBg}` }}>
      <BrowserScreen screen={screen} index={0} />
    </div>
  )
}
