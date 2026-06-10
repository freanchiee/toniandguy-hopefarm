import type { Metadata } from "next";
import Link from "next/link";
import { RevealProvider } from "@/components/RevealProvider";
import { ServiceCard } from "@/components/ServiceCard";
import { services } from "@/lib/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toniandguy-hopefarm.vercel.app";

export const metadata: Metadata = {
  title: "Toni & Guy Price List Bangalore | Services & Prices Whitefield",
  description:
    "Complete Toni & Guy price list for Bangalore Whitefield: haircuts from ₹700, hair colour from ₹2,500, highlights ₹3,500, keratin treatments, balayage & bridal styling. The only Toni & Guy salon at Hopefarm, Whitefield. Book online for up to 35% off.",
  keywords: [
    "toni and guy price list bangalore", "toni and guy bangalore price list",
    "toni and guy whitefield price list", "hair salon whitefield prices",
    "toni guy haircut price bangalore", "toni and guy keratin price bangalore",
    "salon whitefield bangalore", "best salon whitefield",
  ],
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: {
    title: "Toni & Guy Price List Bangalore | Hopefarm Whitefield",
    description: "Full price list: haircuts from ₹700, colour ₹2,500, highlights ₹3,500, keratin, balayage & bridal. Toni & Guy Hopefarm, Whitefield Bangalore.",
    url: `${SITE_URL}/services`,
  },
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-salon-black px-5 pb-24 pt-28 md:px-8 md:pt-36">
      <RevealProvider>
        <section className="section-shell reveal-section">
          <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">Services</p>
          <h1 className="mt-4 max-w-5xl font-display text-6xl leading-none md:text-8xl">
            A concise menu for hair with intention.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-salon-smoke">
            Pricing depends on hair length, density, and consultation. The team will confirm before service begins.
          </p>
          <div className="mt-16">
            {services.map((service) => (
              <ServiceCard key={service.name} {...service} />
            ))}
          </div>
        </section>

        {/* Service landing page links */}
        <section className="reveal-section mt-20 section-shell">
          <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">Deep Dives</p>
          <h2 className="mt-3 font-display text-4xl uppercase text-white md:text-5xl">Explore by Service</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/services/keratin-treatment", label: "Keratin Treatment", sub: "Smoothening · Nanoplastia · Hair Botox" },
              { href: "/services/balayage", label: "Balayage & Highlights", sub: "Sun-kissed colour · Ombre · Face framing" },
              { href: "/services/hair-colour", label: "Hair Colour", sub: "Global colour · Root touch-up · Fashion colour" },
              { href: "/services/bridal-hair", label: "Bridal Hair", sub: "Wedding styling · Updos · Bridal trial" },
              { href: "/services/haircut", label: "Haircut", sub: "Men · Women · Kids · Blowout" },
            ].map((s) => (
              <Link key={s.href} href={s.href}
                className="group rounded-2xl border border-white/8 bg-white/[0.02] p-5 transition hover:border-salon-gold/40 hover:bg-white/[0.05]">
                <p className="font-semibold text-white group-hover:text-salon-gold transition">{s.label} →</p>
                <p className="mt-1 text-xs text-white/40">{s.sub}</p>
              </Link>
            ))}
          </div>
        </section>
      </RevealProvider>
    </main>
  );
}
