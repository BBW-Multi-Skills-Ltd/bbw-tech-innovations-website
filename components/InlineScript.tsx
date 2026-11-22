"use client";

/**
 * A script that runs from the server HTML (before first paint) and is inert
 * when React renders it in the browser (a client component, so it re-renders
 * there with type=text/plain). Avoids React's "script tag while
 * rendering" warning on client navigations. Pattern from Next's "Preventing
 * flash before hydration" guide.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
