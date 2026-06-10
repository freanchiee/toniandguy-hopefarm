import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { BookNowButton } from "@/components/BookingModal";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toniandguy-hopefarm.vercel.app";

export const metadata: Metadata = {
  title: "Best Balayage Salons in Whitefield Bangalore 2025 | Toni & Guy",
  description:
    "Searching for the best balayage salon near Whitefield or ITPL Bangalore? Read our 2025 guide covering techniques, prices, what to look for, and why Toni & Guy Hopefarm leads in east Bangalore.",
  keywords: [
    "best balayage salon whitefield bangalore", "balayage salon near ITPL",
    "balayage near me whitefield", "balayage bangalore 2025",
    "best hair colour salon whitefield", "balayage highlights bangalore",
  ],
  alternates: { canonical: `${SITE_URL}/blog/best-balayage-salon-whitefield-bangalore` },
  openGraph: {
    title: "Best Balayage Salons in Whitefield Bangalore (2025 Guide)",
    description: "Your complete guide to balayage near Whitefield and ITPL — techniques, prices, and where to go.",
    url: `${SITE_URL}/blog/best-balayage-salon-whitefield-bangalore`,
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Best Balayage Salons in Whitefield Bangalore (2025 Guide)",
  datePublished: "2025-06-01",
  author: { "@type": "Organization", name: "Toni & Guy Hopefarm" },
  publisher: { "@type": "Organization", name: "Toni & Guy Hopefarm", url: SITE_URL },
  mainEntityOfPage: `${SITE_URL}/blog/best-balayage-salon-whitefield-bangalore`,
};

export default function BalayageBlogPage() {
  return (
    <main className="min-h-screen bg-salon-black px-5 pb-24 pt-28 text-white md:px-8 md:pt-36">
      <Script id="schema-blog-balayage" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <article className="mx-auto max-w-2xl">
        <nav className="mb-8 flex items-center gap-2 text-xs uppercase tracking-widest text-white/40">
          <Link href="/" className="hover:text-salon-gold">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-salon-gold">Blog</Link>
          <span>/</span>
          <span className="text-salon-gold">Balayage Guide</span>
        </nav>

        <p className="text-xs text-white/40">June 2025 · 5 min read</p>
        <h1 className="mt-3 font-display text-4xl font-black leading-tight uppercase md:text-6xl">
          Best Balayage Salons in Whitefield Bangalore (2025)
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-white/70">
          Balayage is one of the most searched hair treatments in Whitefield and east Bangalore — and for good reason.
          The technique creates soft, natural-looking colour that grows out gracefully. But not every salon does it well.
          Here's what to look for, and who's doing it right near ITPL and Hopefarm.
        </p>

        <hr className="my-10 border-white/10" />

        <section className="prose-salon">
          <h2>What is Balayage?</h2>
          <p>
            Balayage (French for "sweeping") is a freehand hair colouring technique where the colourist hand-paints
            highlights directly onto sections of hair — without foils. The result is a soft, graduated colour that
            looks sun-kissed and natural, with no harsh lines or obvious regrowth.
          </p>
          <p>
            Unlike traditional full highlights, balayage is lower maintenance. Clients in Whitefield typically visit
            for a refresh every 3–5 months rather than every 6–8 weeks.
          </p>

          <h2>Balayage vs Highlights: Which is Right for You?</h2>
          <div className="not-prose mt-4 grid gap-4 md:grid-cols-2">
            {[
              { title: "Choose Balayage if…", points: ["You want low-maintenance colour", "You like a natural, sun-kissed look", "You prefer no harsh lines", "You want to stretch salon visits"] },
              { title: "Choose Highlights if…", points: ["You want more dramatic contrast", "You prefer uniform, defined streaks", "You want a bold, noticeable change", "You don't mind more frequent visits"] },
            ].map((c) => (
              <div key={c.title} className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
                <p className="font-semibold text-salon-gold">{c.title}</p>
                <ul className="mt-3 space-y-1">
                  {c.points.map(p => <li key={p} className="flex items-start gap-2 text-sm text-white/65"><span className="text-salon-gold">·</span>{p}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <h2>What Does Good Balayage Look Like?</h2>
          <p>
            A skilled balayage colourist considers your base colour, skin tone, and how much maintenance you want.
            The colour should blend seamlessly — you shouldn&apos;t be able to pinpoint exactly where the colour starts or ends.
            At the roots, it should be darker, transitioning to lighter mid-lengths and ends.
          </p>
          <p>
            Poor balayage looks patchy, has obvious block sections, or lifts unevenly. The most common cause? A colourist
            who hasn&apos;t been properly trained in the freehand technique — or using inferior colour products.
          </p>

          <h2>Balayage Prices in Whitefield Bangalore (2025)</h2>
          <p>
            Balayage pricing in Whitefield ranges widely depending on hair length, salon tier, and products used.
            Here&apos;s a rough guide:
          </p>
          <div className="not-prose mt-4 divide-y divide-white/8 rounded-2xl border border-white/8 overflow-hidden">
            {[
              { tier: "Budget salon", price: "₹1,500–2,000", note: "Often use local brands, inconsistent results" },
              { tier: "Mid-range salon", price: "₹2,500–4,000", note: "Better products, but technique varies" },
              { tier: "Toni & Guy Hopefarm", price: "₹3,500–6,000+", note: "Trained T&G colourists, L'Oreal Professional" },
            ].map((r) => (
              <div key={r.tier} className="px-5 py-4 bg-white/[0.02]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">{r.tier}</span>
                  <span className="text-sm text-salon-gold">{r.price}</span>
                </div>
                <p className="mt-1 text-xs text-white/40">{r.note}</p>
              </div>
            ))}
          </div>

          <h2>Why Toni &amp; Guy Hopefarm for Balayage in Whitefield</h2>
          <p>
            Toni &amp; Guy Hopefarm at Whitefield Main Road is the only international TONI&amp;GUY franchise in east Bangalore.
            All colourists undergo TONI&amp;GUY training before being permitted to perform colour services independently.
          </p>
          <ul>
            {[
              "L'Oreal Professional colour — the same products used in the TONI&GUY London flagship",
              "4.5★ on Google with 808+ verified reviews — including dozens specifically praising colour work",
              "Colour consultation included before every balayage appointment",
              "At Hopefarm Junction — 5 minutes from ITPL, 10 minutes from Marathahalli",
              "Open 9 AM–9 PM daily — no need to take a weekday off",
            ].map(p => <li key={p}>{p}</li>)}
          </ul>
        </section>

        <div className="mt-14 rounded-2xl border border-salon-gold/30 bg-salon-gold/5 p-8 text-center">
          <p className="font-display text-2xl uppercase text-white">Book Your Balayage Consultation</p>
          <p className="mt-2 text-sm text-white/60">Toni &amp; Guy Hopefarm · Whitefield Main Rd · 9 AM–9 PM</p>
          <BookNowButton className="mt-5 rounded-full bg-salon-gold px-7 py-3 text-sm font-bold uppercase tracking-[0.14em] text-salon-black" />
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/services/balayage" className="text-xs text-white/40 hover:text-salon-gold">Balayage service page →</Link>
          <Link href="/services/hair-colour" className="text-xs text-white/40 hover:text-salon-gold">Hair colour →</Link>
          <Link href="/blog" className="text-xs text-white/40 hover:text-salon-gold">← All articles</Link>
        </div>
      </article>
    </main>
  );
}
