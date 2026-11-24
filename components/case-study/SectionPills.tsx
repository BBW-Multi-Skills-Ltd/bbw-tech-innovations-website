"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Sticky section pills under the nav. The pill for the section in view is
 * highlighted (and scrolled into view on phones). Links are in-page anchors,
 * so they work without JS and use the site's smooth scroll with it.
 */
export function SectionPills({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id);
  const row = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting));
        // The first section whose top band is in view wins; otherwise keep the last one.
        const current = els.find((el) => visible.get(el.id));
        if (current) setActive(current.id);
      },
      { rootMargin: "-140px 0px -55% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  // Keep the active pill visible in the scrolling row.
  useEffect(() => {
    const list = row.current;
    const pill = list?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!list || !pill) return;
    const left = pill.offsetLeft - list.clientWidth / 2 + pill.offsetWidth / 2;
    list.scrollTo({ left, behavior: "smooth" });
  }, [active]);

  if (sections.length < 2) return null;

  return (
    <nav aria-label="Sections" className="sticky top-[70px] z-[55] py-2">
      <div className="container-site">
        <ul
          ref={row}
          className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-bbw-border-hi bg-bbw-surface/85 p-1 backdrop-blur-md [scrollbar-width:none]"
          data-lenis-prevent-horizontal
        >
          {sections.map((s) => {
            const on = s.id === active;
            return (
              <li key={s.id} data-id={s.id} className="shrink-0">
                <a
                  href={`#${s.id}`}
                  aria-current={on ? "location" : undefined}
                  className={`inline-flex min-h-10 items-center rounded-full px-4 font-mono text-[12px] tracking-[0.08em] uppercase transition-colors duration-300 ease-soft ${
                    on ? "bg-bbw-accent font-semibold text-white" : "text-bbw-muted hover:text-bbw-fg"
                  }`}
                >
                  {s.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
