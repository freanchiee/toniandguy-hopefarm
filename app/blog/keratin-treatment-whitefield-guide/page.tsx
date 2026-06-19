import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { BookNowButton } from "@/components/BookingModal";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toniandguy-hopefarm.vercel.app";

export const metadata: Metadata = {
  title: "Keratin Treatment Whitefield Bangalore 2025 Guide | Toni & Guy",
  description:
    "Complete guide to keratin treatments near Whitefield Bangalore. Brazilian keratin vs Nanoplastia vs protein smoothening — prices, what to expect, how long results last. Toni & Guy Hopefarm.",
  keywords: [
    "keratin treatment whitefield bangalore guide", "keratin treatment bangalore 2025",
    "nanoplastia vs keratin whitefield", "best keratin treatment near ITPL",
    "hair smoothening whitefield price", "keratin treatment how long does it last bangalore",
  ],
  alternates: { canonical: `${SITE_URL}/blog/keratin-treatment-whitefield-guide` },
  openGraph: {
    title: "Keratin Treatment Whitefield Bangalore — Complete 2025 Guide",
    description: "Brazilian keratin, Nanoplastia or protein smoothening? Everything you need to know, with prices and where to go in Whitefield.",
    url: `${SITE_URL}/blog/keratin-treatment-whitefield-guide`,
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How long does keratin treatment last in Bangalore's humidity?", acceptedAnswer: { "@type": "Answer", text: "Brazilian keratin typically lasts 3–4 months in Bangalore's humidity. Nanoplastia lasts 4–6 months as it uses amino acids rather than formaldehyde, making it more stable in humid conditions." } },
    { "@type": "Question", name: "Can I get keratin treatment on coloured hair?", acceptedAnswer: { "@type": "Answer", text: "Yes. Nanoplastia and protein smoothening are safer for colour-treated hair. Brazilian keratin can slightly lift colour tone — your stylist will advise at consultation." } },
    { "@type": "Question", name: "What is the price of keratin treatment in Whitefield Bangalore?", acceptedAnswer: { "@type": "Answer", text: "At Toni & Guy Hopefarm Whitefield, keratin treatments start from ₹1,800 for short hair, ₹2,500 for medium, and ₹3,500+ for long hair. Nanoplastia starts from ₹3,000." } },
  ],
};

export default function KeratinBlogPage() {
  return (
    <main className="min-h-screen bg-salon-black px-5 pb-24 pt-28 text-white md:px-8 md:pt-36">
      <Script id="schema-blog-keratin" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="mx-auto max-w-2xl">
        <nav className="mb-8 flex items-center gap-2 text-xs uppercase tracking-widest text-white/40">
          <Link href="/" className="hover:text-salon-gold">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-salon-gold">Blog</Link>
          <span>/</span>
          <span className="text-salon-gold">Keratin Guide</span>
        </nav>

        <p className="text-xs text-white/40">June 2025 · 6 min read</p>
        <h1 className="mt-3 font-display text-4xl font-black leading-tight uppercase md:text-6xl">
          Keratin Treatment in Whitefield — Complete 2025 Guide
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-white/70">
          Bangalore&apos;s humidity is brutal on hair — especially in Whitefield and east Bangalore where monsoon
          frizz can undo hours of styling in minutes. Keratin treatment is the most effective long-term solution.
          Here&apos;s everything you need to know before booking.
        </p>

        <hr className="my-10 border-white/10" />

        <section className="prose-salon">
          <h2>What is Keratin Treatment?</h2>
          <p>
            Keratin treatment is a professional hair smoothening procedure that coats each hair strand with a keratin
            protein layer, sealing the cuticle and eliminating frizz. The result: smoother, shinier, more manageable hair
            for 3–6 months — even through Bangalore&apos;s rainy season.
          </p>
          <p>
            There are three main types available in Whitefield salons, and the difference matters:
          </p>

          <h2>Brazilian Keratin vs Nanoplastia vs Protein Smoothening</h2>
          <div className="not-prose mt-4 space-y-4">
            {[
              { name: "Brazilian Keratin", duration: "3–4 months", best: "Thick, frizzy, or coarse hair", note: "Contains low levels of formaldehyde. Salon must be well-ventilated. Not recommended for pregnant women.", price: "From ₹1,800" },
              { name: "Nanoplastia", duration: "4–6 months", best: "Damaged, chemically treated, or fine hair", note: "Organic formula using amino acids. No harsh chemicals. Safe for colour-treated hair. Increasingly popular in Whitefield.", price: "From ₹3,000" },
              { name: "Protein Smoothening", duration: "2–3 months", best: "Colour-treated, over-processed, or brittle hair", note: "Deep protein treatment that fills in hair porosity. No harsh chemicals — best for hair health, volume and shine.", price: "From ₹2,800" },
            ].map(t => (
              <div key={t.name} className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
                <div className="flex items-start justify-between gap-4">
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="shrink-0 text-sm font-semibold text-salon-gold">{t.price}</p>
                </div>
                <div className="mt-2 flex flex-wrap gap-3">
                  <span className="text-xs text-white/50">⏱ {t.duration}</span>
                  <span className="text-xs text-white/50">✓ Best for: {t.best}</span>
                </div>
                <p className="mt-2 text-xs text-white/50 leading-relaxed">{t.note}</p>
              </div>
            ))}
          </div>

          <h2>How Long Does Keratin Last in Bangalore&apos;s Humidity?</h2>
          <p>
            Bangalore&apos;s humidity (especially June–October) is tougher on keratin treatments than drier climates.
            As a general rule:
          </p>
          <ul>
            <li><strong>Brazilian keratin:</strong> 3–4 months in Bangalore (vs 4–6 months in dry climates)</li>
            <li><strong>Nanoplastia:</strong> 4–6 months — more resistant to humidity due to the amino acid structure</li>
            <li><strong>Protein Smoothening:</strong> 2–3 months — primarily a conditioning treatment, not a structural change</li>
          </ul>
          <p>
            To maximize longevity: use a sulphate-free shampoo, avoid salt water, and wait 48–72 hours before
            washing after the treatment.
          </p>

          <h2>Frequently Asked Questions</h2>
          <div className="not-prose mt-4 space-y-3">
            {[
              { q: "How long does keratin treatment last in Bangalore's humidity?", a: "Brazilian keratin lasts 3–4 months. Nanoplastia lasts 4–6 months — it's more humidity-resistant." },
              { q: "Can I get keratin on coloured hair?", a: "Yes. Nanoplastia and protein smoothening are safest for colour-treated hair. Brazilian keratin may slightly affect tone — your stylist will advise." },
              { q: "What is the price of keratin treatment in Whitefield?", a: "At Toni & Guy Hopefarm: from ₹1,800 (short), ₹2,500 (medium), ₹3,500+ (long). Nanoplastia from ₹3,000." },
              { q: "How long does the appointment take?", a: "Brazilian keratin: 2–3 hours. Nanoplastia: 2–4 hours depending on hair length. Protein Smoothening: 1.5–2 hours." },
            ].map(f => (
              <div key={f.q} className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                <p className="font-semibold text-white text-sm">{f.q}</p>
                <p className="mt-1 text-sm text-white/60">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-14 rounded-2xl border border-salon-gold/30 bg-salon-gold/5 p-8 text-center">
          <p className="font-display text-2xl uppercase text-white">Book Keratin Treatment</p>
          <p className="mt-2 text-sm text-white/60">Toni &amp; Guy Hopefarm · Whitefield · 9 AM–9 PM</p>
          <BookNowButton className="mt-5 rounded-full bg-salon-gold px-7 py-3 text-sm font-bold uppercase tracking-[0.14em] text-salon-black" />
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/services/keratin-treatment" className="text-xs text-white/40 hover:text-salon-gold">Keratin Treatment service page →</Link>
          <Link href="/blog" className="text-xs text-white/40 hover:text-salon-gold">← All articles</Link>
        </div>
      </article>
    </main>
  );
}
