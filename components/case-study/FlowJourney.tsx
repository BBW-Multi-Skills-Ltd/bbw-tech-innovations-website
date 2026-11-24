import { LaptopFrame } from "@/components/LaptopFrame";
import { PhoneFrame } from "@/components/PhoneFrame";
import { ScreenImage } from "./ScreenImage";
import { Reveal } from "@/components/Reveal";
import type { FlowStep } from "@/lib/case-studies/types";
import { realValue } from "@/lib/case-studies/text";

const num = (i: number) => String(i + 1).padStart(2, "0");

const dot = "absolute size-[7px] rounded-full bg-bbw-accent";
const lineColor = "border-bbw-muted/45";

/**
 * A feature's user journey: one screen per step with its text beside it,
 * joined to the next step by a line. From tablet width the screen and text
 * swap sides each step and an elbow line carries across; on phones the screen
 * stays on the left with a straight line down.
 *
 * `device`: phone screens (9 × 19, Galaxy S10), laptop screens (16 × 10), or
 * both, switched by the Phone / Desktop toggle (JourneyDeviceToggle; CSS
 * `.journey-both` in globals.css shows one and sizes the screens for it).
 */
export function FlowJourney({
  title,
  steps,
  device = "phone",
}: {
  title: string;
  steps: FlowStep[];
  device?: "phone" | "desktop" | "both";
}) {
  const sizes =
    device === "both"
      ? "journey-both"
      : device === "desktop"
        ? "[--sw:clamp(260px,28vw,400px)] [--mw:150px]"
        : "[--sw:clamp(150px,13vw,184px)] [--mw:104px]";
  return (
    // --sw: the screen width on tablet and up (the connector lines use it too).
    <ol aria-label={`${title}: steps`} className={`mt-10 ${sizes}`}>
      {steps.map((step, i) => {
        const right = i % 2 === 1; // screen on the right (tablet and up)
        const last = i === steps.length - 1;
        return (
          <li key={i}>
            <Reveal
              className="grid grid-cols-[var(--mw)_1fr] items-center gap-5 min-[768px]:grid-cols-2 min-[768px]:gap-0"
            >
              <div
                className={`flex justify-center ${right ? "min-[768px]:order-2 min-[768px]:justify-start min-[768px]:pl-8" : "min-[768px]:justify-end min-[768px]:pr-8"}`}
              >
                {device === "both" ? (
                  <>
                    <div className="jd-phone">
                      <Screen src={step.imageUrl} caption={step.caption} index={i} desktop={false} />
                    </div>
                    <div className="jd-desktop">
                      <Screen src={step.desktopImageUrl ?? ""} caption={step.caption} index={i} desktop />
                    </div>
                  </>
                ) : (
                  <Screen src={step.imageUrl} caption={step.caption} index={i} desktop={device === "desktop"} />
                )}
              </div>
              <div className={right ? "min-[768px]:order-1 min-[768px]:pr-10 min-[768px]:text-right" : "min-[768px]:pl-10"}>
                <p className="font-mono text-[12px] tracking-[0.14em] text-bbw-accent uppercase">Step {num(i)}</p>
                <p className="mt-2 font-display text-[clamp(22px,2.2vw,32px)] leading-[1.1] font-bold tracking-[-0.02em] text-balance">{step.caption}</p>
                {step.text ? (
                  <p className={`mt-3 max-w-[44ch] text-[16px] leading-relaxed text-bbw-fg/80 ${right ? "min-[768px]:ml-auto" : ""}`}>
                    {step.text}
                  </p>
                ) : null}
              </div>
            </Reveal>
            {last ? null : <Connector toRight={!right} />}
          </li>
        );
      })}
    </ol>
  );
}

function Screen({ src, caption, index, desktop }: { src: string; caption: string; index: number; desktop: boolean }) {
  const content = realValue(src) ? (
    <ScreenImage src={src} alt={caption} />
  ) : (
    <span aria-hidden className="flex size-full flex-col items-center justify-center gap-2">
      <span className="font-display text-[34px] leading-none font-bold text-bbw-muted/70 min-[768px]:text-[56px]">{num(index)}</span>
      {process.env.NODE_ENV !== "production" ? (
        <span className="font-mono text-[10px] tracking-[0.12em] text-bbw-muted uppercase">[screen]</span>
      ) : null}
    </span>
  );
  if (!desktop) return <PhoneFrame className="w-(--mw) min-[768px]:w-(--sw)">{content}</PhoneFrame>;
  return <LaptopFrame className="w-(--mw) min-[768px]:w-(--sw)">{content}</LaptopFrame>;
}

/** The line from this step's screen to the next one's. */
function Connector({ toRight }: { toRight: boolean }) {
  return (
    <div aria-hidden className="relative h-10 min-[768px]:h-14">
      {/* Phones: straight down the screen column. */}
      <span className={`absolute top-0 bottom-0 left-[calc(var(--mw)/2)] border-l ${lineColor} min-[768px]:hidden`} />
      {/* Tablet and up: down, across to the other screen (either side of the centre), down. */}
      <div className="absolute inset-y-0 left-[calc(50%-2rem-var(--sw)/2)] hidden w-[calc(var(--sw)+4rem)] min-[768px]:block">
        <span
          className={`absolute inset-x-0 top-0 h-1/2 border-b ${lineColor} ${toRight ? "border-l" : "border-r"}`}
        />
        <span className={`absolute inset-x-0 bottom-0 h-1/2 ${lineColor} ${toRight ? "border-r" : "border-l"}`} />
        <span className={`${dot} -top-[3px] ${toRight ? "-left-[3px]" : "-right-[3px]"}`} />
        <span className={`${dot} -bottom-[3px] ${toRight ? "-right-[3px]" : "-left-[3px]"}`} />
      </div>
    </div>
  );
}
