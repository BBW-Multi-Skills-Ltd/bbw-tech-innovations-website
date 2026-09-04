import type { Project } from '../../../data/projects'
import CarouselDots from './CarouselDots'
import BrowserScreen from './BrowserScreen'
import useDemoCarousel from './useDemoCarousel'

export default function BrowserDemo({ project }: { project: Project }) {
  const { active, setActive, setPaused } = useDemoCarousel(project.screens.length)
  const screen = project.screens[active]
  if (!screen) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div style={{ width: '100%', maxWidth: 440, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 48px rgba(0,0,0,0.4)', background: '#111' }}>
        <div style={{ height: 36, background: '#0E0E10', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 6, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {['#EF4444', '#F59E0B', '#22C55E'].map(color => <div key={color} style={{ width: 9, height: 9, borderRadius: '50%', background: color, opacity: 0.7 }} />)}
          <div style={{ flex: 1, height: 20, background: 'rgba(255,255,255,0.06)', borderRadius: 4, marginLeft: 8, display: 'flex', alignItems: 'center', padding: '0 8px', gap: 5 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: `${screen.colorA}88` }} /><div style={{ height: 3, width: '55%', background: 'rgba(255,255,255,0.15)', borderRadius: 2 }} /></div>
        </div>
        <div style={{ height: 32, background: `${screen.colorB}cc`, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 20, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ height: 4, width: 40, background: 'rgba(255,255,255,0.5)', borderRadius: 2 }} />
          {[50, 40, 35, 45].map(width => <div key={width} style={{ height: 3, width, background: 'rgba(255,255,255,0.2)', borderRadius: 2 }} />)}
          <div style={{ flex: 1 }} /><div style={{ height: 18, width: 60, background: screen.colorA, borderRadius: 3 }} />
        </div>
        <div style={{ height: 220, padding: 14, background: `linear-gradient(155deg, ${screen.colorB}88, ${screen.colorA}18)` }}><BrowserScreen screen={screen} index={active} /></div>
        <div style={{ height: 20, background: '#0E0E10', padding: '8px 12px' }}><div style={{ height: 2.5, width: 80, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }} /></div>
      </div>
      <CarouselDots screens={project.screens} active={active} accentColor={project.accentColor} onSelect={setActive} />
    </div>
  )
}
