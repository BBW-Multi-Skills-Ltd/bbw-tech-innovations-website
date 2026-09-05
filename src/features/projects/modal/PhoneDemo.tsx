import type { Project } from '../../../data/projects'
import { mono } from '../../../styles/theme'
import CarouselDots from './CarouselDots'
import PhoneScreen from './PhoneScreen'
import useDemoCarousel from './useDemoCarousel'

export default function PhoneDemo({ project }: { project: Project }) {
  const hasDemoVideo = Boolean(project.demoVideoUrl)
  const { active, setActive, setPaused } = useDemoCarousel(Math.max(project.screens.length, 1))
  const screen = project.screens[active] ?? { label: 'Demo', colorA: project.accentColor, colorB: project.mockBg, colorC: project.accentColor }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div style={{ width: 200, height: 400, background: '#111', borderRadius: 36, border: '2px solid rgba(255,255,255,0.1)', boxShadow: '0 32px 64px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ height: 32, background: `${screen.colorB}cc`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px' }}>
          <span style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.7)' }}>9:41</span>
          <div style={{ width: 50, height: 14, background: '#111', borderRadius: 8, position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 4 }} />
          <div style={{ display: 'flex', gap: 3 }}>{[1, 2, 3].map(item => <div key={item} style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.6)' }} />)}</div>
        </div>
        {!hasDemoVideo && <div style={{ height: 36, background: `${screen.colorB}dd`, display: 'flex', alignItems: 'center', padding: '0 12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ height: 4, width: 60, background: 'rgba(255,255,255,0.3)', borderRadius: 3 }} /><div style={{ flex: 1 }} /><div style={{ width: 20, height: 20, borderRadius: 4, background: `${screen.colorA}88` }} />
        </div>}
        <div style={{ background: `linear-gradient(160deg, ${screen.colorB}99, ${screen.colorA}22)`, padding: hasDemoVideo ? 0 : '10px 8px', height: hasDemoVideo ? 308 : 272, overflow: 'hidden' }}>{hasDemoVideo ? <video src={project.demoVideoUrl} autoPlay muted loop playsInline controls aria-label={`${project.name} product demo`} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} /> : <PhoneScreen screen={screen} index={active} />}</div>
        <div style={{ height: 44, background: `${screen.colorB}ee`, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 12px 8px' }}>
          {['⊞', '◉', '◈', '◉'].map((icon, index) => <div key={index} style={{ width: 28, height: 28, display: 'grid', placeItems: 'center', color: index === 0 ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)', fontSize: 12 }}>{icon}</div>)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 6, background: `${screen.colorB}ee` }}><div style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.25)', borderRadius: 2 }} /></div>
      </div>
      {!hasDemoVideo && <CarouselDots screens={project.screens} active={active} accentColor={project.accentColor} onSelect={setActive} />}
    </div>
  )
}
