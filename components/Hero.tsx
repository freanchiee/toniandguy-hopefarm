"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Clock3 } from "lucide-react";
import { FloatingLabel } from "@/components/FloatingLabel";
import { BookNowButton } from "@/components/BookingModal";
import { heroServiceOptions, heroStylistOptions } from "@/lib/data";

export function Hero() {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 900], [1, 1.12]);
  const y = useTransform(scrollY, [0, 900], [0, 120]);

  // Track whether the new images have loaded — fall back gracefully if not saved yet
  const [interiorLoaded, setInteriorLoaded] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  return (
    <section className="relative min-h-svh overflow-hidden bg-salon-black">
      {/* ── Background layer (always visible: salon-hero.png) ── */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        style={{ scale, y }}
      >
        <Image
          src="/images/salon-hero.png"
          alt="Toni & Guy Hopefarm salon"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* ── Blurred bg overlay (salon-interior.jpg once saved) ── */}
      {/* Hidden img used to probe if the file exists */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/salon-interior.jpg"
        alt=""
        className="sr-only"
        onLoad={() => setInteriorLoaded(true)}
        onError={() => setInteriorLoaded(false)}
      />

      {interiorLoaded && (
        <>
          {/* Blurred bg */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{ scale, y }}
          >
            <Image
              src="/images/salon-interior.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover blur-sm scale-105"
            />
          </motion.div>

          {/* Sharp foreground — right 62% on desktop, full on mobile */}
          <motion.div
            className="absolute inset-0 md:left-[38%]"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          >
            <Image
              src="/images/salon-interior.jpg"
              alt="Toni & Guy Hopefarm — Unisex Hair Salon Whitefield"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 62vw"
              className="object-cover object-center"
            />
            {/* Left-edge fade blends into blurred layer */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.95)_0%,rgba(0,0,0,0.4)_30%,transparent_60%)]" />
          </motion.div>
        </>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/75" />
      <div className="grain" />

      <div className="relative z-10 flex min-h-svh flex-col justify-between px-5 py-5 md:px-8">
        <div className="grid gap-5 pr-24 text-white md:grid-cols-[1.1fr_1fr_1fr_1.4fr] md:gap-10 md:pr-0">
          <div>
            {/* ── Logo: real TG monogram image or SVG fallback ── */}
            {/* Hidden probe for tg-logo.png */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/tg-logo.png"
              alt=""
              className="sr-only"
              onLoad={() => setLogoLoaded(true)}
              onError={() => setLogoLoaded(false)}
            />

            <div className="flex flex-col items-start gap-2.5">
              {logoLoaded ? (
                <Image
                  src="/images/tg-logo.png"
                  alt="Toni & Guy"
                  width={110}
                  height={130}
                  className="drop-shadow-xl brightness-0 invert md:w-[130px]"
                  priority
                />
              ) : (
                /* SVG fallback until tg-logo.png is saved */
                <div className="flex items-center gap-2.5">
                  <svg viewBox="0 0 56 56" className="h-10 w-10 shrink-0 drop-shadow-lg md:h-14 md:w-14" fill="none" aria-label="Toni&Guy logo">
                    <circle cx="28" cy="28" r="27" stroke="white" strokeWidth="1.5" fill="none" opacity="0.25"/>
                    <path d="M10 17h36v4.5H31v18h-6V21.5H10V17z" fill="white"/>
                  </svg>
                  <p className="font-display text-2xl font-black uppercase leading-none tracking-[0.06em] text-white md:text-4xl">
                    TONI&amp;GUY
                  </p>
                </div>
              )}

              <p className="text-[10px] uppercase tracking-[0.28em] text-white/60 md:text-xs">
                Hopefarm · Whitefield
              </p>

              {/* Unisex Salon badge */}
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
                10:00 AM - 9:00 PM
                <br />
                Monday to Sunday
              </p>
            </div>
          </div>
          <div className="hidden md:block" />
        </div>

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

        <FloatingLabel
          href="/services"
          label="Services"
          delay={0.55}
          options={heroServiceOptions}
          className="left-[50%] top-[54%]"
        />
        <FloatingLabel
          href="/stylists"
          label="Stylists"
          delay={0.75}
          options={heroStylistOptions}
          align="right"
          className="right-[7%] top-[47%]"
        />
        <FloatingLabel
          href="/gallery"
          label="Gallery"
          delay={0.95}
          className="bottom-[25%] right-[9%]"
        />

        {/* Google Rating Badge */}
        <motion.a
          href="https://share.google/Nw6G4msDt0KYCbXkk"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
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
