"use client";

import { useState } from "react";

/** The video id from a YouTube link (watch, youtu.be, shorts or embed), else null. */
function youTubeId(url: string) {
  const m = url.match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  return m?.[1] ?? null;
}

/**
 * A demo video that costs nothing until it's played: an uploaded MP4/WebM
 * (preload none) or a YouTube link, which shows its poster and only loads the
 * player (youtube-nocookie) on click.
 */
export function DemoVideo({ url, poster, title }: { url: string; poster: string | null; title: string }) {
  const [playing, setPlaying] = useState(false);
  const yt = youTubeId(url);

  if (!yt) {
    return (
      <video src={url} poster={poster ?? undefined} controls preload="metadata" playsInline className="aspect-video w-full bg-bbw-surface2" />
    );
  }

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className="aspect-video w-full"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative block aspect-video w-full overflow-hidden bg-bbw-surface2"
      aria-label={`Play: ${title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- poster from the admin or YouTube */}
      <img
        src={poster ?? `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        className="size-full object-cover opacity-90 transition-opacity duration-300 ease-soft group-hover:opacity-100"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex size-20 items-center justify-center rounded-full bg-bbw-accent text-white shadow-xl transition-transform duration-300 ease-soft group-hover:scale-105">
          <svg viewBox="0 0 24 24" aria-hidden className="ml-1 size-8" fill="currentColor">
            <path d="M8 5.5v13l11-6.5z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
