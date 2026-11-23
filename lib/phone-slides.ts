import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Wide screens with motion allowed: the intro slides pin with GSAP.
 * Keep in sync with the same media queries in styles/intro.css.
 */
export const DESKTOP_PIN_MEDIA = "(min-width: 960px) and (prefers-reduced-motion: no-preference)";

/** Phones and tablets with motion allowed: the same sections slide (below). */
export const PHONE_SLIDES_MEDIA = "(max-width: 959px) and (prefers-reduced-motion: no-preference)";

/** Scroll needed per slide, as a share of the screen height. */
const STEP = 0.75;

/**
 * Phones: scrolling down slides `track` sideways while the section holds
 * still. The hold is CSS `position: sticky` (smooth with native touch
 * scrolling, unlike a JS pin): `run` gets the class `is-sticky`, which turns
 * on the sticky layout in styles/intro.css and the compact `stick:` styles, and a
 * height that leaves room for the scroll. When scrolling stops between
 * slides, it settles on the nearest, so one is always fully in view.
 *
 * Waits for the web fonts (they change text heights), then checks `fits`: if
 * a slide doesn't fit the screen (very short screens, long text), the stacked
 * layout stays. Returns a cleanup.
 */
export function phoneSlides(options: Options): () => void {
  let undo: (() => void) | undefined;
  let live = true;
  const ready = document.fonts?.ready ?? Promise.resolve();
  ready.then(() => {
    if (!live) return;
    undo = start(options);
    if (undo) refreshSoon();
  });
  return () => {
    live = false;
    undo?.();
  };
}

let refreshQueued = false;
/**
 * One ScrollTrigger re-measure for everything that asks in the same frame
 * (each refresh lays out the whole page; several sections ask at once).
 */
export function refreshSoon() {
  if (refreshQueued) return;
  refreshQueued = true;
  requestAnimationFrame(() => {
    refreshQueued = false;
    ScrollTrigger.refresh();
  });
}

type Options = {
  run: HTMLElement;
  stick: HTMLElement;
  track: HTMLElement;
  steps: number;
  distance: () => number;
  fits: () => boolean;
  onProgress?: (progress: number) => void;
};

function start({
  run,
  stick,
  track,
  steps,
  distance,
  fits,
  onProgress,
}: Options): (() => void) | undefined {
  if (steps < 1) return;
  run.classList.add("is-sticky");
  if (!fits()) {
    run.classList.remove("is-sticky");
    return;
  }

  const setRun = () => {
    run.style.height = `${stick.offsetHeight + steps * window.innerHeight * STEP}px`;
  };
  setRun();
  ScrollTrigger.addEventListener("refreshInit", setRun);

  const tween = gsap.to(track, {
    x: () => -distance(),
    ease: "none",
    scrollTrigger: {
      trigger: run,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      invalidateOnRefresh: true,
      // Settle on the nearest slide (not always the next one in the scroll
      // direction, which would skip the first slide on the way in).
      snap: {
        snapTo: 1 / steps,
        directional: false,
        duration: { min: 0.2, max: 0.5 },
        delay: 0.08,
        ease: "power1.inOut",
      },
      onUpdate: ({ progress }) => onProgress?.(progress),
    },
  });

  return () => {
    ScrollTrigger.removeEventListener("refreshInit", setRun);
    tween.scrollTrigger?.kill();
    tween.kill();
    gsap.set(track, { clearProps: "transform" });
    run.style.height = "";
    run.classList.remove("is-sticky");
  };
}
