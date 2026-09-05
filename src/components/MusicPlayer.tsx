import { useEffect, useRef, useState } from 'react'
import { ArrowDown, Music2 } from 'lucide-react'

export default function MusicPlayer({ url }: { url: string }) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const triedRef = useRef(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      audioRef.current?.pause()
      audioRef.current = url ? new Audio(url) : null
      if (audioRef.current) { audioRef.current.loop = true; audioRef.current.volume = 0.3 }
      triedRef.current = false
      setPlaying(false)
    })
    return () => { cancelAnimationFrame(frame); audioRef.current?.pause() }
  }, [url])

  useEffect(() => {
    const tryPlay = () => {
      if (triedRef.current || !audioRef.current) return
      triedRef.current = true
      audioRef.current.play().then(() => setPlaying(true)).catch(() => undefined)
    }
    document.addEventListener('click', tryPlay, { once: true })
    return () => document.removeEventListener('click', tryPlay)
  }, [url])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else audio.play().then(() => setPlaying(true)).catch(() => undefined)
  }

  if (!url) return null

  const action = playing ? 'Pause background music' : 'Play background music'

  return (
    <div className="music-player-control">
      <div className="music-player-hint" aria-hidden="true">
        <span>Music</span>
        <ArrowDown size={22} strokeWidth={1.8} />
      </div>
      <button
        className={`music-player${playing ? ' is-playing' : ''}`}
        onClick={toggle}
        title={action}
        aria-label={action}
      >
        <Music2 size={22} strokeWidth={1.8} aria-hidden="true" />
        <span className="music-player-tooltip" role="tooltip">{action}</span>
      </button>
    </div>
  )
}
