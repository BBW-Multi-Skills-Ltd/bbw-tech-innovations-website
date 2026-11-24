'use client'

import { useState } from 'react'

/** The video id from a YouTube link (watch, youtu.be, shorts or embed), else null. */
function youTubeId(url: string) {
  const m = url.match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/)
  return m?.[1] ?? null
}

/**
 * A demo video (from the portfolio) that never autoplays: an uploaded MP4/WebM
 * with controls (its poster, or its first frame), or a YouTube link that shows
 * its poster and only loads the player (youtube-nocookie) on click.
 *
 * `fill` (BBW): fills a positioned box, such as a PhoneFrame or LaptopFrame
 * screen, instead of sizing itself at 16:9. The video is letterboxed to fit.
 */
export function DemoVideo({ url, poster, title, fill = false }: { url: string; poster: string | null; title: string; fill?: boolean }) {
  const [playing, setPlaying] = useState(false)
  const yt = youTubeId(url)
  const box = fill ? 'absolute inset-0 size-full' : 'aspect-video w-full'

  if (!yt) {
    return (
      <video
        src={url}
        poster={poster ?? undefined}
        controls
        preload="metadata"
        playsInline
        aria-label={title}
        className={`${box} bg-black ${fill ? 'object-contain' : ''}`}
      />
    )
  }

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className={`${box} border-0`}
      />
    )
  }

  return (
    <button type="button" onClick={() => setPlaying(true)} className={`group ${fill ? 'absolute inset-0' : 'relative block aspect-video w-full'} cursor-pointer overflow-hidden border-none bg-black p-0`} aria-label={`Play: ${title}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- poster from the admin or YouTube */}
      <img
        src={poster ?? `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        className="size-full object-cover opacity-90 transition-opacity duration-300 ease-soft group-hover:opacity-100"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-bbw-accent text-white shadow-xl transition-transform duration-300 ease-soft group-hover:scale-105">
          <svg viewBox="0 0 24 24" aria-hidden className="ml-1 size-7" fill="currentColor">
            <path d="M8 5.5v13l11-6.5z" />
          </svg>
        </span>
      </span>
    </button>
  )
}
