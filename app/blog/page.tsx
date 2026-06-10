import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toniandguy-hopefarm.vercel.app";

export const metadata: Metadata = {
  title: "Hair Blog | Tips, Trends & Guides | Toni & Guy Hopefarm Whitefield",
  description:
    "Expert hair care tips, style guides, and salon advice from Toni & Guy Hopefarm Whitefield Bangalore. Balayage, keratin treatments, haircut trends & price guides for Bangalore customers.",
  alternates: { canonical: `${SITE_URL}/blog` },
};

const posts = [
  {
    slug: "best-balayage-salon-whitefield-bangalore",
    title: "Best Balayage Salons in Whitefield Bangalore (2025 Guide)",
    excerpt: "Looking for a balayage salon near Whitefield or ITPL? We break down what makes a great balayage, what to look for in a salon, and why Toni & Guy Hopefarm is the top choice in east Bangalore.",
    date: "June 2025",
    readTime: "5 min read",
  },
  {
    slug: "keratin-treatment-whitefield-guide",
    title: "Keratin Treatment in Whitefield Bangalore: Complete 2025 Guide",
    excerpt: "Brazilian keratin, Nanoplastia, or hair Botox — which is right for you? Prices, what to expect, and how to find the best keratin treatment salon near Whitefield.",
    date: "June 2025",
    readTime: "6 min read",
  },
  {
    slug: "toni-and-guy-whitefield-price-list-2025",
    title: "Toni & Guy Whitefield Price List 2025 — Complete Guide",
    excerpt: "Full price breakdown for all services at Toni & Guy Hopefarm Whitefield: haircuts, colour, keratin treatments, balayage, bridal styling and more. Plus how to get up to 35% off.",
    date: "June 2025",
    readTime: "4 min read",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-salon-black px-5 pb-24 pt-28 text-white md:px-8 md:pt-36">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">Hair Journal</p>
        <h1 className="mt-3 font-display text-5xl font-black leading-none uppercase md:text-7xl">Blog</h1>
        <p className="mt-5 text-lg text-white/60">Tips, trends & expert guides from the team at Toni &amp; Guy Hopefarm, Whitefield.</p>

        <div className="mt-14 space-y-6">
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`}
              className="group block rounded-2xl border border-white/8 bg-white/[0.02] p-6 transition hover:border-salon-gold/40 hover:bg-white/[0.04]">
              <p className="text-xs text-white/40">{p.date} · {p.readTime}</p>
              <h2 className="mt-2 text-xl font-semibold text-white group-hover:text-salon-gold transition">{p.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{p.excerpt}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-salon-gold">Read more →</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
