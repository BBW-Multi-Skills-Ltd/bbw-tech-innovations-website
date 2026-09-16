import type { Project } from '../../../data/projects'
import CarouselDots from './CarouselDots'
import BrowserScreen from './BrowserScreen'
import useDemoCarousel from './useDemoCarousel'

export default function BrowserDemo({ project }: { project: Project }) {
  const hasDemoVideo = Boolean(project.demoVideoUrl)
  const { active, setActive, setPaused } = useDemoCarousel(Math.max(project.screens.length, 1))
  const screen = project.screens[active] ?? { label: 'Demo', colorA: project.accentColor, colorB: project.mockBg, colorC: project.accentColor }

  return (
    <div className="project-browser-demo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="project-browser-demo-frame" style={{ width: '100%', maxWidth: 440, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 48px rgba(0,0,0,0.4)', background: '#111' }}>
        <div className="project-browser-demo-viewport" style={{ height: 288, padding: hasDemoVideo ? 0 : 14, background: `linear-gradient(155deg, ${screen.colorB}88, ${screen.colorA}18)` }}>{hasDemoVideo ? <video src={project.demoVideoUrl} autoPlay muted loop playsInline controls aria-label={`${project.name} product demo`} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} /> : <BrowserScreen screen={screen} index={active} />}</div>
        <div style={{ height: 20, background: '#0E0E10', padding: '8px 12px' }}><div style={{ height: 2.5, width: 80, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }} /></div>
      </div>
      {!hasDemoVideo && <CarouselDots screens={project.screens} active={active} accentColor={project.accentColor} onSelect={setActive} />}
    </div>
  )
}
