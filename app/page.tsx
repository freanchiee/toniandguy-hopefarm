import Link from "next/link";
import { Hero } from "@/components/Hero";
import { RevealProvider } from "@/components/RevealProvider";
import { ServiceCard } from "@/components/ServiceCard";
import { StylistCard } from "@/components/StylistCard";
import { GalleryGrid } from "@/components/GalleryGrid";
import { ScissorsDivider } from "@/components/ScissorsDivider";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { InstagramFeed } from "@/components/InstagramFeed";
import { services, stylists, galleryImages } from "@/lib/data";

export default function Home() {
  return (
    <main>
      <Hero />
      <RevealProvider>
        <section id="services" className="reveal-section bg-salon-black py-24 md:py-32">
          <div className="section-shell">
            <div className="mb-12 flex items-end justify-between gap-8">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">Services</p>
                <h2 className="mt-4 font-serif text-5xl leading-none md:text-7xl">Designed hair, not routine hair.</h2>
              </div>
              <Link href="/services" className="hidden text-sm uppercase tracking-[0.14em] text-salon-smoke hover:text-salon-gold md:block">
                Full menu
              </Link>
            </div>
            {services.slice(0, 3).map((service) => (
              <ServiceCard key={service.name} {...service} />
            ))}
          </div>
        </section>

        <ScissorsDivider />

        <section id="stylists" className="reveal-section bg-[#0e0d0b] py-24 md:py-32">
          <div className="section-shell">
            <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">Stylists</p>
            <h2 className="mt-4 max-w-4xl font-serif text-5xl leading-none md:text-7xl">
              Specialists for colour, cut, and occasion work.
            </h2>
            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {stylists.map((stylist) => (
                <StylistCard key={stylist.name} {...stylist} />
              ))}
            </div>
          </div>
        </section>

        <ScissorsDivider />

        <section id="gallery" className="reveal-section bg-salon-black py-24 md:py-32">
          <div className="section-shell">
            <div className="mb-12 flex items-end justify-between gap-8">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">Gallery</p>
                <h2 className="mt-4 font-serif text-5xl leading-none md:text-7xl">Recent texture, tone, and finish.</h2>
              </div>
              <Link href="/gallery" className="hidden text-sm uppercase tracking-[0.14em] text-salon-smoke hover:text-salon-gold md:block">
                View all
              </Link>
            </div>
            <GalleryGrid images={galleryImages.slice(0, 3)} />
          </div>
        </section>

        <ScissorsDivider />

        <TestimonialsSection />

        <ScissorsDivider />

        <InstagramFeed />
      </RevealProvider>
    </main>
  );
}
