import { RevealProvider } from "@/components/RevealProvider";
import { StylistCard } from "@/components/StylistCard";
import { stylists } from "@/lib/data";

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
