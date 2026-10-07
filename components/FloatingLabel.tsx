"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type FloatingLabelProps = {
  href: string;
  label: string;
  className?: string;
  delay?: number;
  options?: Array<{
    label: string;
    meta: string;
    href: string;
  }>;
  align?: "left" | "right";
};

export function FloatingLabel({
  href,
  label,
  className,
  delay = 0,
  options = [],
  align = "left"
}: FloatingLabelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn("group absolute z-20", className)}
    >
      <Link
        href={href}
        className="glass-label relative z-10 inline-flex rounded-md px-4 py-2 text-sm font-medium text-white transition hover:border-salon-gold hover:text-salon-gold focus-visible:border-salon-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-salon-gold/40 md:text-base"
      >
        {label}
      </Link>
      {options.length > 0 && (
        // Outer wrapper has top padding that bridges the gap to the trigger, so the
        // pointer never leaves the hover area; closing is delayed slightly so a
        // small slip doesn't dismiss the menu.
        <div
          className={cn(
            "pointer-events-none absolute top-full w-[min(21rem,calc(100vw-2rem))] pt-3 opacity-0 transition-opacity duration-200 delay-300 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-focus-within:delay-0 group-hover:pointer-events-auto group-hover:opacity-100 group-hover:delay-0",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          <div className="rounded-md border border-white/18 bg-salon-black/82 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between border-b border-white/12 px-2 pb-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-salon-gold">
              Select {label}
            </span>
            <Link href={href} className="text-[10px] uppercase tracking-[0.16em] text-white/58 hover:text-white">
              View all
            </Link>
          </div>
          <div className="grid max-h-[min(420px,55svh)] gap-1 overflow-y-auto overscroll-contain pr-0.5 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20">
            {options.map((option) => (
              <Link
                key={option.href}
                href={option.href}
                className="flex items-start justify-between gap-4 rounded px-2 py-2.5 text-left transition hover:bg-white/8 focus-visible:bg-white/8 focus-visible:outline-none"
              >
                <span>
                  <span className="block text-sm font-semibold text-white">{option.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-white/58">{option.meta}</span>
                </span>
                <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-salon-gold" />
              </Link>
            ))}
          </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
