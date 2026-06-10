"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { testimonials } from "@/lib/data";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 16 16"
          className={`h-3.5 w-3.5 ${i < rating ? "text-salon-gold" : "text-white/20"}`}
          fill="currentColor"
        >
          <path d="M8 1l1.85 3.75L14 5.5l-3 2.92.71 4.13L8 10.4l-3.71 2.15L5 8.42 2 5.5l4.15-.75L8 1z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(
        card,
        { opacity: 0, y: 40, rotateX: 12, transformPerspective: 900 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.85,
          ease: "power3.out",
          delay: i * 0.1,
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
          },
        }
      );
    });
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#0a0a0a] py-24 md:py-32">
      <div className="section-shell">
        <div className="mb-4 flex items-center gap-3">
          <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">Reviews</p>
          <a
            href="https://share.google/Nw6G4msDt0KYCbXkk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-white/12 px-3 py-1 text-[11px] text-white/50 transition hover:border-salon-gold/40 hover:text-white/80"
          >
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
              <path d="M21.805 10.023H12v3.977h5.618C17.02 16.28 14.77 17.75 12 17.75c-3.176 0-5.75-2.574-5.75-5.75S8.824 6.25 12 6.25c1.39 0 2.664.496 3.648 1.312l2.97-2.97A9.706 9.706 0 0 0 12 2.25C6.615 2.25 2.25 6.615 2.25 12S6.615 21.75 12 21.75c5.523 0 9.75-4.477 9.75-10 0-.58-.052-1.147-.145-1.727Z" />
            </svg>
            4.5 · 808+ reviews on Google
          </a>
        </div>
        <h2 className="mb-14 font-display text-5xl leading-none md:text-7xl">
          What our clients say.
        </h2>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              ref={(el) => { if (el) cardsRef.current[i] = el; }}
              className="flex flex-col gap-4 rounded-xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-sm"
            >
              <Stars rating={t.rating} />
              <p className="flex-1 text-sm leading-relaxed text-white/78">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3 border-t border-white/8 pt-4">
                <div className="relative h-9 w-9 overflow-hidden rounded-full">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-white/40">{t.date}</p>
                </div>
                <svg viewBox="0 0 24 24" className="ml-auto h-4 w-4 text-white/20" fill="currentColor">
                  <path d="M21.805 10.023H12v3.977h5.618C17.02 16.28 14.77 17.75 12 17.75c-3.176 0-5.75-2.574-5.75-5.75S8.824 6.25 12 6.25c1.39 0 2.664.496 3.648 1.312l2.97-2.97A9.706 9.706 0 0 0 12 2.25C6.615 2.25 2.25 6.615 2.25 12S6.615 21.75 12 21.75c5.523 0 9.75-4.477 9.75-10 0-.58-.052-1.147-.145-1.727Z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
