"use client";

import { useSyncExternalStore } from "react";

type Device = "phone" | "desktop";
const EVENT = "journey-device";

// The choice lives on <html data-journey-device>, so every journey on the page
// (and every toggle) switches together; CSS shows the matching frames.
const read = (): Device => (document.documentElement.dataset.journeyDevice === "desktop" ? "desktop" : "phone");
const subscribe = (onChange: () => void) => {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
};
const choose = (next: Device) => {
  document.documentElement.dataset.journeyDevice = next;
  window.dispatchEvent(new Event(EVENT));
};

/**
 * Phone / Desktop switch above a feature's journey, for website + app projects
 * whose website is the same product. Same look as the Selected work tabs.
 */
export function JourneyDeviceToggle() {
  const device = useSyncExternalStore(subscribe, read, () => "phone" as Device);

  return (
    <div
      role="group"
      aria-label="Show the screens on"
      className="relative mt-8 inline-grid auto-cols-fr grid-flow-col rounded-full border border-bbw-border bg-bbw-surface p-1.5"
    >
      <span
        aria-hidden
        className="tab-highlight absolute top-1.5 bottom-1.5 left-1.5 w-[calc((100%-12px)/2)] rounded-full bg-bbw-accent"
        style={{ transform: `translateX(${device === "desktop" ? 100 : 0}%)` }}
      />
      {(["phone", "desktop"] as const).map((d) => (
        <button
          key={d}
          type="button"
          aria-pressed={device === d}
          onClick={() => choose(d)}
          className={`relative min-h-11 rounded-full px-5 font-mono text-[12px] tracking-[0.08em] uppercase transition-colors duration-300 ease-soft ${
            device === d ? "font-bold text-white" : "font-medium text-bbw-muted hover:text-bbw-fg"
          }`}
        >
          {d === "phone" ? "Phone" : "Desktop"}
        </button>
      ))}
    </div>
  );
}
