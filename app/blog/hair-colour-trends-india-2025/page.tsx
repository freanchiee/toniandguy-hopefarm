import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toniandguywhitefield.com";

export const metadata: Metadata = {
  title: "Hair Colour Trends India 2025 | Shades for Indian Skin Tones | Toni & Guy Whitefield",
  description:
    "Discover the most popular hair colour trends in India for 2025. Best shades for Indian skin tones, from chocolate browns to copper balayage — expert picks from Toni & Guy Whitefield Bangalore.",
  keywords: [
    "hair colour trends india 2025", "hair colour shades indian skin tones",
    "trending hair colours india", "best hair colour for dark indian hair",
    "hair colour without bleaching india", "copper hair colour indian skin",
    "hair colour whitefield bangalore", "toni and guy hair colour bangalore",
  ],
  alternates: { canonical: `${SITE_URL}/blog/hair-colour-trends-india-2025` },
  openGraph: {
    title: "Hair Colour Trends India 2025 — Best Shades for Indian Skin Tones",
    description: "From dimensional brunettes to copper balayage — the hair colour trends that actually work for Indian hair and skin in 2025.",
    url: `${SITE_URL}/blog/hair-colour-trends-india-2025`,
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Hair Colour Trends India 2025 — Best Shades for Indian Skin Tones",
  description: "The most popular hair colour trends in India for 2025, including shades that work without bleaching on dark Indian hair.",
  datePublished: "2025-06-01",
  dateModified: "2025-06-01",
  author: { "@type": "Organization", name: "Toni & Guy Hopefarm Whitefield" },
  publisher: {
    "@type": "Organization",
    name: "Toni & Guy Hopefarm",
    logo: { "@type": "ImageObject", url: `${SITE_URL}/images/og-image.jpg` },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/hair-colour-trends-india-2025` },
  "@graph": [
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Which hair colour shades are trending for Indian skin tones in 2025?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Chocolate brown, copper balayage, mahogany, and warm caramel highlights are the top trending shades for Indian skin tones in 2025. These work with the natural undertones of most Indian complexions without looking garish.",
          },
        },
        {
          "@type": "Question",
          name: "Which hair colour trends work for dark Indian hair without bleaching?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Mahogany, dark auburn, burgundy, and dark copper are the best options for adding colour to dark Indian hair without bleaching. These shades are rich enough to show on dark base hair under sunlight.",
          },
        },
        {
          "@type": "Question",
          name: "How do I choose a hair colour that suits my complexion?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The rule of thumb: warm complexions (yellow/golden undertones) look best with warm hair colours like copper, caramel, and honey. Cool complexions (pink/neutral undertones) suit ashier tones like chocolate, burgundy, and dark plum.",
          },
        },
      ],
    },
  ],
};

export default function HairColourTrends2025() {
  return (
    <main className="min-h-screen bg-salon-black px-5 pb-24 pt-28 md:px-8 md:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Link href="/blog" className="text-xs uppercase tracking-widest text-salon-gold hover:underline">← All Articles</Link>
        </div>
        <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">Hair Colour Guide</p>
        <h1 className="prose-salon mt-4 font-display text-5xl leading-tight md:text-6xl text-white">
          Hair Colour Trends India 2025 — Best Shades for Indian Skin Tones
        </h1>
        <p className="mt-4 text-sm text-white/40">By Toni &amp; Guy Hopefarm, Whitefield · June 2025</p>

        <div className="prose-salon mt-10 space-y-6 text-white/70 leading-8">
          <p>
            Every year brings a new wave of hair colour trends, but not all of them translate well to Indian hair and skin. A shade that looks stunning on a fair European complexion can look muddy or washed-out on a deeper Indian skin tone — and the reverse is equally true. Here&apos;s what&apos;s actually trending in India in 2025 and, more importantly, which shades will actually look good on you.
          </p>

          <h2 className="font-display text-3xl text-white mt-10">The Top Hair Colour Trends in India for 2025</h2>

          <h3 className="text-xl font-semibold text-white mt-6">1. Dimensional Chocolate Brown</h3>
          <p>
            The biggest shift in Indian hair colour this year is the move away from flat, one-dimensional colour. Dimensional chocolate brown — a blend of dark brown base with lighter milk chocolate or caramel highlights woven through — creates depth and movement that flat colour simply cannot. It works especially well on medium-length hair and below the shoulder cuts.
          </p>
          <p>
            This trend is ideal for first-time colour clients because it&apos;s low-maintenance: as it grows out, the difference between roots and the coloured sections is minimal. At Toni &amp; Guy Whitefield, we achieve this with hand-painted balayage over a dark brown base, then toning to ensure the lighter sections stay warm rather than brassy.
          </p>

          <h3 className="text-xl font-semibold text-white mt-6">2. Copper Balayage</h3>
          <p>
            Copper is arguably the breakout colour of 2025 for Indian clients. Unlike blonde, copper sits within the warm spectrum that complements the yellow and golden undertones common in Indian skin. It works on medium-brown to dark-brown natural hair without needing to go platinum first.
          </p>
          <p>
            The key is the right shade of copper: burnt copper and auburn copper look far more natural on Indian skin than bright, orange-forward copper. Ask for a &quot;dark copper balayage&quot; if you&apos;re starting from a dark base — it adds warmth without crossing into territory that looks artificial.
          </p>

          <h3 className="text-xl font-semibold text-white mt-6">3. Mahogany and Dark Auburn</h3>
          <p>
            For anyone who wants visible colour without bleaching, mahogany and dark auburn are the answer. These are red-brown hybrids that show up beautifully on dark Indian hair under natural light, but look close to natural black indoors. They&apos;re particularly popular with clients who want a significant change but don&apos;t want coworkers commenting on their hair every day.
          </p>

          <h3 className="text-xl font-semibold text-white mt-6">4. Warm Caramel Highlights</h3>
          <p>
            Caramel highlights placed around the face — what stylists call &quot;face framing&quot; — are consistently one of the most requested looks at our Whitefield salon. The technique is simple: lighter caramel panels are applied to the hair framing the face, while the rest of the hair stays closer to natural. The result brightens the complexion and creates a sun-kissed effect that reads as effortless rather than dyed.
          </p>

          <h3 className="text-xl font-semibold text-white mt-6">5. Dark Plum and Burgundy</h3>
          <p>
            If warm tones aren&apos;t your preference, dark plum and burgundy are having a major moment in India right now. These cool-leaning reds complement Indian complexions with pinker or more neutral undertones. They show up as a deep wine colour in most lighting and reveal a more vivid plum in direct sunlight. No bleaching required on medium-dark Indian hair.
          </p>

          <h2 className="font-display text-3xl text-white mt-10">How to Choose the Right Shade for Your Complexion</h2>
          <p>
            The most important factor in choosing a hair colour is your undertone, not your skin lightness or darkness.
          </p>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 my-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left pb-3 text-white font-semibold">Undertone</th>
                  <th className="text-left pb-3 text-white font-semibold">How to identify</th>
                  <th className="text-left pb-3 text-white font-semibold">Best hair shades</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                {[
                  ["Warm (golden/yellow)", "Veins look greenish; gold jewellery suits you", "Copper, caramel, honey, warm brown"],
                  ["Cool (pink/blue)", "Veins look purple/blue; silver jewellery suits you", "Ash brown, burgundy, dark plum, chocolate"],
                  ["Neutral", "Both vein colours; most metals suit you", "Almost anything — dimensional brunette is safest"],
                ].map(([tone, id, shade]) => (
                  <tr key={tone} className="border-b border-white/5">
                    <td className="py-2.5 text-salon-gold">{tone}</td>
                    <td className="py-2.5 text-white/50">{id}</td>
                    <td className="py-2.5 text-white/70">{shade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="font-display text-3xl text-white mt-10">Hair Colour Without Bleaching: What&apos;s Possible?</h2>
          <p>
            One of the most common questions we get at our Whitefield salon is: &quot;Which hair colour trends work for dark Indian hair without bleaching?&quot;
          </p>
          <p>
            The honest answer: any shade in the warm brown, auburn, mahogany, burgundy, or dark copper family will show up on naturally dark hair without bleaching. These colours deposit pigment on top of your natural melanin and are visible especially in direct sunlight.
          </p>
          <p>
            Lighter shades — honey blonde, bright copper, platinum highlights — require some lifting (lightening) of the hair first. We use professional-grade products that minimise damage, and for clients with virgin dark hair, we often recommend a phased approach: colour in the first session, highlights in a follow-up session, rather than doing everything at once.
          </p>

          <h2 className="font-display text-3xl text-white mt-10">Hair Colour FAQs</h2>
          <div className="space-y-4 mt-4">
            {[
              {
                q: "Which hair colour shades are trending for Indian skin tones in 2025?",
                a: "Chocolate brown with caramel balayage, copper auburn, dark mahogany, and warm burgundy are the biggest trends for Indian skin tones this year. All of these work with the warm undertones most common in Indian complexions.",
              },
              {
                q: "How long does hair colour last?",
                a: "Permanent colour lasts 6–8 weeks before roots become noticeable. Semi-permanent lasts 4–6 washes. Balayage and highlights last significantly longer — 3–4 months before a touch-up — because the technique avoids the root zone.",
              },
              {
                q: "Which hair colour trends work for dark Indian hair without bleaching?",
                a: "Mahogany, dark auburn, burgundy, and dark copper are the best no-bleach options. They&apos;re rich enough to show on dark base hair in sunlight without requiring any lightening first.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-lg border border-white/8 bg-white/[0.02] p-5">
                <p className="font-semibold text-white">{q}</p>
                <p className="mt-2 text-sm text-white/55 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-salon-gold/30 bg-salon-gold/5 p-7">
            <p className="font-display text-2xl text-white">Ready to try a new colour?</p>
            <p className="mt-2 text-white/60 text-sm leading-relaxed">
              Visit Toni &amp; Guy Hopefarm at Hopefarm Junction, Whitefield. Our colour specialists will assess your natural hair and recommend the right technique and shade for your skin tone before anything is mixed.
            </p>
            <div className="mt-5 flex flex-wrap gap-4">
              <a href="https://wa.me/919187200430?text=Hi, I'd like to book a hair colour consultation" target="_blank" rel="noopener noreferrer"
                className="rounded-full bg-salon-gold px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-salon-black">
                Book Colour Consultation
              </a>
              <Link href="/services/hair-colour" className="text-sm text-white/50 hover:text-salon-gold self-center">View colour pricing →</Link>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 pt-6 border-t border-white/8 text-sm">
            <Link href="/blog/best-balayage-salon-whitefield-bangalore" className="text-salon-gold hover:underline">Balayage vs Highlights Guide →</Link>
            <Link href="/blog/keratin-treatment-whitefield-guide" className="text-salon-gold hover:underline">Keratin Treatment Guide →</Link>
            <Link href="/services/hair-colour" className="text-salon-gold hover:underline">Hair Colour Pricing →</Link>
          </div>
        </div>
      </article>
    </main>
  );
}
