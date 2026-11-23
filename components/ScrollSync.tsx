"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";
import { useSmoothScroll } from "./SmoothScroll";

gsap.registerPlugin(ScrollTrigger);

/**
 * Runs Lenis on GSAP's ticker and keeps every ScrollTrigger in step with it,
 * so all scroll-linked sections share one clock.
 */
export function ScrollSync() {
  const { lenis, driveWith } = useSmoothScroll();

  useEffect(() => {
    if (!lenis) return;
    const offScroll = lenis.on("scroll", ScrollTrigger.update);
    const release = driveWith((tick) => {
      const onTick = (time: number) => tick(time * 1000);
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);
      return () => {
        gsap.ticker.remove(onTick);
        gsap.ticker.lagSmoothing(500, 33);
      };
    });
    return () => {
      offScroll();
      release();
    };
  }, [lenis, driveWith]);

  return null;
}
