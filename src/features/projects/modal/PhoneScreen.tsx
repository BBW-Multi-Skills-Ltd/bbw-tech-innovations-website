import type { MockScreen } from '../../../data/projects'

function Dashboard({ screen }: { screen: MockScreen }) {
  return <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 6, padding: '0 2px' }}>
    <div style={{ display: 'flex', gap: 5 }}>{[screen.colorA, screen.colorB, screen.colorC ?? screen.colorA].map((color, index) => <div key={index} style={{ flex: 1, height: 52, background: `${color}44`, borderRadius: 6, borderTop: `2px solid ${color}`, padding: '6px 6px 0' }}><div style={{ height: 3, width: '55%', background: 'rgba(255,255,255,0.2)', borderRadius: 2 }} /><div style={{ height: 6, width: '70%', background: 'rgba(255,255,255,0.4)', borderRadius: 2, marginTop: 4 }} /></div>)}</div>
    <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: 6 }}>{[80,65,90,70,55,75].map((width, index) => <div key={index} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}><div style={{ width: 22, height: 22, borderRadius: 4, background: `${index % 2 === 0 ? screen.colorA : screen.colorB}66`, flexShrink: 0 }} /><div style={{ flex: 1 }}><div style={{ height: 3.5, width: `${width}%`, background: 'rgba(255,255,255,0.2)', borderRadius: 2, marginBottom: 3 }} /><div style={{ height: 2.5, width: `${width - 15}%`, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }} /></div><div style={{ height: 3, width: 20, background: `${screen.colorA}88`, borderRadius: 2 }} /></div>)}</div>
  </div>
}

function List({ screen }: { screen: MockScreen }) {
  return <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 5, padding: '0 2px' }}>
    <div style={{ height: 28, background: `${screen.colorA}33`, borderRadius: 5, display: 'flex', alignItems: 'center', padding: '0 6px', gap: 4 }}><div style={{ height: 3, flex: 1, background: 'rgba(255,255,255,0.15)', borderRadius: 2 }} /><div style={{ width: 14, height: 14, borderRadius: 3, background: `${screen.colorA}88` }} /></div>
    {[1,2,3,4,5].map(item => <div key={item} style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '6px 4px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}><div style={{ width: 28, height: 28, borderRadius: '50%', background: `${item % 2 === 0 ? screen.colorA : screen.colorB}55`, flexShrink: 0 }} /><div style={{ flex: 1 }}><div style={{ height: 4, width: `${55 + item * 7}%`, background: 'rgba(255,255,255,0.25)', borderRadius: 2, marginBottom: 3 }} /><div style={{ height: 3, width: `${35 + item * 5}%`, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }} /></div><div style={{ width: 8, height: 8, borderRadius: '50%', background: item < 3 ? `${screen.colorA}cc` : 'rgba(255,255,255,0.1)' }} /></div>)}
  </div>
}

function Form({ screen }: { screen: MockScreen }) {
  return <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 6, padding: '0 2px' }}>
    {[60,45,60,45].map((width, index) => <div key={index}><div style={{ height: 3, width: `${width}%`, background: 'rgba(255,255,255,0.18)', borderRadius: 2, marginBottom: 4 }} /><div style={{ height: 20, background: 'rgba(255,255,255,0.06)', borderRadius: 4, border: `1px solid ${index === 1 ? screen.colorA : 'rgba(255,255,255,0.1)'}`, padding: '0 6px', display: 'flex', alignItems: 'center' }}><div style={{ height: 3, width: `${40 + index * 10}%`, background: 'rgba(255,255,255,0.2)', borderRadius: 2 }} /></div></div>)}
    <div style={{ height: 28, background: screen.colorA, borderRadius: 6, marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}><div style={{ height: 3, width: 40, background: 'rgba(255,255,255,0.7)', borderRadius: 2 }} /><div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} /></div>
  </div>
}

export default function PhoneScreen({ screen, index }: { screen: MockScreen; index: number }) {
  if (index % 3 === 1) return <List screen={screen} />
  if (index % 3 === 2) return <Form screen={screen} />
  return <Dashboard screen={screen} />
}
