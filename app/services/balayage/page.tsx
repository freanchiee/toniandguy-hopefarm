import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { BookNowButton } from "@/components/BookingModal";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toniandguy-hopefarm.vercel.app";

export const metadata: Metadata = {
  title: "Balayage Whitefield Bangalore | Highlights | Toni & Guy Hopefarm",
  description:
    "Expert balayage, highlights & ombre at Toni & Guy Hopefarm, Whitefield Bangalore. Soft, natural-looking colour from ₹3,500. Trained colourists, L'Oreal Professional products. Book online.",
  keywords: [
    "balayage whitefield", "balayage bangalore", "highlights whitefield bangalore",
    "ombre hair whitefield", "hair colour highlights bangalore", "balayage salon bangalore",
    "toni and guy balayage bangalore", "best balayage salon whitefield",
    "face framing highlights bangalore", "hair highlights whitefield",
  ],
  alternates: { canonical: `${SITE_URL}/services/balayage` },
  openGraph: {
    title: "Balayage & Highlights Whitefield | Toni & Guy Hopefarm",
    description: "Soft balayage, face-framing highlights & ombre from ₹3,500. L'Oreal Professional. Toni & Guy Hopefarm, Whitefield Bangalore.",
    url: `${SITE_URL}/services/balayage`,
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Balayage & Highlights",
  alternateName: ["Balayage", "Highlights", "Ombre", "Face Framing", "Colour Melt"],
  description: "Professional balayage, highlights, ombre and colour techniques at Toni & Guy Hopefarm Whitefield Bangalore. Uses L'Oreal Professional colour.",
  provider: {
    "@type": "HairSalon",
    name: "Toni & Guy Hopefarm",
    address: { "@type": "PostalAddress", addressLocality: "Whitefield, Bangalore", addressCountry: "IN" },
    telephone: "+919187200430",
  },
  offers: [
    { "@type": "Offer", name: "Balayage – Short Hair", price: "3500", priceCurrency: "INR" },
    { "@type": "Offer", name: "Balayage – Medium Hair", price: "4500", priceCurrency: "INR" },
    { "@type": "Offer", name: "Balayage – Long Hair", price: "6000", priceCurrency: "INR" },
    { "@type": "Offer", name: "Highlights – Partial", price: "2500", priceCurrency: "INR" },
    { "@type": "Offer", name: "Highlights – Full Head", price: "4000", priceCurrency: "INR" },
  ],
};

export default function BalayagePage() {
  return (
    <main className="min-h-screen bg-salon-black px-5 pb-24 pt-28 text-white md:px-8 md:pt-36">
      <Script id="schema-balayage" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="mx-auto max-w-3xl">
        <nav className="mb-8 flex items-center gap-2 text-xs uppercase tracking-widest text-white/40">
          <Link href="/" className="hover:text-salon-gold">Home</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-salon-gold">Services</Link>
          <span>/</span>
          <span className="text-salon-gold">Balayage & Highlights</span>
        </nav>

        <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">Whitefield · Bangalore</p>
        <h1 className="mt-3 font-display text-5xl font-black leading-none uppercase md:text-7xl">
          Balayage &amp; Highlights
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-white/70">
          Soft, sun-kissed balayage, face-framing highlights, and dimensional colour at Toni &amp; Guy Hopefarm, Whitefield.
          Our trained colourists use L&apos;Oreal Professional for results that look natural, grow out beautifully, and last.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <BookNowButton className="rounded-full bg-salon-gold px-7 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-salon-black" />
          <a href="tel:+919187200430" className="text-sm text-white/60 hover:text-salon-gold">or call +91 91872 00430</a>
        </div>

        <section className="mt-14">
          <h2 className="font-display text-3xl uppercase text-white">Price List</h2>
          <div className="mt-6 divide-y divide-white/8 rounded-2xl border border-white/8 overflow-hidden">
            {[
              { name: "Balayage – Short Hair", price: "₹3,500" },
              { name: "Balayage – Medium Hair", price: "₹4,500" },
              { name: "Balayage – Long Hair", price: "₹6,000+" },
              { name: "Highlights – Partial", price: "₹2,500" },
              { name: "Highlights – Full Head", price: "₹4,000+" },
              { name: "Face Framing / Money Piece", price: "₹1,800" },
              { name: "Ombre / Colour Melt", price: "₹4,000+" },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between px-5 py-4 bg-white/[0.02]">
                <span className="text-sm text-white/80">{item.name}</span>
                <span className="text-sm font-semibold text-salon-gold">{item.price}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-white/40">* Prices confirmed after consultation. Book online for weekday discounts up to 35%.</p>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-3xl uppercase text-white">Balayage vs Highlights</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              { title: "Balayage", desc: "Hand-painted technique for soft, graduated colour. No harsh lines, grows out naturally. Best for low-maintenance, sun-kissed results." },
              { title: "Highlights", desc: "Foil technique for precise, uniform lightening. More dramatic contrast. Ideal if you want defined streaks or full brightness." },
            ].map((c) => (
              <div key={c.title} className="rounded-xl border border-white/8 bg-white/[0.03] p-5">
                <p className="font-semibold text-salon-gold">{c.title}</p>
                <p className="mt-2 text-sm text-white/65 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-3xl uppercase text-white">Why Toni &amp; Guy Hopefarm?</h2>
          <ul className="mt-5 space-y-2 text-white/65">
            {[
              "Specialist colour-trained TONI&GUY stylists",
              "L'Oreal Professional colour exclusively — no harsh drugstore products",
              "4.5★ Google · 808+ reviews — trusted by Whitefield clients",
              "Free consultation before every colour service",
              "At Hopefarm Junction — closest T&G to ITPL, Varthur, Marathahalli",
            ].map((p) => <li key={p} className="flex items-start gap-2"><span className="text-salon-gold mt-1">✓</span>{p}</li>)}
          </ul>
        </section>

        <div className="mt-14 rounded-2xl border border-salon-gold/30 bg-salon-gold/5 p-8 text-center">
          <p className="font-display text-3xl uppercase text-white">Book Your Balayage</p>
          <p className="mt-2 text-white/60">Whitefield · Hopefarm Junction · 9 AM–9 PM Daily</p>
          <BookNowButton className="mt-6 rounded-full bg-salon-gold px-8 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-salon-black" />
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/services/hair-colour" className="text-xs text-white/40 hover:text-salon-gold">Hair Colour →</Link>
          <Link href="/services/keratin-treatment" className="text-xs text-white/40 hover:text-salon-gold">Keratin Treatment →</Link>
          <Link href="/services/bridal-hair" className="text-xs text-white/40 hover:text-salon-gold">Bridal Hair →</Link>
          <Link href="/services" className="text-xs text-white/40 hover:text-salon-gold">All Services →</Link>
        </div>
      </div>
    </main>
  );
}
