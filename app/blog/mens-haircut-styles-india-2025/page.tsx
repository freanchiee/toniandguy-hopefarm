import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toniandguywhitefield.com";

export const metadata: Metadata = {
  title: "Popular Men's Haircut Styles India 2025 | Men's Haircut Whitefield Bangalore",
  description:
    "The most popular men's haircut styles trending in India in 2025 — from textured crops to fade cuts. Expert guide from Toni & Guy Whitefield Bangalore. Men's cuts from ₹700.",
  keywords: [
    "mens haircut styles india 2025", "popular mens haircuts india",
    "mens haircut whitefield bangalore", "fade haircut whitefield",
    "textured crop haircut bangalore", "toni and guy mens haircut whitefield",
    "best mens salon whitefield", "mens hair trends india 2025",
  ],
  alternates: { canonical: `${SITE_URL}/blog/mens-haircut-styles-india-2025` },
  openGraph: {
    title: "Popular Men's Haircut Styles India 2025 | Toni & Guy Whitefield",
    description: "The trending men's haircut styles in India for 2025 — textured crops, fades, curtain bangs, and more from our Whitefield salon.",
    url: `${SITE_URL}/blog/mens-haircut-styles-india-2025`,
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Popular Men's Haircut Styles India 2025",
  description: "The most popular men's haircut styles trending in India in 2025, with expert guidance from Toni & Guy Hopefarm Whitefield.",
  datePublished: "2025-06-01",
  dateModified: "2025-06-01",
  author: { "@type": "Organization", name: "Toni & Guy Hopefarm Whitefield" },
  publisher: { "@type": "Organization", name: "Toni & Guy Hopefarm" },
  mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/mens-haircut-styles-india-2025` },
  "@graph": [
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What are the most popular men's haircut styles trending in India right now?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The most popular men's haircuts in India in 2025 are the textured crop, low fade with side part, curtain bangs, buzz cut with fade, and the modern quiff. Textured cuts that work with natural hair texture rather than against it are the dominant trend.",
          },
        },
        {
          "@type": "Question",
          name: "How much does a men's haircut cost at Toni & Guy Whitefield?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Men's haircuts at Toni & Guy Hopefarm Whitefield start at ₹700. This includes a consultation, shampoo, precision cut, and blow-dry finish.",
          },
        },
        {
          "@type": "Question",
          name: "Which men's haircut suits Indian face shapes?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "For oval faces, almost any style works — textured crop and quiff are most flattering. For round faces, a low fade with volume on top creates length. For square faces, textured crops with softer edges work best. For long faces, side parts with mid-length styles balance the proportions.",
          },
        },
      ],
    },
  ],
};

export default function MensHaircutStyles2025() {
  return (
    <main className="min-h-screen bg-salon-black px-5 pb-24 pt-28 md:px-8 md:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Link href="/blog" className="text-xs uppercase tracking-widest text-salon-gold hover:underline">← All Articles</Link>
        </div>
        <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">Men&apos;s Hair Guide</p>
        <h1 className="prose-salon mt-4 font-display text-5xl leading-tight md:text-6xl text-white">
          Popular Men&apos;s Haircut Styles India 2025
        </h1>
        <p className="mt-4 text-sm text-white/40">By Toni &amp; Guy Hopefarm, Whitefield · June 2025</p>

        <div className="prose-salon mt-10 space-y-6 text-white/70 leading-8">
          <p>
            Men&apos;s hair in India has shifted significantly over the past two years. The trend is clear: away from the generic &quot;short back and sides&quot; and toward cuts that are intentional, textured, and actually styled. Here&apos;s a breakdown of the men&apos;s haircut styles trending in India in 2025 — and the ones that make practical sense for Indian hair texture.
          </p>

          <h2 className="font-display text-3xl text-white mt-10">The Top Men&apos;s Haircut Styles in India for 2025</h2>

          <h3 className="text-xl font-semibold text-white mt-6">1. Textured Crop</h3>
          <p>
            The textured crop is the most requested men&apos;s cut at our Whitefield salon right now. The defining feature is a fringe that sits horizontally across the forehead with textured, choppy ends rather than a clean, blunt line. The sides are faded or tapered, and the top is cut to create movement and separation.
          </p>
          <p>
            Why it works for Indian hair: Indian hair tends to be thick and grows straight or with a slight wave. The textured crop uses that weight as an asset — the fringe stays in place without product, and the texture adds visual interest without fighting the natural grain of the hair.
          </p>

          <h3 className="text-xl font-semibold text-white mt-6">2. Low Fade with Side Part</h3>
          <p>
            The low fade has been popular for several years but continues to be one of the top requests in 2025. The fade starts low (just above the ear) and gradually tapers down to the neckline, while the top is kept longer with a clean side part. The look reads as professional for office settings while still looking intentional.
          </p>
          <p>
            The side part variant specifically works well for Indian men in corporate environments — it&apos;s polished without looking dated. Ask for a &quot;1.5 to 3 fade&quot; if you want a clean taper without the very high-contrast look of a skin fade.
          </p>

          <h3 className="text-xl font-semibold text-white mt-6">3. Curtain Bangs (Middle Part)</h3>
          <p>
            The middle-parted curtain fringe — popularised globally and now firmly mainstream in India — involves longer hair parted in the centre with the fringe falling naturally on both sides of the face. The sides are tapered or kept medium-length.
          </p>
          <p>
            This works particularly well for men with thicker Indian hair, because the weight of the hair helps the curtain fringe fall naturally without much styling. It suits oval and round face shapes most.
          </p>

          <h3 className="text-xl font-semibold text-white mt-6">4. Buzz Cut with Skin Fade</h3>
          <p>
            Low-maintenance and increasingly popular among younger professionals in the Whitefield tech belt. The top is cut to a short uniform length (guard 2–3), with the sides skin-faded. Takes under 20 minutes and requires zero styling effort at home. Particularly popular in summer months when Bangalore&apos;s heat makes shorter cuts more practical.
          </p>

          <h3 className="text-xl font-semibold text-white mt-6">5. Modern Quiff</h3>
          <p>
            The quiff — longer on top, pushed back and slightly upward, tapered or faded on the sides — remains a classic that&apos;s been updated for 2025. The modern version is less structured than the traditional quiff: the top is textured rather than slicked, and the fade is typically mid or low rather than high.
          </p>
          <p>
            Indian hair&apos;s natural thickness and density works in favour of the quiff — the hair holds the shape well without heavy product.
          </p>

          <h2 className="font-display text-3xl text-white mt-10">Which Men&apos;s Haircut Suits Your Face Shape?</h2>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 my-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left pb-3 text-white font-semibold">Face Shape</th>
                  <th className="text-left pb-3 text-white font-semibold">Recommended Cuts</th>
                  <th className="text-left pb-3 text-white font-semibold">Avoid</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Oval", "Anything — textured crop, quiff, curtain", "Nothing in particular"],
                  ["Round", "Low fade + volume on top, quiff", "Buzz cut (emphasises roundness)"],
                  ["Square", "Textured crop, curtain bangs", "Very short sides (over-emphasises jaw)"],
                  ["Long / oblong", "Side part, medium length top", "High volume quiff (adds height)"],
                  ["Heart (wide forehead)", "Curtain bangs, fringe", "Slicked-back (exposes width)"],
                ].map(([face, rec, avoid]) => (
                  <tr key={face} className="border-b border-white/5">
                    <td className="py-2.5 text-salon-gold">{face}</td>
                    <td className="py-2.5 text-white/70">{rec}</td>
                    <td className="py-2.5 text-white/40">{avoid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="font-display text-3xl text-white mt-10">Men&apos;s Haircut Pricing at Toni &amp; Guy Whitefield</h2>
          <p>Men&apos;s haircuts at Toni &amp; Guy Hopefarm, Whitefield start at ₹700. All cuts include a consultation, shampoo wash, precision cut, and blow-dry finish.</p>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 my-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left pb-3 text-white font-semibold">Service</th>
                  <th className="text-right pb-3 text-white font-semibold">Price</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Men's haircut", "₹700"],
                  ["Kids' haircut", "₹600"],
                  ["Men's haircut + beard trim", "Ask at salon"],
                ].map(([svc, price]) => (
                  <tr key={svc} className="border-b border-white/5">
                    <td className="py-2.5 text-white/70">{svc}</td>
                    <td className="py-2.5 text-salon-gold text-right">{price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="font-display text-3xl text-white mt-10">FAQs</h2>
          <div className="space-y-4 mt-4">
            {[
              { q: "What are the most popular men's haircut styles trending in India right now?", a: "Textured crop, low fade with side part, curtain bangs (middle part), buzz cut with skin fade, and the modern quiff are the dominant men's hair trends in India in 2025." },
              { q: "How often should I get a men's haircut?", a: "For faded cuts, every 3–4 weeks to maintain the clean lines. For longer styles like the curtain or quiff, every 6–8 weeks is sufficient." },
              { q: "Does Toni & Guy Whitefield do walk-ins for men's haircuts?", a: "Yes, walk-ins are welcome, but booking in advance via WhatsApp (+91 91872 00430) is recommended for weekend slots, which fill up quickly." },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-lg border border-white/8 bg-white/[0.02] p-5">
                <p className="font-semibold text-white">{q}</p>
                <p className="mt-2 text-sm text-white/55 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-salon-gold/30 bg-salon-gold/5 p-7">
            <p className="font-display text-2xl text-white">Book a Men&apos;s Haircut in Whitefield</p>
            <p className="mt-2 text-white/60 text-sm leading-relaxed">
              Toni &amp; Guy Hopefarm, Hopefarm Junction, Whitefield Bangalore. 5 minutes from ITPL. Open 9 AM–9 PM daily.
            </p>
            <div className="mt-5 flex flex-wrap gap-4">
              <a href="https://wa.me/919187200430?text=Hi, I'd like to book a men's haircut" target="_blank" rel="noopener noreferrer"
                className="rounded-full bg-salon-gold px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-salon-black">
                Book via WhatsApp — ₹700
              </a>
              <Link href="/services/haircut" className="text-sm text-white/50 hover:text-salon-gold self-center">All haircut prices →</Link>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 pt-6 border-t border-white/8 text-sm">
            <Link href="/blog/hair-colour-trends-india-2025" className="text-salon-gold hover:underline">Hair Colour Trends 2025 →</Link>
            <Link href="/services/haircut" className="text-salon-gold hover:underline">Haircut Pricing →</Link>
          </div>
        </div>
      </article>
    </main>
  );
}
