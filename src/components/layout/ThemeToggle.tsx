import { useState } from 'react'

function playClickSound() {
  try {
    const AudioContextClass = window.AudioContext
      || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const context = new AudioContextClass()
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(720, context.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(180, context.currentTime + 0.12)
    gain.gain.setValueAtTime(0.28, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.16)
    oscillator.start(context.currentTime)
    oscillator.stop(context.currentTime + 0.18)
    oscillator.onended = () => context.close()
  } catch {
    // Audio is an enhancement; theme switching still works without it.
  }
}

export default function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  const [swinging, setSwinging] = useState(false)

  const pull = () => {
    if (swinging) return
    playClickSound()
    setSwinging(true)
    window.setTimeout(onToggle, 330)
    window.setTimeout(() => setSwinging(false), 980)
  }

  const wire = dark ? 'rgba(240,240,238,0.28)' : 'rgba(10,10,11,0.22)'
  const shade = dark ? '#26262A' : '#E3E2DF'
  const stroke = dark ? 'rgba(240,240,238,0.09)' : 'rgba(10,10,11,0.1)'

  return (
    <button type="button" onClick={pull} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} title={dark ? 'Switch to light mode' : 'Switch to dark mode'} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', outline: 'none', lineHeight: 0 }}>
      <div className={`lamp-wrap${swinging ? ' swinging' : ''}`}>
        <svg width="30" height="62" viewBox="0 0 30 62" fill="none" aria-hidden="true" style={{ overflow: 'visible' }}>
          {!dark && <path d="M9 30 L4 55 L26 55 L21 30 Z" fill="rgba(255,220,80,0.07)" />}
          <line x1="15" y1="0" x2="15" y2="8" stroke={wire} strokeWidth="1.4" strokeLinecap="round" />
          <rect x="11" y="7" width="8" height="10" rx="2" fill={dark ? '#2E2E33' : '#D8D7D4'} stroke={stroke} strokeWidth="0.8" />
          <path d="M6 17 L24 17 L21 29 L9 29 Z" fill={shade} stroke={stroke} strokeWidth="0.8" />
          <line x1="6" y1="17" x2="24" y2="17" stroke={dark ? 'rgba(240,240,238,0.06)' : 'rgba(255,255,255,0.6)'} />
          {!dark && <circle cx="15" cy="35" r="11" fill="rgba(255,218,70,0.18)" className="lamp-glow" />}
          <circle cx="15" cy="35" r="6" fill={dark ? '#1B1B1F' : '#FDD835'} stroke={dark ? 'rgba(240,240,238,0.08)' : 'rgba(245,158,11,0.45)'} />
          {dark ? <path d="M12.5 35.5 Q15 32.5 17.5 35.5" stroke="rgba(240,240,238,0.2)" strokeWidth="0.9" fill="none" /> : <circle cx="12.5" cy="32.5" r="1.8" fill="rgba(255,255,255,0.75)" />}
          <line x1="15" y1="41" x2="15" y2="55" stroke={dark ? 'rgba(240,240,238,0.18)' : 'rgba(10,10,11,0.17)'} strokeWidth="1.2" />
          <circle cx="15" cy="57" r="2.2" fill={dark ? 'rgba(240,240,238,0.14)' : 'rgba(10,10,11,0.13)'} />
        </svg>
      </div>
    </button>
  )
}
