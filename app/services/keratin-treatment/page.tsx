import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { BookNowButton } from "@/components/BookingModal";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toniandguy-hopefarm.vercel.app";

export const metadata: Metadata = {
  title: "Keratin Treatment Whitefield Bangalore | Toni & Guy Hopefarm",
  description:
    "Professional keratin treatment, Nanoplastia & hair Botox at Toni & Guy Hopefarm, Whitefield Bangalore. Prices from ₹1,800. Frizz-free, silky smooth hair for 3–6 months. Book online for up to 35% off.",
  keywords: [
    "keratin treatment whitefield", "keratin treatment bangalore", "keratin treatment hopefarm",
    "nanoplastia whitefield", "hair smoothening whitefield bangalore", "hair botox bangalore",
    "toni and guy keratin price bangalore", "best keratin treatment whitefield",
    "frizz treatment bangalore", "smoothening treatment whitefield",
  ],
  alternates: { canonical: `${SITE_URL}/services/keratin-treatment` },
  openGraph: {
    title: "Keratin Treatment Whitefield | Toni & Guy Hopefarm",
    description: "Keratin, Nanoplastia & hair Botox from ₹1,800. 3–6 months frizz-free results. Toni & Guy Hopefarm, Whitefield Bangalore.",
    url: `${SITE_URL}/services/keratin-treatment`,
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Keratin Treatment",
  alternateName: ["Nanoplastia", "Hair Botox", "Hair Smoothening Treatment"],
  description: "Professional keratin hair smoothening treatments at Toni & Guy Hopefarm Whitefield. Includes Brazilian keratin, Nanoplastia, and hair Botox. Results last 3–6 months.",
  provider: {
    "@type": "HairSalon",
    name: "Toni & Guy Hopefarm",
    address: { "@type": "PostalAddress", addressLocality: "Whitefield, Bangalore", addressCountry: "IN" },
    telephone: "+919187200430",
  },
  areaServed: { "@type": "City", name: "Bangalore" },
  offers: [
    { "@type": "Offer", name: "Keratin Treatment – Short Hair", price: "1800", priceCurrency: "INR" },
    { "@type": "Offer", name: "Keratin Treatment – Medium Hair", price: "2500", priceCurrency: "INR" },
    { "@type": "Offer", name: "Keratin Treatment – Long Hair", price: "3500", priceCurrency: "INR" },
    { "@type": "Offer", name: "Nanoplastia Treatment", price: "3000", priceCurrency: "INR" },
    { "@type": "Offer", name: "Hair Botox Treatment", price: "2800", priceCurrency: "INR" },
  ],
};

export default function KeratinPage() {
  return (
    <main className="min-h-screen bg-salon-black px-5 pb-24 pt-28 text-white md:px-8 md:pt-36">
      <Script id="schema-keratin" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="mx-auto max-w-3xl">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-xs uppercase tracking-widest text-white/40">
          <Link href="/" className="hover:text-salon-gold">Home</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-salon-gold">Services</Link>
          <span>/</span>
          <span className="text-salon-gold">Keratin Treatment</span>
        </nav>

        <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">Whitefield · Bangalore</p>
        <h1 className="mt-3 font-display text-5xl font-black leading-none uppercase md:text-7xl">
          Keratin Treatment
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-white/70">
          Professional keratin smoothening, Nanoplastia, and hair Botox at Toni &amp; Guy Hopefarm, Whitefield.
          Get frizz-free, silky smooth hair that lasts 3–6 months — even through Bangalore's humidity.
        </p>

        {/* CTA */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <BookNowButton className="rounded-full bg-salon-gold px-7 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-salon-black" />
          <a href="tel:+919187200430" className="text-sm text-white/60 hover:text-salon-gold">or call +91 91872 00430</a>
        </div>

        {/* Pricing */}
        <section className="mt-14">
          <h2 className="font-display text-3xl uppercase text-white">Price List</h2>
          <div className="mt-6 divide-y divide-white/8 rounded-2xl border border-white/8 overflow-hidden">
            {[
              { name: "Keratin Treatment – Short Hair", price: "₹1,800" },
              { name: "Keratin Treatment – Medium Hair", price: "₹2,500" },
              { name: "Keratin Treatment – Long Hair", price: "₹3,500+" },
              { name: "Nanoplastia Treatment", price: "₹3,000+" },
              { name: "Hair Botox Treatment", price: "₹2,800+" },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between px-5 py-4 bg-white/[0.02]">
                <span className="text-sm text-white/80">{item.name}</span>
                <span className="text-sm font-semibold text-salon-gold">{item.price}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-white/40">* Final price confirmed after consultation. Book online for weekday discount of 25–35%.</p>
        </section>

        {/* What is it */}
        <section className="mt-14">
          <h2 className="font-display text-3xl uppercase text-white">What is Keratin Treatment?</h2>
          <p className="mt-4 text-white/65 leading-relaxed">
            Keratin treatment is a professional hair smoothening procedure that coats each hair strand with a keratin protein layer,
            eliminating frizz and reducing curl for 3–6 months. At Toni &amp; Guy Hopefarm Whitefield, we offer three types:
          </p>
          <ul className="mt-4 space-y-3">
            {[
              { name: "Brazilian Keratin", desc: "Classic smoothening, ideal for thick, frizzy, or chemically treated hair." },
              { name: "Nanoplastia", desc: "Organic alternative using amino acids. Safer for damaged hair, results last 4–6 months." },
              { name: "Hair Botox", desc: "Deep conditioning treatment that fills in hair porosity. No harsh chemicals — great for colour-treated hair." },
            ].map((t) => (
              <li key={t.name} className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
                <span className="font-semibold text-white">{t.name} — </span>
                <span className="text-white/65">{t.desc}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Why T&G */}
        <section className="mt-14">
          <h2 className="font-display text-3xl uppercase text-white">Why Toni &amp; Guy Hopefarm?</h2>
          <ul className="mt-5 space-y-2 text-white/65">
            {[
              "International TONI&GUY franchise — trained stylists, global standards",
              "4.5★ on Google · 808+ reviews from Whitefield customers",
              "L'Oreal Professional & System Professional products only",
              "Located at Hopefarm Junction — closest T&G to ITPL, Marathahalli, Varthur",
              "Open 9 AM–9 PM daily, no appointment necessary",
            ].map((p) => <li key={p} className="flex items-start gap-2"><span className="text-salon-gold mt-1">✓</span>{p}</li>)}
          </ul>
        </section>

        {/* Bottom CTA */}
        <div className="mt-14 rounded-2xl border border-salon-gold/30 bg-salon-gold/5 p-8 text-center">
          <p className="font-display text-3xl uppercase text-white">Book Your Keratin Treatment</p>
          <p className="mt-2 text-white/60">Whitefield · Hopefarm Junction · 9 AM–9 PM Daily</p>
          <BookNowButton className="mt-6 rounded-full bg-salon-gold px-8 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-salon-black" />
        </div>

        {/* Internal links */}
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/services/balayage" className="text-xs text-white/40 hover:text-salon-gold">Balayage →</Link>
          <Link href="/services/hair-colour" className="text-xs text-white/40 hover:text-salon-gold">Hair Colour →</Link>
          <Link href="/services/bridal-hair" className="text-xs text-white/40 hover:text-salon-gold">Bridal Hair →</Link>
          <Link href="/services" className="text-xs text-white/40 hover:text-salon-gold">All Services →</Link>
        </div>
      </div>
    </main>
  );
}
