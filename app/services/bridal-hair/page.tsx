import type { Metadata } from "next";
import Link from "next/link";
import { BookNowButton } from "@/components/BookingModal";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toniandguy-hopefarm.vercel.app";

export const metadata: Metadata = {
  title: "Bridal Hair Styling Whitefield Bangalore | Toni & Guy Hopefarm",
  description:
    "Specialist bridal hair styling at Toni & Guy Hopefarm, Whitefield Bangalore. Wedding updos, blowouts, bridal trials & occasion styling. Trusted by brides across east Bangalore. Book your trial today.",
  keywords: [
    "bridal hair whitefield bangalore", "bridal hairstyle bangalore", "wedding hair salon whitefield",
    "bridal hair trial bangalore", "bridal updo whitefield", "wedding hairstylist bangalore",
    "toni and guy bridal bangalore", "occasion hair styling whitefield",
    "best bridal hair salon bangalore", "engagement hair styling bangalore",
  ],
  alternates: { canonical: `${SITE_URL}/services/bridal-hair` },
  openGraph: {
    title: "Bridal Hair Styling Whitefield | Toni & Guy Hopefarm",
    description: "Wedding updos, blowouts & bridal trials at Toni & Guy Hopefarm, Whitefield. Trusted by Bangalore brides. Book your trial today.",
    url: `${SITE_URL}/services/bridal-hair`,
  },
};

export default function BridalHairPage() {
  return (
    <main className="min-h-screen bg-salon-black px-5 pb-24 pt-28 text-white md:px-8 md:pt-36">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-8 flex items-center gap-2 text-xs uppercase tracking-widest text-white/40">
          <Link href="/" className="hover:text-salon-gold">Home</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-salon-gold">Services</Link>
          <span>/</span>
          <span className="text-salon-gold">Bridal Hair</span>
        </nav>

        <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">Whitefield · Bangalore</p>
        <h1 className="mt-3 font-display text-5xl font-black leading-none uppercase md:text-7xl">Bridal Hair</h1>
        <p className="mt-6 text-lg leading-relaxed text-white/70">
          Your wedding hair, done perfectly. Toni &amp; Guy Hopefarm&apos;s specialist stylists work closely with you —
          from the bridal trial to the wedding day — to create a look that photographs beautifully and lasts all day.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <BookNowButton className="rounded-full bg-salon-gold px-7 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-salon-black" />
          <a href="tel:+919187200430" className="text-sm text-white/60 hover:text-salon-gold">Call for bridal enquiry</a>
        </div>

        <section className="mt-14">
          <h2 className="font-display text-3xl uppercase text-white">Bridal Services</h2>
          <div className="mt-6 divide-y divide-white/8 rounded-2xl border border-white/8 overflow-hidden">
            {[
              { name: "Bridal Trial (Hair)", price: "₹1,500" },
              { name: "Bridal Updo / Bun", price: "₹2,000" },
              { name: "Bridal Blowout & Styling", price: "₹1,800" },
              { name: "Bridesmaids Hair Styling", price: "₹1,200/person" },
              { name: "Pre-Bridal Hair Spa", price: "₹1,500+" },
              { name: "Pre-Bridal Keratin Treatment", price: "₹2,500+" },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between px-5 py-4 bg-white/[0.02]">
                <span className="text-sm text-white/80">{item.name}</span>
                <span className="text-sm font-semibold text-salon-gold">{item.price}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-white/40">* Group & bridesmaid packages available. Call +91 91872 00430 for enquiries.</p>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-3xl uppercase text-white">Why Book Your Bridal Hair Here</h2>
          <ul className="mt-5 space-y-2 text-white/65">
            {[
              "TONI&GUY international franchise — bridal styling expertise since 2010",
              "Dedicated bridal trial session to perfect your look before the day",
              "4.5★ Google · 808+ reviews including wedding customers",
              "Located in Whitefield — ideal for brides in east Bangalore",
              "Pre-bridal keratin, hair spa & colour services under one roof",
            ].map((p) => <li key={p} className="flex items-start gap-2"><span className="text-salon-gold mt-1">✓</span>{p}</li>)}
          </ul>
        </section>

        <div className="mt-14 rounded-2xl border border-salon-gold/30 bg-salon-gold/5 p-8 text-center">
          <p className="font-display text-3xl uppercase text-white">Book Bridal Trial</p>
          <p className="mt-2 text-white/60">Whitefield · Hopefarm Junction · 9 AM–9 PM Daily</p>
          <BookNowButton className="mt-6 rounded-full bg-salon-gold px-8 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-salon-black" />
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/services/hair-colour" className="text-xs text-white/40 hover:text-salon-gold">Hair Colour →</Link>
          <Link href="/services/balayage" className="text-xs text-white/40 hover:text-salon-gold">Balayage →</Link>
          <Link href="/services/keratin-treatment" className="text-xs text-white/40 hover:text-salon-gold">Keratin Treatment →</Link>
          <Link href="/services" className="text-xs text-white/40 hover:text-salon-gold">All Services →</Link>
        </div>
      </div>
    </main>
  );
}
