import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { BookNowButton } from "@/components/BookingModal";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toniandguy-hopefarm.vercel.app";

export const metadata: Metadata = {
  title: "Hair Colour Whitefield Bangalore | Root Touch-Up | Toni & Guy",
  description:
    "Professional hair colouring at Toni & Guy Hopefarm, Whitefield Bangalore. Global colour from ₹2,500, root touch-up, toning & fashion colour. L'Oreal Professional. Book online.",
  keywords: [
    "hair colour whitefield", "hair color bangalore", "root touch up whitefield",
    "global hair colour bangalore", "toni and guy hair colour bangalore",
    "hair colouring salon whitefield", "fashion colour bangalore",
    "ammonia free hair colour bangalore", "grey coverage bangalore whitefield",
  ],
  alternates: { canonical: `${SITE_URL}/services/hair-colour` },
  openGraph: {
    title: "Hair Colour Whitefield | Toni & Guy Hopefarm Bangalore",
    description: "Global colour, root touch-up & fashion colour from ₹2,500. L'Oreal Professional. Toni & Guy Hopefarm Whitefield.",
    url: `${SITE_URL}/services/hair-colour`,
  },
};

export default function HairColourPage() {
  return (
    <main className="min-h-screen bg-salon-black px-5 pb-24 pt-28 text-white md:px-8 md:pt-36">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-8 flex items-center gap-2 text-xs uppercase tracking-widest text-white/40">
          <Link href="/" className="hover:text-salon-gold">Home</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-salon-gold">Services</Link>
          <span>/</span>
          <span className="text-salon-gold">Hair Colour</span>
        </nav>

        <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">Whitefield · Bangalore</p>
        <h1 className="mt-3 font-display text-5xl font-black leading-none uppercase md:text-7xl">Hair Colour</h1>
        <p className="mt-6 text-lg leading-relaxed text-white/70">
          From subtle root touch-ups to bold global colour — professional hair colouring at Toni &amp; Guy Hopefarm,
          Whitefield. We use L&apos;Oreal Professional and Matrix exclusively for vibrant, long-lasting results.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <BookNowButton className="rounded-full bg-salon-gold px-7 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-salon-black" />
          <a href="tel:+919187200430" className="text-sm text-white/60 hover:text-salon-gold">or call +91 91872 00430</a>
        </div>

        <section className="mt-14">
          <h2 className="font-display text-3xl uppercase text-white">Price List</h2>
          <div className="mt-6 divide-y divide-white/8 rounded-2xl border border-white/8 overflow-hidden">
            {[
              { name: "Root Touch-Up", price: "₹1,500" },
              { name: "Global Colour – Short Hair", price: "₹2,500" },
              { name: "Global Colour – Medium Hair", price: "₹3,200" },
              { name: "Global Colour – Long Hair", price: "₹4,500+" },
              { name: "Toner / Tonal Refresh", price: "₹1,200" },
              { name: "Fashion Colour (Vivid)", price: "₹3,500+" },
              { name: "Grey Coverage", price: "₹1,800+" },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between px-5 py-4 bg-white/[0.02]">
                <span className="text-sm text-white/80">{item.name}</span>
                <span className="text-sm font-semibold text-salon-gold">{item.price}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-white/40">* Final price after consultation. Book online for weekday discounts up to 35%.</p>
        </section>

        <div className="mt-14 rounded-2xl border border-salon-gold/30 bg-salon-gold/5 p-8 text-center">
          <p className="font-display text-3xl uppercase text-white">Book Hair Colour</p>
          <p className="mt-2 text-white/60">Whitefield · Hopefarm Junction · 9 AM–9 PM Daily</p>
          <BookNowButton className="mt-6 rounded-full bg-salon-gold px-8 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-salon-black" />
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/services/balayage" className="text-xs text-white/40 hover:text-salon-gold">Balayage →</Link>
          <Link href="/services/keratin-treatment" className="text-xs text-white/40 hover:text-salon-gold">Keratin Treatment →</Link>
          <Link href="/services" className="text-xs text-white/40 hover:text-salon-gold">All Services →</Link>
        </div>
      </div>
    </main>
  );
}
