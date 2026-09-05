import type { Project } from '../../data/projects'
import { mono } from '../../styles/theme'

const fallbackScreen = { colorA: '#2979FF', colorB: '#1E3A8A' }
type PreviewProps = Pick<Project, 'accentColor' | 'mockBg' | 'screens' | 'cardImageUrl'>

export function PhonePreview({ accentColor, mockBg, screens, cardImageUrl }: PreviewProps) {
  const screen = screens[0] ?? fallbackScreen
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', padding: '24px 0 0', minHeight: 180, background: `linear-gradient(180deg, ${mockBg} 0%, ${mockBg}88 100%)`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: 160, height: 160, background: `radial-gradient(circle, ${accentColor}22 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ width: 88, height: 158, background: '#0E0E10', borderRadius: 16, border: '1.5px solid rgba(255,255,255,0.1)', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.4)', position: 'relative', zIndex: 1, flexShrink: 0 }}>
        <div style={{ height: 14, background: `${screen.colorB}cc`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6px' }}><span style={{ ...mono, fontSize: 4, color: 'rgba(255,255,255,0.6)' }}>9:41</span><div style={{ width: 18, height: 6, background: '#0E0E10', borderRadius: 3 }} /><div style={{ width: 8, height: 4, border: '1px solid rgba(255,255,255,0.3)', borderRadius: 1 }}><div style={{ width: '70%', height: '100%', background: 'rgba(255,255,255,0.5)' }} /></div></div>
        <div style={{ height: 12, background: `${screen.colorB}dd`, borderBottom: '1px solid rgba(255,255,255,0.06)' }}><div style={{ height: 3, width: '50%', background: 'rgba(255,255,255,0.2)', borderRadius: 2, margin: '4px auto 0' }} /></div>
        <div style={{ padding: cardImageUrl ? 0 : '6px 5px', background: `linear-gradient(160deg, ${screen.colorB}88, ${screen.colorA}22)`, height: 106 }}>
          {cardImageUrl ? <img src={cardImageUrl} alt="" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} /> : <>
          <div style={{ display: 'flex', gap: 3, marginBottom: 5 }}>{[screen.colorA, screen.colorB, screen.colorA].map((color, index) => <div key={index} style={{ flex: 1, height: 20, background: `${color}44`, borderRadius: 3, borderTop: `1.5px solid ${color}` }} />)}</div>
          {[70, 55, 80, 45].map((width, index) => <div key={index} style={{ height: 3, width: `${width}%`, background: 'rgba(255,255,255,0.12)', borderRadius: 2, marginBottom: 4 }} />)}
          </>}
        </div>
        <div style={{ height: 18, background: `${screen.colorB}ee`, display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>{[1,2,3,4].map(item => <div key={item} style={{ width: 10, height: 10, borderRadius: 2, background: item === 1 ? `${screen.colorA}88` : 'rgba(255,255,255,0.1)' }} />)}</div>
        <div style={{ height: 8, background: `${screen.colorB}ee`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><div style={{ width: 20, height: 2.5, background: 'rgba(255,255,255,0.2)', borderRadius: 2 }} /></div>
      </div>
      <div style={{ width: 72, height: 130, background: '#0A0A0C', borderRadius: 13, border: '1px solid rgba(255,255,255,0.06)', position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-76px) rotate(-8deg)', zIndex: 0, opacity: 0.5, overflow: 'hidden' }}><div style={{ height: 12, background: `${screen.colorA}88` }} /><div style={{ margin: 5, display: 'flex', flexDirection: 'column', gap: 3 }}>{[70,55,80].map((width, index) => <div key={index} style={{ height: 2.5, width: `${width}%`, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }} />)}</div></div>
    </div>
  )
}

export function BrowserPreview({ accentColor, mockBg, screens, cardImageUrl }: PreviewProps) {
  const screen = screens[0] ?? fallbackScreen
  return (
    <div style={{ padding: '20px 20px 0', background: `linear-gradient(180deg, ${mockBg} 0%, ${mockBg}88 100%)`, minHeight: 180, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 200, height: 200, background: `radial-gradient(circle, ${accentColor}18 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ borderRadius: '8px 8px 0 0', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 12px 32px rgba(0,0,0,0.5)', position: 'relative', zIndex: 1 }}>
        <div style={{ height: 24, background: '#0E0E10', display: 'flex', alignItems: 'center', padding: '0 8px', gap: 4, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{['#EF4444', '#F59E0B', '#22C55E'].map(color => <div key={color} style={{ width: 5, height: 5, borderRadius: '50%', background: color, opacity: 0.7 }} />)}<div style={{ flex: 1, height: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 3, marginLeft: 6 }} /></div>
        <div style={{ height: 18, background: `${screen.colorB}cc`, display: 'flex', alignItems: 'center', padding: '0 8px', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.05)' }}><div style={{ height: 3, width: 28, background: 'rgba(255,255,255,0.4)', borderRadius: 2 }} />{[20,16,18].map((width, index) => <div key={index} style={{ height: 2.5, width, background: 'rgba(255,255,255,0.15)', borderRadius: 2 }} />)}<div style={{ flex: 1 }} /><div style={{ height: 9, width: 28, background: screen.colorA, borderRadius: 2 }} /></div>
        <div style={{ height: 100, background: `linear-gradient(155deg, ${screen.colorB}66, ${screen.colorA}15)`, padding: cardImageUrl ? 0 : '8px 8px 0' }}>{cardImageUrl ? <img src={cardImageUrl} alt="" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} /> : <><div style={{ height: 36, background: `${screen.colorB}88`, borderRadius: 3, marginBottom: 6, padding: '6px 8px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 3 }}><div style={{ height: 4, width: '55%', background: 'rgba(255,255,255,0.4)', borderRadius: 2 }} /><div style={{ height: 8, width: 32, background: screen.colorA, borderRadius: 2 }} /></div><div style={{ display: 'flex', gap: 4 }}>{[screen.colorA, screen.colorB, screen.colorA].map((color, index) => <div key={index} style={{ flex: 1, height: 26, background: `${color}22`, borderRadius: 3, border: `1px solid ${color}22` }} />)}</div></>}</div>
      </div>
    </div>
  )
}
