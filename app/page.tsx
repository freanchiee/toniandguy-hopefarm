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
import { LocationSection } from "@/components/LocationSection";
import { FaqSection } from "@/components/FaqSection";
import { StyleMatchBanner } from "@/components/StyleMatchBanner";
import { services, stylists, galleryImages } from "@/lib/data";

// Switch to "https://toniandguywhitefield.com" once domain is live
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toniandguy-hopefarm.vercel.app";

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
};

// ── Structured data (JSON-LD) ─────────────────────────────────────────────────
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  "@id": `${SITE_URL}/#salon`,
  name: "Toni & Guy Hopefarm",
  alternateName: ["Toni and Guy Whitefield", "Toni Guy Hopefarm Bangalore", "TONI&GUY Whitefield"],
  description:
    "Toni & Guy Hopefarm is Whitefield Bangalore's premier international hair salon, offering expert haircuts, hair colour, highlights, keratin treatments, balayage, and bridal hair styling by trained professionals. Located at Hopefarm Junction, open 9 AM to 9 PM daily.",
  url: SITE_URL,
  telephone: "+919187200430",
  priceRange: "₹₹",
  image: `${SITE_URL}/images/salon-hero.png`,
  logo: `${SITE_URL}/images/tg-logo.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "1st Floor, No-242&243, Whitefield Main Rd, above Axis Bank, next to Four Points Hotel, Inner Valley, Hopefarm",
    addressLocality: "Bengaluru",
    addressRegion: "Karnataka",
    postalCode: "560066",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 12.9767,
    longitude: 77.7353,
  },
  hasMap: "https://maps.app.goo.gl/nFqNAeWzgR4XLTne9",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      opens: "09:00",
      closes: "21:00",
    },
  ],
  sameAs: [
    "https://www.instagram.com/toniandguy_whitefield/",
    "https://www.facebook.com/toni.guy.whitefield/",
    "https://maps.app.goo.gl/nFqNAeWzgR4XLTne9",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Hair & Beauty Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Men's Haircut", description: "Precision men's haircut and styling" }, priceSpecification: { "@type": "PriceSpecification", priceCurrency: "INR", price: "700" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Women's Haircut", description: "Women's haircut, trim and blowdry" }, priceSpecification: { "@type": "PriceSpecification", priceCurrency: "INR", price: "900" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hair Colour", description: "Global colour, root touch-up, and tonal refresh" }, priceSpecification: { "@type": "PriceSpecification", priceCurrency: "INR", price: "2500" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Highlights & Balayage", description: "Soft balayage, face-framing, and dimensional highlights" }, priceSpecification: { "@type": "PriceSpecification", priceCurrency: "INR", price: "3500" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Keratin Treatment", description: "Professional keratin, Nanoplastia, and protein smoothening treatments" }, priceSpecification: { "@type": "PriceSpecification", priceCurrency: "INR", price: "1800" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Bridal Hair Styling", description: "Bridal and event hair styling by specialist stylists" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hair Spa", description: "System Professional and L'Oreal spa rituals and scalp care" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Skin & Facial", description: "Sothys, Dermalogica, and Skeyndor facials and skin treatments" } },
    ],
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.5",
    reviewCount: "808",
    bestRating: "5",
  },
};

// ── FAQ schema — critical for Google AI Overviews, Perplexity, and ChatGPT citations ──
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Where is Toni & Guy Hopefarm located?",
      acceptedAnswer: { "@type": "Answer", text: "Toni & Guy Hopefarm is located at Hopefarm Junction, Whitefield Main Road, Bangalore, Karnataka 560066, near Hopefarm Signal. Google Maps: https://maps.app.goo.gl/nFqNAeWzgR4XLTne9" },
    },
    {
      "@type": "Question",
      name: "What are the opening hours of Toni & Guy Whitefield?",
      acceptedAnswer: { "@type": "Answer", text: "Toni & Guy Hopefarm is open every day from Monday to Sunday, 9:00 AM to 9:00 PM. No weekly off — open all 7 days." },
    },
    {
      "@type": "Question",
      name: "How can I book an appointment at Toni & Guy Hopefarm?",
      acceptedAnswer: { "@type": "Answer", text: "You can book an appointment online at toniandguy-hopefarm.vercel.app and receive an instant discount of up to 35% on weekdays. You can also call +91 91872 00430 or walk in directly." },
    },
    {
      "@type": "Question",
      name: "What services does Toni & Guy Whitefield offer?",
      acceptedAnswer: { "@type": "Answer", text: "Toni & Guy Hopefarm offers: haircuts for men, women, and kids; hair colouring; highlights and balayage; keratin treatments and Nanoplastia; blowouts and styling; hair spa; bridal and occasion hair; skin and facial treatments (Sothys, Dermalogica, Skeyndor); manicure and pedicure; nail extensions; waxing; and threading." },
    },
    {
      "@type": "Question",
      name: "Is Toni & Guy Hopefarm a good salon in Whitefield Bangalore?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Toni & Guy Hopefarm is rated 4.5 stars on Google with over 808 reviews, making it one of the highest-rated international hair salons in Whitefield, Bangalore. It is part of the globally renowned TONI&GUY franchise." },
    },
    {
      "@type": "Question",
      name: "What is the price for a haircut at Toni & Guy Hopefarm?",
      acceptedAnswer: { "@type": "Answer", text: "Men's haircuts at Toni & Guy Hopefarm start from ₹700. Women's cuts start from ₹900. Book online for weekday discounts of 25–35%." },
    },
    {
      "@type": "Question",
      name: "Does Toni & Guy Hopefarm do bridal hair?",
      acceptedAnswer: { "@type": "Answer", text: "Yes, Toni & Guy Hopefarm offers specialist bridal hair styling and trial sessions. Their stylists are trained for wedding updos, blowouts, and full occasion styling." },
    },
    {
      "@type": "Question",
      name: "What is the phone number of Toni & Guy Hopefarm Whitefield?",
      acceptedAnswer: { "@type": "Answer", text: "The contact number for Toni & Guy Hopefarm Whitefield is +91 91872 00430. You can call or WhatsApp on this number." },
    },
    {
      "@type": "Question",
      name: "Which is the best salon near Hopefarm Junction Whitefield?",
      acceptedAnswer: { "@type": "Answer", text: "Toni & Guy Hopefarm is widely considered the best salon near Hopefarm Junction in Whitefield. It is an international brand salon with 808+ Google reviews and a 4.5-star rating, offering hair, skin, and nail services." },
    },
    {
      "@type": "Question",
      name: "Does Toni & Guy Hopefarm offer keratin and smoothening treatments?",
      acceptedAnswer: { "@type": "Answer", text: "Yes, Toni & Guy Hopefarm offers professional keratin treatments, Nanoplastia, and protein smoothening treatments starting from ₹1800. Suitable for frizzy, curly, and chemically treated hair." },
    },
    {
      "@type": "Question",
      name: "Is there a Toni & Guy salon near Whitefield Bangalore?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Toni & Guy Hopefarm is the Toni & Guy franchise salon located directly in Whitefield, Bangalore at Hopefarm Junction. It is the closest Toni & Guy to areas like Varthur, Marathahalli, ITPL, Mahadevapura, Brookefield, and Bellandur." },
    },
    {
      "@type": "Question",
      name: "Which Toni & Guy branch is closest to ITPL and Whitefield?",
      acceptedAnswer: { "@type": "Answer", text: "Toni & Guy Hopefarm is the closest Toni & Guy branch to ITPL, Whitefield, Varthur, Marathahalli, and east Bangalore. It is located at Hopefarm Junction on Whitefield Main Road." },
    },
    {
      "@type": "Question",
      name: "What is the Toni & Guy price list for Bangalore in 2025?",
      acceptedAnswer: { "@type": "Answer", text: "At Toni & Guy Hopefarm Whitefield: Men's haircut from ₹700, Women's haircut from ₹900, Hair colour from ₹2,500, Highlights/Balayage from ₹3,500, Keratin treatment from ₹1,800, Hair spa from ₹1,200, Blowout from ₹800. Book online for weekday discounts of 25–35%." },
    },
    {
      "@type": "Question",
      name: "Is Toni & Guy Hopefarm good for hair colour in Bangalore?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Toni & Guy Hopefarm Whitefield is highly rated for hair colour, balayage, and highlights in Bangalore. Colour services start from ₹2,500 for global colour and ₹3,500 for highlights. The salon uses L'Oreal Professional and System Professional products." },
    },
    {
      "@type": "Question",
      name: "Does Toni & Guy Hopefarm serve customers from Marathahalli and Bellandur?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Toni & Guy Hopefarm at Whitefield regularly serves clients from Marathahalli, Bellandur, Varthur, ITPL, Mahadevapura, Brookefield, Kundalahalli, and surrounding east Bangalore neighbourhoods." },
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
        <StyleMatchBanner />

        <section id="services" className="reveal-section bg-salon-black py-24 md:py-32">
          <div className="section-shell">
            <div className="mb-12 flex items-end justify-between gap-8">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">Services</p>
                <h2 className="mt-4 font-display text-5xl leading-none md:text-7xl">Designed hair, not routine hair.</h2>
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
            <h2 className="mt-4 max-w-4xl font-display text-5xl leading-none md:text-7xl">
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
                <h2 className="mt-4 font-display text-5xl leading-none md:text-7xl">Recent texture, tone, and finish.</h2>
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

        <ScissorsDivider />

        <FaqSection />

        <ScissorsDivider />

        <LocationSection />
      </RevealProvider>
    </main>
  );
}
