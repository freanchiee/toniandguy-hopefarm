import type { Metadata } from "next";
import Link from "next/link";
import { StyleMatchCta } from "@/components/StyleMatchCta";
import { FACE_SHAPES, SHAPE_BLURB, getRecommendations, getAvoid } from "@/lib/face-analysis";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toniandguy-hopefarm.vercel.app";
const URL = `${SITE_URL}/blog/best-haircut-for-your-face-shape`;

export const metadata: Metadata = {
  title: "Best Haircut for Your Face Shape (Men & Women) | Toni & Guy Whitefield",
  description:
    "How to find your face shape and choose the haircut that suits it — oval, round, square, heart, oblong, diamond and triangle, for men and women. Plus a free AI Style Match tool from Toni & Guy Hopefarm, Whitefield.",
  keywords: [
    "best haircut for face shape", "haircut for round face", "haircut for square face",
    "how to find my face shape", "ai haircut finder", "hairstyle for my face shape india",
    "face shape haircut bangalore", "toni and guy whitefield",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "Best Haircut for Your Face Shape | Toni & Guy Whitefield",
    description: "Find your face shape and the cuts that flatter it — or let our free AI Style Match do it from a selfie.",
    url: URL,
    type: "article",
  },
};

const FAQS = [
  {
    q: "How do I find my face shape?",
    a: "Pull your hair back and look straight at a mirror. Compare the width of your forehead, cheekbones and jaw, and the overall length against width. Wider forehead tapering to a narrow chin is heart; widest at the cheekbones is diamond; similar width and length with soft curves is round; strong angular jaw is square; longer than wide is oblong; wider jaw than forehead is triangle; balanced proportions with a gently rounded jaw is oval.",
  },
  {
    q: "Is there a free tool to find the best haircut for my face shape?",
    a: "Yes. Toni & Guy Hopefarm's free AI Style Match reads your face shape from a selfie and suggests the three haircuts that suit you best, for men and women. Your photo is never stored.",
  },
  {
    q: "Does face shape matter more than hair type?",
    a: "Both matter. Face shape decides which lengths and fringes balance your features; hair texture and density decide whether a cut will sit the way you want. A stylist at the salon will check both during your consultation.",
  },
  {
    q: "Can I book the haircut the tool suggests?",
    a: "Yes. After the AI Style Match you can book the suggested cut directly, online or on WhatsApp at +91 91872 00430. Men's haircuts at Toni & Guy Hopefarm start from ₹800.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Best Haircut for Your Face Shape (Men & Women)",
      description: "How to find your face shape and choose the haircut that suits it, with a free AI Style Match tool.",
      datePublished: "2026-10-09",
      dateModified: "2026-10-09",
      author: { "@type": "Organization", name: "Toni & Guy Hopefarm Whitefield" },
      publisher: { "@type": "Organization", name: "Toni & Guy Hopefarm" },
      mainEntityOfPage: { "@type": "WebPage", "@id": URL },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function BestHaircutForFaceShape() {
  return (
    <main className="min-h-screen bg-salon-black px-5 pb-24 pt-28 md:px-8 md:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Link href="/blog" className="text-xs uppercase tracking-widest text-salon-gold hover:underline">← All Articles</Link>
        </div>
        <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">Style Guide</p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-white md:text-6xl">
          Best Haircut for Your Face Shape
        </h1>
        <p className="mt-4 text-sm text-white/40">By Toni &amp; Guy Hopefarm, Whitefield · October 2026 · 6 min read</p>

        <div className="mt-10 space-y-6 leading-8 text-white/70">
          <p>
            The right haircut doesn&apos;t fight your face — it balances it. Lengths, fringes and volume can make a face look
            more even, which is why the same cut looks great on one person and off on another. Here&apos;s how to work out
            your face shape and which cuts flatter each one, for men and women.
          </p>

          <StyleMatchCta source="blog-face-shape-top" title="Skip the guesswork — let AI find your face shape" />

          <h2 className="mt-10 font-display text-3xl text-white">How to find your face shape</h2>
          <ol className="list-decimal space-y-2 pl-6">
            <li>Pull your hair back and face a mirror straight on, relaxed.</li>
            <li>Compare the width of your <strong className="text-white">forehead</strong>, <strong className="text-white">cheekbones</strong> and <strong className="text-white">jaw</strong>.</li>
            <li>Compare your overall length with your width.</li>
            <li>Match it to the seven shapes below.</li>
          </ol>
          <p>
            Many faces sit between two shapes, which is normal. If you&apos;re unsure, the{" "}
            <Link href="/face-analysis?src=blog-face-shape-inline" className="text-salon-gold underline">free AI Style Match</Link>{" "}
            reads it from a selfie in under a minute.
          </p>

          <h2 className="mt-10 font-display text-3xl text-white">The 7 face shapes and the cuts that suit them</h2>

          {FACE_SHAPES.map((shape) => (
            <section key={shape} id={shape.toLowerCase()} className="rounded-xl border border-white/10 bg-white/[0.02] p-5 md:p-6">
              <h3 className="font-display text-2xl text-salon-gold">{shape} face</h3>
              <p className="mt-1 text-sm text-white/55">{SHAPE_BLURB[shape]}</p>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {(["Female", "Male"] as const).map((g) => (
                  <div key={g}>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                      {g === "Female" ? "For women" : "For men"}
                    </p>
                    <ul className="mt-2 space-y-2 text-sm">
                      {getRecommendations(g, shape).map((r) => (
                        <li key={r.cut}>
                          <span className="font-semibold text-white">{r.cut}</span>
                          <span className="text-white/55"> — {r.why}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-white/40">
                      <span className="text-white/60">Avoid:</span> {getAvoid(g, shape)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <StyleMatchCta source="blog-face-shape-mid" title="Think you know your shape? Check it in 30 seconds" compact />

          <h2 className="mt-10 font-display text-3xl text-white">Beyond face shape</h2>
          <p>
            Face shape is the starting point, not the whole answer. Hair texture, density, growth patterns and how much time
            you want to spend styling all change which cut works day to day. That&apos;s why every service at Toni &amp; Guy
            Hopefarm starts with a short consultation — bring your AI Style Match result and your stylist will adapt it to your hair.
          </p>

          <h2 className="mt-10 font-display text-3xl text-white">FAQs</h2>
          <div className="mt-4 space-y-4">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="rounded-lg border border-white/8 bg-white/[0.02] p-5">
                <p className="font-semibold text-white">{q}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{a}</p>
              </div>
            ))}
          </div>

          <StyleMatchCta source="blog-face-shape-bottom" title="Ready to find your best cut?" />

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <p className="font-display text-2xl text-white">Book at Toni &amp; Guy Hopefarm, Whitefield</p>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              Hopefarm Junction, Whitefield Bangalore. Open 9 AM–9 PM daily. Men&apos;s haircuts from ₹800.
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link href="/book" className="rounded-full bg-salon-gold px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-salon-black">
                Book online
              </Link>
              <Link href="/services/haircut" className="self-center text-sm text-white/50 hover:text-salon-gold">Haircut prices →</Link>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 border-t border-white/8 pt-6 text-sm">
            <Link href="/blog/mens-haircut-styles-india-2025" className="text-salon-gold hover:underline">Men&apos;s Haircut Styles 2025 →</Link>
            <Link href="/blog/hair-colour-trends-india-2025" className="text-salon-gold hover:underline">Hair Colour Trends 2025 →</Link>
          </div>
        </div>
      </article>
    </main>
  );
}
