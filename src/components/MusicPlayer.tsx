import { useEffect, useRef, useState } from 'react'
import { ArrowDown, Music2 } from 'lucide-react'
import { getMusicEnabled, saveMusicEnabled } from '../data/store'

export default function MusicPlayer({ url }: { url: string }) {
  const [playing, setPlaying] = useState(false)
  const enabledRef = useRef(getMusicEnabled())
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const triedRef = useRef(false)

  useEffect(() => {
    let audio: HTMLAudioElement | null = null
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const frame = requestAnimationFrame(() => {
      audioRef.current?.pause()
      audio = url ? new Audio(url) : null
      if (audio) {
        audio.loop = true
        audio.volume = 0.3
        audio.addEventListener('play', onPlay)
        audio.addEventListener('pause', onPause)
      }
      audioRef.current = audio
      triedRef.current = false
      setPlaying(false)
    })
    return () => {
      cancelAnimationFrame(frame)
      audio?.pause()
      audio?.removeEventListener('play', onPlay)
      audio?.removeEventListener('pause', onPause)
    }
  }, [url])

  useEffect(() => {
    const tryPlay = () => {
      if (!enabledRef.current || triedRef.current || !audioRef.current) return
      triedRef.current = true
      audioRef.current.play().then(() => setPlaying(true)).catch(() => undefined)
    }
    document.addEventListener('click', tryPlay, { once: true })
    return () => document.removeEventListener('click', tryPlay)
  }, [url])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      enabledRef.current = false
      saveMusicEnabled(false)
      setPlaying(false)
      return
    }
    enabledRef.current = true
    saveMusicEnabled(true)
    triedRef.current = true
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
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
