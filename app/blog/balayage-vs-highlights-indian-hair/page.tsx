import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toniandguywhitefield.com";

export const metadata: Metadata = {
  title: "Balayage vs Highlights for Indian Hair — Which is Better? | Toni & Guy Whitefield",
  description:
    "Balayage or highlights — which is better for Indian hair? Honest comparison of techniques, cost, maintenance, and results for dark Indian hair. Expert guide from Toni & Guy Whitefield Bangalore.",
  keywords: [
    "balayage vs highlights indian hair", "which is better balayage or highlights india",
    "balayage for dark indian hair", "highlights vs balayage bangalore",
    "balayage whitefield bangalore", "hair highlights whitefield",
    "difference balayage traditional highlights", "indian hair colour techniques",
  ],
  alternates: { canonical: `${SITE_URL}/blog/balayage-vs-highlights-indian-hair` },
  openGraph: {
    title: "Balayage vs Highlights for Indian Hair — Which is Better?",
    description: "The complete honest guide to choosing between balayage and traditional highlights for Indian hair — maintenance, cost, and what actually looks better.",
    url: `${SITE_URL}/blog/balayage-vs-highlights-indian-hair`,
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Balayage vs Highlights for Indian Hair — Which is Better?",
  description: "Balayage or highlights for Indian hair? Honest comparison of techniques, maintenance, cost, and results.",
  datePublished: "2025-06-01",
  dateModified: "2025-06-01",
  author: { "@type": "Organization", name: "Toni & Guy Hopefarm Whitefield" },
  publisher: { "@type": "Organization", name: "Toni & Guy Hopefarm" },
  mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/balayage-vs-highlights-indian-hair` },
  "@graph": [
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Which is better for Indian hair, balayage or highlights?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "For most Indian hair types, balayage gives more natural-looking results with less maintenance. Traditional highlights create a more uniform, structured look that requires touch-ups every 6–8 weeks. Balayage suits natural-looking, low-maintenance colour; highlights suit defined, high-contrast looks.",
          },
        },
        {
          "@type": "Question",
          name: "What is the difference between balayage and traditional highlights?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Balayage is a freehand painting technique applied directly to the hair surface — no foils. The colour is concentrated at the ends and fades gradually toward the root, mimicking how hair lightens naturally in the sun. Traditional highlights use foils to lift colour from root to tip in uniform sections, creating a more structured look.",
          },
        },
        {
          "@type": "Question",
          name: "Does balayage work on dark Indian hair?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, balayage works on dark Indian hair, but the degree of lift achievable in one session is limited. On very dark hair, a first session will typically achieve a warm copper or caramel result rather than blonde. Multiple sessions can achieve lighter results progressively while maintaining hair health.",
          },
        },
      ],
    },
  ],
};

export default function BalayageVsHighlights() {
  return (
    <main className="min-h-screen bg-salon-black px-5 pb-24 pt-28 md:px-8 md:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Link href="/blog" className="text-xs uppercase tracking-widest text-salon-gold hover:underline">← All Articles</Link>
        </div>
        <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">Balayage Guide</p>
        <h1 className="prose-salon mt-4 font-display text-5xl leading-tight md:text-6xl text-white">
          Balayage vs Highlights for Indian Hair — Which is Better?
        </h1>
        <p className="mt-4 text-sm text-white/40">By Toni &amp; Guy Hopefarm, Whitefield · June 2025</p>

        <div className="prose-salon mt-10 space-y-6 text-white/70 leading-8">
          <p>
            Balayage and traditional highlights are the two most requested colour services at our Whitefield salon — and &quot;which one should I get?&quot; is the question we answer most often during consultations. The honest answer depends on your hair type, maintenance expectations, and the look you want. Here&apos;s the complete breakdown.
          </p>

          <h2 className="font-display text-3xl text-white mt-10">What is the Difference Between Balayage and Traditional Highlights?</h2>

          <h3 className="text-xl font-semibold text-white mt-6">Balayage</h3>
          <p>
            Balayage is a freehand painting technique. The colourist applies lightener directly to sections of hair using a brush, without foils, concentrating colour toward the mid-lengths and ends. The result mimics how hair naturally lightens in the sun — darker at the roots, gradually lighter toward the tips, with a soft, blended transition.
          </p>
          <p>
            Because balayage doesn&apos;t touch the root zone (or touches it very lightly), the grow-out is invisible for several months. There&apos;s no harsh root line — the new growth simply blends into the painted sections.
          </p>

          <h3 className="text-xl font-semibold text-white mt-6">Traditional Highlights</h3>
          <p>
            Traditional highlights use foils to isolate sections of hair and lift them from root to tip in a uniform pattern. The result is a structured, high-contrast look — clearly defined lighter sections throughout the hair.
          </p>
          <p>
            Because highlights cover the root, a visible root line appears as the hair grows — typically after 6–8 weeks. Touch-ups are needed regularly to maintain the look.
          </p>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 my-6">
            <p className="text-white font-semibold mb-4">Quick Comparison</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left pb-3 text-white/60 font-medium">Factor</th>
                  <th className="text-left pb-3 text-salon-gold font-medium">Balayage</th>
                  <th className="text-left pb-3 text-white font-medium">Highlights</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Technique", "Freehand brush (no foils)", "Foil sections, root to tip"],
                  ["Result", "Natural, sun-kissed, blended", "Defined, uniform, structured"],
                  ["Root visibility", "Grows out seamlessly", "Root line visible at 6–8 weeks"],
                  ["Touch-up frequency", "Every 3–4 months", "Every 6–8 weeks"],
                  ["Price at T&G Whitefield", "From ₹3,500", "Partial from ₹2,500 / Full ₹4,000+"],
                  ["Best for", "Low maintenance, natural look", "High contrast, defined look"],
                  ["Session time", "2.5–3.5 hours", "1.5–2.5 hours"],
                ].map(([factor, bal, hi]) => (
                  <tr key={factor} className="border-b border-white/5">
                    <td className="py-2.5 text-white/50">{factor}</td>
                    <td className="py-2.5 text-salon-gold">{bal}</td>
                    <td className="py-2.5 text-white/70">{hi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="font-display text-3xl text-white mt-10">Which is Better for Indian Hair Specifically?</h2>
          <p>
            Indian hair has two characteristics that affect how both techniques work:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-white">High melanin density</strong> — dark Indian hair requires more lifting to achieve lighter shades. This means balayage on very dark hair typically reaches a warm copper or caramel result in the first session, not blonde.</li>
            <li><strong className="text-white">Often finer texture with high density</strong> — lots of individual hair strands packed together. This actually makes balayage look better, because the painted sections are visible against a dense base.</li>
          </ul>

          <h3 className="text-xl font-semibold text-white mt-6">For Natural-Looking Results: Balayage Wins</h3>
          <p>
            For Indian clients who want colour that looks like it could be natural — sun-lightened ends, warmth through the mid-lengths — balayage consistently produces better results. The blended grow-out also means you&apos;re not constantly maintaining it.
          </p>

          <h3 className="text-xl font-semibold text-white mt-6">For High-Contrast, Defined Colour: Highlights Win</h3>
          <p>
            If you want clearly defined lighter sections throughout your hair — the classic highlighted look — traditional foil highlights deliver that better than balayage. They&apos;re also slightly cheaper for partial applications and take less time in the chair.
          </p>

          <h2 className="font-display text-3xl text-white mt-10">Does Balayage Work on Dark Indian Hair?</h2>
          <p>
            Yes, but with realistic expectations. On very dark (level 2–3) natural Indian hair, a single balayage session will typically lift to a warm copper, auburn, or dark caramel. This is actually a beautiful result — and it avoids the brassiness that often comes from over-lightening dark hair in one go.
          </p>
          <p>
            If you want a lighter result (honey blonde, ash), plan for two or three sessions spaced 6–8 weeks apart. This staged approach keeps the hair healthy and allows for better, more even lightening over time.
          </p>

          <h2 className="font-display text-3xl text-white mt-10">FAQs</h2>
          <div className="space-y-4 mt-4">
            {[
              { q: "Which is better for Indian hair, balayage or highlights?", a: "For most Indian hair types, balayage gives more natural-looking results with less maintenance. Highlights suit clients who want a more defined, uniform look and don't mind 6-weekly touch-ups." },
              { q: "How long does balayage last on Indian hair?", a: "Balayage typically lasts 3–4 months before a refresh is needed, because the technique avoids the root zone. The grow-out looks intentional rather than neglected." },
              { q: "Which is more expensive, balayage or highlights?", a: "Full balayage is typically more expensive than partial highlights because it takes longer and requires more product. At Toni & Guy Whitefield, balayage starts at ₹3,500 and partial highlights at ₹2,500." },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-lg border border-white/8 bg-white/[0.02] p-5">
                <p className="font-semibold text-white">{q}</p>
                <p className="mt-2 text-sm text-white/55 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-salon-gold/30 bg-salon-gold/5 p-7">
            <p className="font-display text-2xl text-white">Book a Balayage or Highlights Consultation</p>
            <p className="mt-2 text-white/60 text-sm leading-relaxed">
              Toni &amp; Guy Hopefarm, Whitefield. Our colour specialists will look at your natural hair and recommend balayage vs highlights based on your specific texture, base colour, and maintenance preference.
            </p>
            <div className="mt-5 flex flex-wrap gap-4">
              <a href="https://wa.me/919187200430?text=Hi, I'd like to book a balayage consultation" target="_blank" rel="noopener noreferrer"
                className="rounded-full bg-salon-gold px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-salon-black">
                Book via WhatsApp
              </a>
              <Link href="/services/balayage" className="text-sm text-white/50 hover:text-salon-gold self-center">View balayage pricing →</Link>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 pt-6 border-t border-white/8 text-sm">
            <Link href="/blog/hair-colour-trends-india-2025" className="text-salon-gold hover:underline">Hair Colour Trends India 2025 →</Link>
            <Link href="/blog/best-balayage-salon-whitefield-bangalore" className="text-salon-gold hover:underline">Best Balayage Salon Whitefield →</Link>
            <Link href="/services/balayage" className="text-salon-gold hover:underline">Balayage Pricing →</Link>
          </div>
        </div>
      </article>
    </main>
  );
}
