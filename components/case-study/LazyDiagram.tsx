"use client";

import { useEffect, useRef, useState } from "react";
import type { DiagramDrawing } from "@/lib/case-studies/diagram-drawing";
import { diagramMinWidth } from "@/lib/case-studies/diagram-size";

const svgBox = "[&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full";

/**
 * A diagram whose drawing is fetched when it nears the screen, so the page
 * itself stays light. Until then (and without JS), the description shows;
 * screen readers always get it.
 */
export function LazyDiagram({ src, description }: { src: string; description: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [drawing, setDrawing] = useState<DiagramDrawing | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let cancelled = false;
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        near.disconnect();
        fetch(src)
          .then((r) => (r.ok ? (r.json() as Promise<DiagramDrawing>) : null))
          .then((d) => !cancelled && d && setDrawing(d))
          .catch(() => {});
      },
      { rootMargin: "800px 0px" },
    );
    near.observe(el);
    return () => {
      cancelled = true;
      near.disconnect();
    };
  }, [src]);

  return (
    <div ref={box}>
      {/* Mermaid output (securityLevel "strict"), checked again when it was saved. */}
      {drawing && "svg" in drawing ? (
        <div aria-hidden className={svgBox} style={diagramMinWidth(drawing.svg)} dangerouslySetInnerHTML={{ __html: drawing.svg }} />
      ) : null}
      {drawing && "light" in drawing ? (
        <>
          <div aria-hidden className={`${svgBox} [[data-theme=light]_&]:hidden`} style={diagramMinWidth(drawing.dark)} dangerouslySetInnerHTML={{ __html: drawing.dark }} />
          <div aria-hidden className={`${svgBox} hidden [[data-theme=light]_&]:block`} style={diagramMinWidth(drawing.light)} dangerouslySetInnerHTML={{ __html: drawing.light }} />
        </>
      ) : null}
      <p className={drawing ? "sr-only" : "max-w-[65ch] text-[15px] leading-relaxed text-bbw-fg/80"}>{description}</p>
    </div>
  );
}
