import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { BookNowButton } from "@/components/BookingModal";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toniandguy-hopefarm.vercel.app";

export const metadata: Metadata = {
  title: "Toni & Guy Whitefield Price List 2025 — All Services & Prices",
  description:
    "Complete Toni & Guy Hopefarm Whitefield price list for 2025. Haircuts from ₹700, hair colour from ₹2,500, keratin from ₹1,800, balayage from ₹3,500. Plus how to get up to 35% off.",
  keywords: [
    "toni and guy whitefield price list 2025", "toni and guy bangalore price list",
    "toni guy hopefarm prices", "toni and guy price list bangalore 2025",
    "toni and guy haircut price whitefield", "toni and guy keratin price bangalore",
    "toni and guy balayage price bangalore", "toni and guy services price list",
  ],
  alternates: { canonical: `${SITE_URL}/blog/toni-and-guy-whitefield-price-list-2025` },
  openGraph: {
    title: "Toni & Guy Whitefield Price List 2025 — Complete Guide",
    description: "All service prices at Toni & Guy Hopefarm Whitefield Bangalore. Haircuts, colour, keratin, balayage, bridal & more.",
    url: `${SITE_URL}/blog/toni-and-guy-whitefield-price-list-2025`,
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Toni & Guy Whitefield Price List 2025",
  datePublished: "2025-06-01",
  author: { "@type": "Organization", name: "Toni & Guy Hopefarm" },
  publisher: { "@type": "Organization", name: "Toni & Guy Hopefarm", url: SITE_URL },
};

const priceList = [
  {
    category: "Haircut",
    items: [
      { name: "Men's Haircut (wash + styling)", price: "₹700" },
      { name: "Women's Haircut – Short", price: "₹900" },
      { name: "Women's Haircut – Medium", price: "₹1,100" },
      { name: "Women's Haircut – Long", price: "₹1,300" },
      { name: "Kids Haircut", price: "₹600" },
      { name: "Blowout / Blowdry", price: "₹800" },
    ],
  },
  {
    category: "Hair Colour",
    items: [
      { name: "Root Touch-Up", price: "₹1,500" },
      { name: "Global Colour – Short", price: "₹2,500" },
      { name: "Global Colour – Medium", price: "₹3,200" },
      { name: "Global Colour – Long", price: "₹4,500+" },
      { name: "Toner / Tonal Refresh", price: "₹1,200" },
      { name: "Fashion Colour (Vivid)", price: "₹3,500+" },
    ],
  },
  {
    category: "Balayage & Highlights",
    items: [
      { name: "Balayage – Short", price: "₹3,500" },
      { name: "Balayage – Medium", price: "₹4,500" },
      { name: "Balayage – Long", price: "₹6,000+" },
      { name: "Highlights – Partial", price: "₹2,500" },
      { name: "Highlights – Full Head", price: "₹4,000+" },
      { name: "Face Framing / Money Piece", price: "₹1,800" },
    ],
  },
  {
    category: "Keratin & Smoothening",
    items: [
      { name: "Keratin Treatment – Short", price: "₹1,800" },
      { name: "Keratin Treatment – Medium", price: "₹2,500" },
      { name: "Keratin Treatment – Long", price: "₹3,500+" },
      { name: "Nanoplastia Treatment", price: "₹3,000+" },
      { name: "Protein Smoothening", price: "₹2,800+" },
    ],
  },
  {
    category: "Bridal & Occasion",
    items: [
      { name: "Bridal Trial (Hair)", price: "₹1,500" },
      { name: "Bridal Updo / Bun", price: "₹2,000" },
      { name: "Bridal Blowout & Styling", price: "₹1,800" },
      { name: "Bridesmaids Styling (per person)", price: "₹1,200" },
    ],
  },
];

export default function PriceListBlogPage() {
  return (
    <main className="min-h-screen bg-salon-black px-5 pb-24 pt-28 text-white md:px-8 md:pt-36">
      <Script id="schema-price-blog" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <article className="mx-auto max-w-2xl">
        <nav className="mb-8 flex items-center gap-2 text-xs uppercase tracking-widest text-white/40">
          <Link href="/" className="hover:text-salon-gold">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-salon-gold">Blog</Link>
          <span>/</span>
          <span className="text-salon-gold">Price List 2025</span>
        </nav>

        <p className="text-xs text-white/40">June 2025 · 4 min read · Updated regularly</p>
        <h1 className="mt-3 font-display text-4xl font-black leading-tight uppercase md:text-6xl">
          Toni &amp; Guy Whitefield Price List 2025
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-white/70">
          The most searched question about Toni &amp; Guy Bangalore is: <em>"what are their prices?"</em>
          Here&apos;s the complete, up-to-date price list for all services at Toni &amp; Guy Hopefarm, Whitefield.
          Prices are approximate — final cost is confirmed after a brief consultation.
        </p>

        <hr className="my-10 border-white/10" />

        {priceList.map((section) => (
          <section key={section.category} className="mt-10">
            <h2 className="font-display text-2xl uppercase text-white">{section.category}</h2>
            <div className="mt-4 divide-y divide-white/8 rounded-2xl border border-white/8 overflow-hidden">
              {section.items.map(item => (
                <div key={item.name} className="flex items-center justify-between px-5 py-3.5 bg-white/[0.02]">
                  <span className="text-sm text-white/80">{item.name}</span>
                  <span className="text-sm font-semibold text-salon-gold">{item.price}</span>
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="mt-10 rounded-xl border border-salon-gold/30 bg-salon-gold/5 p-5">
          <p className="font-semibold text-white">💡 Get up to 35% off</p>
          <p className="mt-1 text-sm text-white/65">
            Book online for weekday appointments (Monday–Thursday) and receive an automatic 25–35% discount on most services.
            The discount is applied at checkout — no code needed.
          </p>
        </div>

        <section className="mt-10 prose-salon">
          <h2>About Toni &amp; Guy Hopefarm Whitefield</h2>
          <p>
            Toni &amp; Guy Hopefarm is the only international TONI&amp;GUY franchise in Whitefield and east Bangalore,
            located at 1st Floor, No.242&amp;243, Whitefield Main Road (above Axis Bank, next to Four Points Hotel).
          </p>
          <ul>
            <li>Hours: 9 AM – 9 PM, Monday to Sunday</li>
            <li>4.5★ on Google · 808+ verified reviews</li>
            <li>L'Oreal Professional products for all colour services</li>
            <li>Walk-ins welcome · Online booking recommended for weekday discounts</li>
          </ul>
        </section>

        <div className="mt-14 rounded-2xl border border-salon-gold/30 bg-salon-gold/5 p-8 text-center">
          <p className="font-display text-2xl uppercase text-white">Book at Listed Prices</p>
          <p className="mt-2 text-sm text-white/60">Toni &amp; Guy Hopefarm · Whitefield · 9 AM–9 PM Daily</p>
          <BookNowButton className="mt-5 rounded-full bg-salon-gold px-7 py-3 text-sm font-bold uppercase tracking-[0.14em] text-salon-black" />
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/services" className="text-xs text-white/40 hover:text-salon-gold">Full services page →</Link>
          <Link href="/services/keratin-treatment" className="text-xs text-white/40 hover:text-salon-gold">Keratin prices →</Link>
          <Link href="/services/balayage" className="text-xs text-white/40 hover:text-salon-gold">Balayage prices →</Link>
          <Link href="/blog" className="text-xs text-white/40 hover:text-salon-gold">← All articles</Link>
        </div>
      </article>
    </main>
  );
}
