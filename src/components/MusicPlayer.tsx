import { useState, useEffect, useRef } from 'react'
import { getMusicUrl, STORE_EVENT } from '../data/store'

export default function MusicPlayer() {
  const [playing, setPlaying]     = useState(false)
  const [hasUrl, setHasUrl]       = useState(() => !!getMusicUrl())
  const audioRef                  = useRef<HTMLAudioElement | null>(null)
  const triedRef                  = useRef(false)

  const buildAudio = (url: string) => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
    if (!url) { setHasUrl(false); setPlaying(false); return }
    const a = new Audio(url)
    a.loop   = true
    a.volume = 0.3
    audioRef.current = a
    setHasUrl(true)
    triedRef.current = false
  }

  useEffect(() => {
    const frame = requestAnimationFrame(() => buildAudio(getMusicUrl()))
    const refresh = () => buildAudio(getMusicUrl())
    window.addEventListener(STORE_EVENT, refresh)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener(STORE_EVENT, refresh)
      audioRef.current?.pause()
    }
  }, [])

  // Try autoplay once on first user interaction if not yet tried
  useEffect(() => {
    const tryPlay = () => {
      if (triedRef.current || !audioRef.current) return
      triedRef.current = true
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {})
    }
    document.addEventListener('click', tryPlay, { once: true })
    return () => document.removeEventListener('click', tryPlay)
  }, [hasUrl])

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (playing) {
      a.pause()
      setPlaying(false)
    } else {
      a.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  if (!hasUrl) return null

  return (
    <button
      onClick={toggle}
      title={playing ? 'Pause ambient music' : 'Play ambient music'}
      aria-label={playing ? 'Pause music' : 'Play music'}
      style={{
        position: 'fixed', bottom: 28, right: 28, zIndex: 300,
        width: 46, height: 46, borderRadius: '50%',
        background: 'var(--bbw-surface)',
        border: '1px solid var(--bbw-border-hi)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 28px rgba(0,0,0,0.35)',
        color: 'var(--bbw-muted)',
        transition: 'border-color 0.2s, color 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--bbw-accent)'
        e.currentTarget.style.color = 'var(--bbw-accent)'
        e.currentTarget.style.boxShadow = '0 4px 28px rgba(41,121,255,0.25)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--bbw-border-hi)'
        e.currentTarget.style.color = 'var(--bbw-muted)'
        e.currentTarget.style.boxShadow = '0 4px 28px rgba(0,0,0,0.35)'
      }}
    >
      {playing ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <rect x="5" y="3" width="5" height="18" rx="1.5"/>
          <rect x="14" y="3" width="5" height="18" rx="1.5"/>
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 1 }}>
          <path d="M8 5.14v14l11-7-11-7z"/>
        </svg>
      )}
    </button>
  )
}
