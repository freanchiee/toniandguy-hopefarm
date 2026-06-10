import type { Metadata } from "next";
import Link from "next/link";
import { BookNowButton } from "@/components/BookingModal";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toniandguy-hopefarm.vercel.app";

export const metadata: Metadata = {
  title: "Haircut Whitefield Bangalore | Men's & Women's | Toni & Guy",
  description:
    "Precision haircuts for men, women & kids at Toni & Guy Hopefarm, Whitefield Bangalore. Men's cuts from ₹700, women's from ₹900. Trained TONI&GUY stylists. Walk-ins welcome. Book online.",
  keywords: [
    "haircut whitefield", "haircut bangalore", "men's haircut whitefield",
    "women's haircut whitefield bangalore", "kids haircut whitefield",
    "toni and guy haircut price bangalore", "best haircut salon whitefield",
    "hair trimming whitefield", "blowdry whitefield bangalore",
    "toni guy haircut whitefield", "precision haircut bangalore",
  ],
  alternates: { canonical: `${SITE_URL}/services/haircut` },
  openGraph: {
    title: "Haircut Whitefield Bangalore | Toni & Guy Hopefarm",
    description: "Men's cuts from ₹700, women's from ₹900. Trained TONI&GUY stylists. Walk-ins welcome at Hopefarm Junction, Whitefield.",
    url: `${SITE_URL}/services/haircut`,
  },
};

export default function HaircutPage() {
  return (
    <main className="min-h-screen bg-salon-black px-5 pb-24 pt-28 text-white md:px-8 md:pt-36">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-8 flex items-center gap-2 text-xs uppercase tracking-widest text-white/40">
          <Link href="/" className="hover:text-salon-gold">Home</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-salon-gold">Services</Link>
          <span>/</span>
          <span className="text-salon-gold">Haircut</span>
        </nav>

        <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">Whitefield · Bangalore</p>
        <h1 className="mt-3 font-display text-5xl font-black leading-none uppercase md:text-7xl">Haircut</h1>
        <p className="mt-6 text-lg leading-relaxed text-white/70">
          Precision cuts for men, women, and kids at Toni &amp; Guy Hopefarm, Whitefield. Every haircut includes a
          consultation, wash, cut, and blowdry — styled to suit your face shape, lifestyle, and texture.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <BookNowButton className="rounded-full bg-salon-gold px-7 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-salon-black" />
          <span className="text-sm text-white/40">Walk-ins also welcome · 9 AM–9 PM</span>
        </div>

        <section className="mt-14">
          <h2 className="font-display text-3xl uppercase text-white">Price List</h2>
          <div className="mt-6 divide-y divide-white/8 rounded-2xl border border-white/8 overflow-hidden">
            {[
              { name: "Men's Haircut (includes wash + styling)", price: "₹700" },
              { name: "Women's Haircut – Short", price: "₹900" },
              { name: "Women's Haircut – Medium", price: "₹1,100" },
              { name: "Women's Haircut – Long", price: "₹1,300" },
              { name: "Kids Haircut (under 12)", price: "₹600" },
              { name: "Blowout / Blowdry Only", price: "₹800" },
              { name: "Hair Trim", price: "₹500" },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between px-5 py-4 bg-white/[0.02]">
                <span className="text-sm text-white/80">{item.name}</span>
                <span className="text-sm font-semibold text-salon-gold">{item.price}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-white/40">* Book online for weekday discounts of 25–35%.</p>
        </section>

        <div className="mt-14 rounded-2xl border border-salon-gold/30 bg-salon-gold/5 p-8 text-center">
          <p className="font-display text-3xl uppercase text-white">Book a Haircut</p>
          <p className="mt-2 text-white/60">Whitefield · Hopefarm Junction · Walk-ins welcome · 9 AM–9 PM</p>
          <BookNowButton className="mt-6 rounded-full bg-salon-gold px-8 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-salon-black" />
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/services/hair-colour" className="text-xs text-white/40 hover:text-salon-gold">Hair Colour →</Link>
          <Link href="/services/keratin-treatment" className="text-xs text-white/40 hover:text-salon-gold">Keratin →</Link>
          <Link href="/services/balayage" className="text-xs text-white/40 hover:text-salon-gold">Balayage →</Link>
          <Link href="/services" className="text-xs text-white/40 hover:text-salon-gold">All Services →</Link>
        </div>
      </div>
    </main>
  );
}
