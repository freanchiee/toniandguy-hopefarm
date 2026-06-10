"use client";

import Link from "next/link";
import Image from "next/image";
import { BookNowButton } from "@/components/BookingModal";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Stylists", href: "/stylists" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" }
];

export function FloatingNav() {
  return (
    <>
      {/* Desktop top nav — links only, no Book Now button here */}
      <header className="pointer-events-none fixed left-0 right-0 top-0 z-50 flex items-center justify-end px-5 py-5 md:px-8">
        <nav className="pointer-events-auto flex w-fit items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-salon-bone mix-blend-difference md:gap-5 md:text-xs">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="editorial-link">
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Mobile sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3 border-t border-white/8 bg-salon-black/90 px-5 py-3 backdrop-blur-md md:hidden">
        <div className="flex items-center gap-2">
          <Image
            src="/images/tg-logo.png"
            alt="Toni & Guy"
            width={36}
            height={51}
            className="mix-blend-screen"
          />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white">Toni&amp;Guy</p>
            <p className="text-[9px] text-white/40 uppercase tracking-widest">Hopefarm · 10am–9pm</p>
          </div>
        </div>
        <BookNowButton className="rounded-full bg-salon-gold px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-salon-black" />
      </div>
    </>
  );
}
