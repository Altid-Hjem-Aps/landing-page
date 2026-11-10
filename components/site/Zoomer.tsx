"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useMotionPrefs } from "./MotionPrefs";

// Holds the story and the FAQ. Out of view it is the size of the privacy panel above (the
// cards' width, rounded corners); as it scrolls in it opens to the full window, edge to edge,
// and it closes again as it scrolls out towards the blog. Done with clip-path, so nothing
// inside moves or reflows. With reduced motion it simply stays edge to edge.
export default function Zoomer({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionPrefs();

  useEffect(() => {
    const el = ref.current as HTMLDivElement;
    if (reduced) {
      el.style.setProperty("--inset", "0px");
      el.style.setProperty("--radius", "0px");
      return;
    }
    let frame = 0;
    const draw = () => {
      frame = 0;
      const vh = window.innerHeight;
      const vw = document.documentElement.clientWidth;
      // The privacy panel: min(100% - 64u, 1376u) wide on a computer, 356u of 390 on a phone.
      const phone = window.innerWidth < 768;
      const u = phone ? vw / 390 : Math.min(vw, 1440) / 1440;
      const panel = phone ? 356 * u : Math.min(vw - 64 * u, 1376 * u);
      const rest = (vw - panel) / 2;
      const box = el.getBoundingClientRect();
      const into = Math.min(1, Math.max(0, (vh - box.top) / (vh * 0.6)));
      const outOf = Math.min(1, Math.max(0, box.bottom / (vh * 0.6)));
      const open = Math.min(into, outOf);
      const eased = open * open * (3 - 2 * open);
      el.style.setProperty("--inset", `${((1 - eased) * rest).toFixed(1)}px`);
      el.style.setProperty("--radius", `${((1 - eased) * 24).toFixed(1)}px`);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [reduced]);

  return (
    <div ref={ref} className="zoomer">
      {children}
    </div>
  );
}
