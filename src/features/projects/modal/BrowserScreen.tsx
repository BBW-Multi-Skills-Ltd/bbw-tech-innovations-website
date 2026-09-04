import type { MockScreen } from '../../../data/projects'

function Home({ screen }: { screen: MockScreen }) {
  return <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
    <div style={{ height: 90, background: `linear-gradient(135deg, ${screen.colorB}cc, ${screen.colorA}44)`, borderRadius: 4, padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 4 }}><div style={{ height: 5, width: '55%', background: 'rgba(255,255,255,0.5)', borderRadius: 3 }} /><div style={{ height: 3.5, width: '40%', background: 'rgba(255,255,255,0.25)', borderRadius: 2 }} /><div style={{ height: 14, width: 70, background: screen.colorA, borderRadius: 3, marginTop: 4 }} /></div>
    <div style={{ display: 'flex', gap: 5 }}>{[screen.colorA, screen.colorB, screen.colorC ?? screen.colorA].map((color, index) => <div key={index} style={{ flex: 1, height: 40, background: `${color}22`, borderRadius: 4, padding: 6, border: `1px solid ${color}33` }}><div style={{ height: 3, width: '70%', background: 'rgba(255,255,255,0.2)', borderRadius: 2, marginBottom: 3 }} /><div style={{ height: 2.5, width: '50%', background: 'rgba(255,255,255,0.1)', borderRadius: 2 }} /></div>)}</div>
    {[75,60,80].map((width, index) => <div key={index} style={{ display: 'flex', gap: 5, alignItems: 'center' }}><div style={{ width: 20, height: 20, borderRadius: 3, background: `${screen.colorA}33`, flexShrink: 0 }} /><div style={{ height: 3, width: `${width}%`, background: 'rgba(255,255,255,0.15)', borderRadius: 2 }} /></div>)}
  </div>
}

function Services({ screen }: { screen: MockScreen }) {
  return <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 5 }}>
    <div style={{ height: 5, width: '45%', background: 'rgba(255,255,255,0.2)', borderRadius: 2 }} />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, flex: 1 }}>{[1,2,3,4].map(item => <div key={item} style={{ background: `${item % 2 === 0 ? screen.colorA : screen.colorB}22`, borderRadius: 4, padding: 6, border: `1px solid ${screen.colorA}22` }}><div style={{ width: 14, height: 14, borderRadius: 3, background: `${screen.colorA}55`, marginBottom: 4 }} /><div style={{ height: 3.5, width: '70%', background: 'rgba(255,255,255,0.2)', borderRadius: 2, marginBottom: 2 }} /><div style={{ height: 2.5, width: '50%', background: 'rgba(255,255,255,0.1)', borderRadius: 2 }} /></div>)}</div>
    <div style={{ height: 16, background: screen.colorA, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ height: 3, width: 40, background: 'rgba(255,255,255,0.6)', borderRadius: 2 }} /></div>
  </div>
}

function Dashboard({ screen }: { screen: MockScreen }) {
  return <div style={{ height: '100%', display: 'flex', gap: 6 }}>
    <div style={{ width: 40, background: `${screen.colorB}55`, borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 4, padding: '6px 4px' }}>{[1,2,3,4,5].map(item => <div key={item} style={{ width: 24, height: 14, borderRadius: 3, background: item === 1 ? `${screen.colorA}88` : 'rgba(255,255,255,0.08)', margin: '0 auto' }} />)}</div>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}><div style={{ display: 'flex', gap: 4 }}>{[screen.colorA, screen.colorB].map((color, index) => <div key={index} style={{ flex: 1, height: 30, background: `${color}33`, borderRadius: 3, padding: '4px 6px' }}><div style={{ height: 3, width: '60%', background: 'rgba(255,255,255,0.15)', borderRadius: 2, marginBottom: 3 }} /><div style={{ height: 5, width: '40%', background: 'rgba(255,255,255,0.35)', borderRadius: 2 }} /></div>)}</div>{[1,2,3,4].map(item => <div key={item} style={{ display: 'flex', gap: 4, alignItems: 'center' }}><div style={{ width: 16, height: 16, borderRadius: '50%', background: `${screen.colorA}44`, flexShrink: 0 }} /><div style={{ height: 3, flex: 1, background: 'rgba(255,255,255,0.12)', borderRadius: 2 }} /><div style={{ height: 3, width: 20, background: `${screen.colorA}55`, borderRadius: 2 }} /></div>)}</div>
  </div>
}

export default function BrowserScreen({ screen, index }: { screen: MockScreen; index: number }) {
  if (index % 3 === 1) return <Services screen={screen} />
  if (index % 3 === 2) return <Dashboard screen={screen} />
  return <Home screen={screen} />
}
