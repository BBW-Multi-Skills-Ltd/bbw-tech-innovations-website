import { diagramMinWidth as minWidth } from "@/lib/case-studies/diagram-size";
import type { BlockData } from "@/lib/case-studies/types";
import { LazyDiagram } from "./LazyDiagram";

const svgBox = "[&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full";

/**
 * A Mermaid diagram, drawn ahead of time in the admin as one SVG whose colours
 * follow the theme (older saves: a light/dark pair, swapped by theme). No
 * Mermaid in the browser. Without a drawing (or if it's out of date), the
 * plain-language description shows. With `src`, the drawing is fetched from
 * there instead of being part of the page (the admin keeps it inline).
 */
export function DiagramFigure({ data, src }: { data: BlockData["diagram"]; src?: string }) {
  // Public pages fetch the drawing when it nears the screen (keeps the page light).
  if (src)
    return (
      <figure>
        <div className="rounded-[10px] border border-bbw-border bg-bbw-surface overflow-x-auto p-4 min-[640px]:p-6" data-lenis-prevent-horizontal>
          <LazyDiagram src={src} description={data.description} />
        </div>
        {data.caption ? <figcaption className="mt-3 max-w-[80ch] text-[14px] text-bbw-muted">{data.caption}</figcaption> : null}
      </figure>
    );

  const current = data.svgSource === data.source;
  const themed = current && data.svg ? data.svg : null;
  const pair = current && !themed && data.svgLight && data.svgDark ? { light: data.svgLight, dark: data.svgDark } : null;
  const drawn = !!themed || !!pair;

  return (
    <figure>
      <div className="rounded-[10px] border border-bbw-border bg-bbw-surface overflow-x-auto p-4 min-[640px]:p-6" data-lenis-prevent-horizontal>
        {/* Mermaid output (securityLevel "strict"), checked again on save. */}
        {themed ? <div aria-hidden className={svgBox} style={minWidth(themed)} dangerouslySetInnerHTML={{ __html: themed }} /> : null}
        {pair ? (
          <>
            <div aria-hidden className={`${svgBox} [[data-theme=light]_&]:hidden`} style={minWidth(pair.dark)} dangerouslySetInnerHTML={{ __html: pair.dark }} />
            <div aria-hidden className={`${svgBox} hidden [[data-theme=light]_&]:block`} style={minWidth(pair.light)} dangerouslySetInnerHTML={{ __html: pair.light }} />
          </>
        ) : null}
        <p className={drawn ? "sr-only" : "max-w-[65ch] text-[15px] leading-relaxed text-bbw-fg/80"}>
          {data.description}
        </p>
      </div>
      {data.caption ? <figcaption className="mt-3 max-w-[80ch] text-[14px] text-bbw-muted">{data.caption}</figcaption> : null}
    </figure>
  );
}
