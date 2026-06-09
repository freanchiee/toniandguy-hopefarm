"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Clock3 } from "lucide-react";
import { FloatingLabel } from "@/components/FloatingLabel";
import { BookNowButton } from "@/components/BookingModal";
import { heroServiceOptions, heroStylistOptions } from "@/lib/data";

const SLIDES = [
  { src: "/images/salon-hero.png",     alt: "Toni & Guy Hopefarm salon — men's styling" },
  { src: "/images/salon-interior.jpg", alt: "Toni & Guy Hopefarm — unisex hair salon Whitefield" },
];

const SLIDE_DURATION = 6000;

export function Hero() {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 900], [1, 1.1]);
  const y     = useTransform(scrollY, [0, 900], [0, 100]);

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % SLIDES.length), SLIDE_DURATION);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-svh overflow-hidden bg-salon-black">

      {/* ── Full-width crossfading slideshow ── */}
      <motion.div className="absolute inset-0" style={{ scale, y }}>
        <AnimatePresence mode="sync">
          <motion.div
            key={idx}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          >
            <Image
              src={SLIDES[idx].src}
              alt={SLIDES[idx].alt}
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Dark overlays for text legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.65)_0%,rgba(0,0,0,0.15)_50%,rgba(0,0,0,0.3)_100%)]" />
      <div className="grain" />

      {/* ── Slide dot indicators ── */}
      <div className="absolute bottom-[86px] left-1/2 z-20 flex -translate-x-1/2 gap-1.5 md:bottom-6">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === idx ? "w-6 bg-salon-gold" : "w-1.5 bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex min-h-svh flex-col justify-between px-5 py-5 md:px-8">

        {/* Top bar */}
        <div className="grid gap-5 pr-24 text-white md:grid-cols-[1.1fr_1fr_1fr_1.4fr] md:gap-10 md:pr-0">
          <div>
            {/* Logo — mix-blend-mode:screen makes grey bg invisible on dark hero */}
            <div className="flex flex-col items-start gap-2.5">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-10 md:h-16 md:w-14 shrink-0">
                  <Image
                    src="/images/tg-logo.png"
                    alt="Toni & Guy logo"
                    fill
                    priority
                    className="object-contain"
                    style={{ mixBlendMode: "screen" }}
                  />
                </div>
                <p className="font-display text-2xl font-black uppercase leading-none tracking-[0.06em] text-white drop-shadow md:text-3xl">
                  TONI&amp;GUY
                </p>
              </div>

              <p className="text-[10px] uppercase tracking-[0.28em] text-white/60 md:text-xs">
                Hopefarm · Whitefield
              </p>

              {/* Unisex badge */}
              <div className="flex items-center gap-1.5 w-fit rounded-full border border-salon-gold/40 bg-black/30 px-3 py-1 backdrop-blur-sm">
                <span className="text-salon-gold text-[11px]">✂</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-salon-gold">Unisex Salon</span>
              </div>
            </div>
          </div>

          <div className="hidden md:block" />

          <div className="hidden md:flex md:gap-4">
            <Clock3 className="mt-1 h-10 w-10 text-white" strokeWidth={1.25} />
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/68">Opening Hours</p>
              <p className="mt-3 text-sm font-semibold uppercase leading-relaxed tracking-[0.08em]">
                10:00 AM - 9:00 PM<br />Monday to Sunday
              </p>
            </div>
          </div>

          <div className="hidden md:block" />
        </div>

        {/* Centre scroll hint */}
        <motion.div
          className="absolute left-1/2 top-[18%] hidden -translate-x-1/2 text-center text-white md:block"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <p className="text-base font-medium">Navigate on the screen</p>
          <div className="mx-auto mt-2 h-9 w-px bg-white" />
          <div className="animate-floatArrow text-2xl leading-none">↓</div>
        </motion.div>

        <FloatingLabel href="/services" label="Services" delay={0.55} options={heroServiceOptions} className="left-[50%] top-[54%]" />
        <FloatingLabel href="/stylists" label="Stylists" delay={0.75} options={heroStylistOptions} align="right" className="right-[7%] top-[47%]" />
        <FloatingLabel href="/gallery" label="Gallery" delay={0.95} className="bottom-[25%] right-[9%]" />

        {/* Google Rating */}
        <motion.a
          href="https://share.google/Nw6G4msDt0KYCbXkk"
          target="_blank" rel="noopener noreferrer"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
          className="glass-label absolute right-5 top-20 z-20 flex items-center gap-2.5 rounded-full px-4 py-2.5 text-white transition hover:border-salon-gold md:right-8 md:top-24"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none">
            <path d="M21.805 10.023H12v3.977h5.618C17.02 16.28 14.77 17.75 12 17.75c-3.176 0-5.75-2.574-5.75-5.75S8.824 6.25 12 6.25c1.39 0 2.664.496 3.648 1.312l2.97-2.97A9.706 9.706 0 0 0 12 2.25C6.615 2.25 2.25 6.615 2.25 12S6.615 21.75 12 21.75c5.523 0 9.75-4.477 9.75-10 0-.58-.052-1.147-.145-1.727Z" fill="#fff" opacity=".9"/>
          </svg>
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/60">Google Rating</p>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold leading-none">4.5</span>
              <span className="text-salon-gold">★★★★½</span>
              <span className="text-xs text-white/50">· 200+</span>
            </div>
          </div>
        </motion.a>

        {/* Bottom CTA */}
        <div className="mb-8 flex items-end justify-between gap-5">
          <div className="flex flex-col items-start gap-2">
            <div className="relative">
              <span className="absolute inset-0 rounded-full bg-salon-gold/35 animate-ping [animation-duration:1.8s]" />
              <span className="absolute inset-[-4px] rounded-full border-2 border-salon-gold/50 animate-pulse [animation-duration:2.4s]" />
              <BookNowButton className="relative rounded-full bg-salon-gold px-7 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-salon-black transition hover:brightness-110 shadow-lg shadow-salon-gold/40 ring-2 ring-salon-gold/30" />
            </div>
            <p className="pl-1 text-xs text-white/55 tracking-wide">
              ✨ Book via website to avail special instant discount
            </p>
          </div>
          <p className="max-w-[16rem] text-right text-sm leading-relaxed text-white/78">
            Precision cuts, colour, bridal styling, and treatments in Whitefield.
          </p>
        </div>
      </div>
    </section>
  );
}
