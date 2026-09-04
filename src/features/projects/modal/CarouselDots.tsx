import type { MockScreen } from '../../../data/projects'
import { MUTED, mono } from '../../../styles/theme'

interface CarouselDotsProps {
  screens: MockScreen[]
  active: number
  accentColor: string
  onSelect: (index: number) => void
}

export default function CarouselDots({ screens, active, accentColor, onSelect }: CarouselDotsProps) {
  const screen = screens[active]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <p style={{ ...mono, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED }}>{screen?.label ?? 'Preview'}</p>
      <div style={{ display: 'flex', gap: 6 }}>
        {screens.map((item, index) => (
          <button key={`${item.label}-${index}`} type="button" onClick={() => onSelect(index)} aria-label={`Show ${item.label}`} aria-current={index === active} style={{ width: index === active ? 20 : 6, height: 6, borderRadius: 3, border: 'none', cursor: 'pointer', background: index === active ? accentColor : 'rgba(128,128,128,0.3)', transition: 'width 0.3s, background 0.3s', padding: 0 }} />
        ))}
      </div>
    </div>
  )
}
