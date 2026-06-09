"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useRevealSections() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((section) => {
        gsap.fromTo(
          section,
          {
            y: 40,
            clipPath: "inset(0 0 14% 0)",
            rotateX: 6,
            transformPerspective: 1200,
            transformOrigin: "top center",
          },
          {
            y: 0,
            clipPath: "inset(0 0 0% 0)",
            rotateX: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);
}
