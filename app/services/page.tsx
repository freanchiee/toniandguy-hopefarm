import { RevealProvider } from "@/components/RevealProvider";
import { ServiceCard } from "@/components/ServiceCard";
import { services } from "@/lib/data";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-salon-black px-5 pb-24 pt-28 md:px-8 md:pt-36">
      <RevealProvider>
        <section className="section-shell reveal-section">
          <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">Services</p>
          <h1 className="mt-4 max-w-5xl font-serif text-6xl leading-none md:text-8xl">
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
