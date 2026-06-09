import type { Metadata } from "next";
import { RevealProvider } from "@/components/RevealProvider";
import { StylistCard } from "@/components/StylistCard";
import { stylists } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our Stylists",
  description:
    "Meet the expert stylists at Toni & Guy Hopefarm, Whitefield Bangalore — specialists in haircuts, colour, highlights, balayage, and bridal hair. Book your favourite stylist online.",
  alternates: { canonical: "https://toniandguywhitefield.com/stylists" },
  openGraph: {
    title: "Our Stylists | Toni & Guy Hopefarm Whitefield",
    description: "Expert hair stylists trained in cuts, colour, balayage, and bridal styling at Toni & Guy Hopefarm, Whitefield Bangalore.",
    url: "https://toniandguywhitefield.com/stylists",
  },
};

export default function StylistsPage() {
  return (
    <main className="min-h-screen bg-[#0e0d0b] px-5 pb-24 pt-28 md:px-8 md:pt-36">
      <RevealProvider>
        <section className="section-shell reveal-section">
          <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">Stylists</p>
          <h1 className="mt-4 max-w-5xl font-serif text-6xl leading-none md:text-8xl">
            Meet the specialists at Hopefarm.
          </h1>
          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {stylists.map((stylist) => (
              <StylistCard key={stylist.name} {...stylist} />
            ))}
          </div>
        </section>
      </RevealProvider>
    </main>
  );
}
