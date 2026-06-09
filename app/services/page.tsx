import type { Metadata } from "next";
import { RevealProvider } from "@/components/RevealProvider";
import { ServiceCard } from "@/components/ServiceCard";
import { services } from "@/lib/data";

export const metadata: Metadata = {
  title: "Hair Services & Prices",
  description:
    "Full menu of hair services at Toni & Guy Hopefarm, Whitefield: haircuts from ₹700, hair colour from ₹2,500, highlights from ₹3,500, keratin treatments, balayage, blowouts & bridal styling. Book online for exclusive discounts.",
  alternates: { canonical: "https://toniandguywhitefield.com/services" },
  openGraph: {
    title: "Hair Services & Prices | Toni & Guy Hopefarm Whitefield",
    description: "Haircuts, colour, highlights, keratin & bridal styling — see the full menu and prices at Toni & Guy Hopefarm, Whitefield Bangalore.",
    url: "https://toniandguywhitefield.com/services",
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
