import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Hero } from "@/components/Hero";
import { RevealProvider } from "@/components/RevealProvider";
import { ServiceCard } from "@/components/ServiceCard";
import { StylistCard } from "@/components/StylistCard";
import { GalleryGrid } from "@/components/GalleryGrid";
import { ScissorsDivider } from "@/components/ScissorsDivider";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { InstagramFeed } from "@/components/InstagramFeed";
import { services, stylists, galleryImages } from "@/lib/data";

export const metadata: Metadata = {
  alternates: { canonical: "https://toniandguywhitefield.com" },
};

// ── Structured data (JSON-LD) ─────────────────────────────────────────────────
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  "@id": "https://toniandguywhitefield.com/#salon",
  name: "Toni & Guy Hopefarm",
  alternateName: "Toni and Guy Whitefield",
  description:
    "Toni & Guy Hopefarm is Whitefield Bangalore's premier international hair salon, offering expert haircuts, hair colour, highlights, keratin treatments, balayage, and bridal hair styling by trained professionals.",
  url: "https://toniandguywhitefield.com",
  telephone: "+919187200430",
  priceRange: "₹₹",
  image: "https://toniandguywhitefield.com/images/salon-hero.png",
  logo: "https://toniandguywhitefield.com/images/og-image.jpg",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Hopefarm, Whitefield",
    addressLocality: "Bangalore",
    addressRegion: "Karnataka",
    postalCode: "560066",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 12.9716,
    longitude: 77.7480,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      opens: "10:00",
      closes: "21:00",
    },
  ],
  sameAs: [
    "https://www.instagram.com/toniandguy_whitefield/",
    "https://www.facebook.com/toni.guy.whitefield/",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Hair Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Haircut", description: "Men's and women's precision cuts" }, priceSpecification: { "@type": "PriceSpecification", priceCurrency: "INR", price: "700" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hair Colour", description: "Global colour, root touch-up, and tonal refresh" }, priceSpecification: { "@type": "PriceSpecification", priceCurrency: "INR", price: "2500" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Highlights & Balayage", description: "Soft balayage, face-framing, and dimensional highlights" }, priceSpecification: { "@type": "PriceSpecification", priceCurrency: "INR", price: "3500" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Keratin Treatment", description: "Professional keratin, Nanoplastia, and Botox treatments" }, priceSpecification: { "@type": "PriceSpecification", priceCurrency: "INR", price: "1800" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Bridal Hair Styling", description: "Bridal and event hair styling" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hair Spa", description: "System Professional spa rituals and scalp care" } },
    ],
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.5",
    reviewCount: "200",
    bestRating: "5",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Where is Toni & Guy Hopefarm located?",
      acceptedAnswer: { "@type": "Answer", text: "Toni & Guy Hopefarm is located at Hopefarm, Whitefield, Bangalore, Karnataka 560066. It is one of the few international hair salons in the Whitefield area." },
    },
    {
      "@type": "Question",
      name: "What are the opening hours of Toni & Guy Whitefield?",
      acceptedAnswer: { "@type": "Answer", text: "Toni & Guy Hopefarm is open every day from Monday to Sunday, 10:00 AM to 9:00 PM." },
    },
    {
      "@type": "Question",
      name: "How can I book an appointment at Toni & Guy Hopefarm?",
      acceptedAnswer: { "@type": "Answer", text: "You can book an appointment online at toniandguywhitefield.com and receive an exclusive discount on your booking. You can also call +91 91872 00430 or walk in." },
    },
    {
      "@type": "Question",
      name: "What services does Toni & Guy Whitefield offer?",
      acceptedAnswer: { "@type": "Answer", text: "Toni & Guy Hopefarm offers haircuts for men and women, hair colouring, highlights, balayage, keratin treatments, Nanoplastia, blowouts, hair spa, and bridal hair styling." },
    },
    {
      "@type": "Question",
      name: "Is Toni & Guy Hopefarm good for hair colour and highlights in Whitefield?",
      acceptedAnswer: { "@type": "Answer", text: "Yes, Toni & Guy Hopefarm is considered one of the best salons in Whitefield for hair colour, highlights, and balayage, with trained international stylists." },
    },
    {
      "@type": "Question",
      name: "What is the price for a haircut at Toni & Guy Hopefarm?",
      acceptedAnswer: { "@type": "Answer", text: "Haircuts at Toni & Guy Hopefarm start from ₹700. Prices vary based on hair length, stylist, and service. Book online for a weekday discount of 25–35%." },
    },
  ],
};

export default function Home() {
  return (
    <main>
      {/* ── JSON-LD structured data ── */}
      <Script
        id="schema-local-business"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Script
        id="schema-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

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
