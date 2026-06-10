import type { Metadata } from "next";
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
      </RevealProvider>
    </main>
  );
}
