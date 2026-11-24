"use client";

import { useEffect, useRef } from "react";

/** A short silent loop beside the title. With reduced motion it stays on its first frame. */
export function HeroLoop({ src, label, className }: { src: string; label: string; className: string }) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => (still.matches ? el.pause() : el.play().catch(() => {}));
    apply();
    still.addEventListener("change", apply);
    return () => still.removeEventListener("change", apply);
  }, []);

  return (
    <video
      ref={video}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      className={className}
    />
  );
}
