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
        <div
          className={cn(
            "pointer-events-none absolute top-[calc(100%+0.55rem)] w-[min(21rem,calc(100vw-2rem))] translate-y-2 rounded-md border border-white/18 bg-salon-black/82 p-2 opacity-0 shadow-2xl shadow-black/40 backdrop-blur-xl transition duration-300 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          <div className="mb-2 flex items-center justify-between border-b border-white/12 px-2 pb-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-salon-gold">
              Select {label}
            </span>
            <Link href={href} className="text-[10px] uppercase tracking-[0.16em] text-white/58 hover:text-white">
              View all
            </Link>
          </div>
          <div className="grid gap-1">
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
      )}
    </motion.div>
  );
}
