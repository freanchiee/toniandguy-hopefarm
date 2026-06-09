"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ScissorsDivider() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineLeftRef = useRef<HTMLDivElement>(null);
  const lineRightRef = useRef<HTMLDivElement>(null);
  const topBladeRef = useRef<SVGGElement>(null);
  const bottomBladeRef = useRef<SVGGElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapRef.current,
        start: "top 82%",
        end: "top 40%",
        scrub: 0.7,
      },
    });

    tl.fromTo(lineLeftRef.current, { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, ease: "none" }, 0);
    tl.fromTo(lineRightRef.current, { scaleX: 0, transformOrigin: "right" }, { scaleX: 1, ease: "none" }, 0);
    tl.fromTo(topBladeRef.current, { rotate: -20, transformOrigin: "12px 12px" }, { rotate: 0, ease: "power2.inOut" }, 0);
    tl.fromTo(bottomBladeRef.current, { rotate: 20, transformOrigin: "12px 12px" }, { rotate: 0, ease: "power2.inOut" }, 0);

    return () => tl.kill();
  }, []);

  return (
    <div ref={wrapRef} className="section-shell flex items-center py-2">
      <div ref={lineLeftRef} className="h-px flex-1 bg-white/12" />
      <svg
        viewBox="0 0 24 24"
        className="mx-4 h-5 w-5 shrink-0 text-salon-gold"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g ref={topBladeRef}>
          <circle cx="6" cy="6" r="3" />
          <line x1="8.5" y1="8.5" x2="21" y2="3" />
        </g>
        <g ref={bottomBladeRef}>
          <circle cx="6" cy="18" r="3" />
          <line x1="8.5" y1="15.5" x2="21" y2="21" />
          <line x1="21" y1="3" x2="8.5" y2="15.5" />
        </g>
      </svg>
      <div ref={lineRightRef} className="h-px flex-1 bg-white/12" />
    </div>
  );
}
