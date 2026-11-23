"use client";

import Lenis from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/** Calls `tick` with a timestamp in ms each frame. Returns a cleanup. */
type Ticker = (tick: (timeMs: number) => void) => () => void;

type SmoothScrollValue = {
  /** null until mounted, with reduced motion, and on touch screens (native scrolling). */
  lenis: Lenis | null;
  /**
   * Hand the frame loop to another ticker (e.g. GSAP) so everything runs on
   * one clock. Returns a cleanup that gives the loop back.
   *
   *   const { lenis, driveWith } = useSmoothScroll();
   *   useEffect(() => {
   *     if (!lenis) return;
   *     const offScroll = lenis.on("scroll", ScrollTrigger.update);
   *     const release = driveWith((tick) => {
   *       const onTick = (time: number) => tick(time * 1000);
   *       gsap.ticker.add(onTick);
   *       gsap.ticker.lagSmoothing(0);
   *       return () => gsap.ticker.remove(onTick);
   *     });
   *     return () => { offScroll(); release(); };
   *   }, [lenis, driveWith]);
   */
  driveWith: (ticker: Ticker) => () => void;
};

const SmoothScrollContext = createContext<SmoothScrollValue>({
  lenis: null,
  driveWith: () => () => {},
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

/** Phones and tablets: no hover, a finger for a pointer. */
const TOUCH_QUERY = "(hover: none) and (pointer: coarse)";

const rafTicker: Ticker = (tick) => {
  let id = requestAnimationFrame(function loop(time) {
    tick(time);
    id = requestAnimationFrame(loop);
  });
  return () => cancelAnimationFrame(id);
};

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [ticker, setTicker] = useState<Ticker>(() => rafTicker);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Touch screens scroll natively: Lenis doesn't smooth touch anyway, so on
    // phones and tablets it would only add work to every frame.
    const instance = window.matchMedia(TOUCH_QUERY).matches ? null : new Lenis({ autoRaf: false });
    lenisRef.current = instance;
    // Lenis needs the DOM, so it can only be created after mount.
    if (instance) setLenis(instance);

    // In-page links (/#work etc.). Pinned sections re-measure while a long
    // smooth scroll passes through them, which can leave it short, so check
    // where it landed and correct (a few times at most).
    const targetTop = (el: Element) =>
      el.getBoundingClientRect().top +
      window.scrollY -
      (parseFloat(getComputedStyle(el).scrollMarginTop) || 0);
    const scrollTo = (top: number) =>
      instance ? instance.scrollTo(top, { lock: true }) : window.scrollTo({ top, behavior: "smooth" });
    let lastY = -1;
    const stillMoving = () => {
      if (instance) return instance.isScrolling;
      const moved = window.scrollY !== lastY;
      lastY = window.scrollY;
      return moved;
    };
    let settle = 0;
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
      const link = (event.target as Element | null)?.closest?.("a[href*='#']");
      if (!(link instanceof HTMLAnchorElement)) return;
      const url = new URL(link.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!el) return;
      event.preventDefault();
      history.pushState(null, "", url.hash);
      window.clearTimeout(settle);
      let tries = 0;
      const go = () => {
        scrollTo(targetTop(el));
        lastY = -1;
        // Once it stops (finished or cut short), re-aim if it's off target.
        settle = window.setTimeout(function check() {
          if (stillMoving()) {
            settle = window.setTimeout(check, 200);
            return;
          }
          if (Math.abs(targetTop(el) - window.scrollY) > 4 && ++tries < 6) go();
        }, 300);
      };
      go();
    };
    // Capture phase: runs before next/link, which would otherwise do its own
    // (unreliable here) hash jump.
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      window.clearTimeout(settle);
      instance?.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  useEffect(() => {
    if (!lenis) return;
    return ticker((time) => lenis.raf(time));
  }, [lenis, ticker]);

  const driveWith = useCallback((next: Ticker) => {
    setTicker(() => next);
    return () => setTicker(() => rafTicker);
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ lenis, driveWith }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
