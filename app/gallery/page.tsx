import type { Metadata } from "next";
import { RevealProvider } from "@/components/RevealProvider";
import { GalleryGrid } from "@/components/GalleryGrid";
import { galleryImages } from "@/lib/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toniandguywhitefield.com";

export const metadata: Metadata = {
  title: "Hair Transformation Gallery | Toni & Guy Hopefarm Whitefield Bangalore",
  description:
    "Browse real hair transformations by Toni & Guy Hopefarm, Whitefield Bangalore. Haircuts, balayage, highlights, keratin treatments, and bridal styling — see the results for yourself.",
  keywords: [
    "toni and guy whitefield gallery", "hair transformation whitefield bangalore",
    "balayage results whitefield", "hair colour before after bangalore",
    "toni and guy hopefarm results", "salon whitefield bangalore gallery",
  ],
  alternates: { canonical: `${SITE_URL}/gallery` },
  openGraph: {
    title: "Hair Transformation Gallery | Toni & Guy Hopefarm Whitefield",
    description: "Real results from our Whitefield salon — haircuts, balayage, colour, keratin & bridal looks by the Toni & Guy Hopefarm team.",
    url: `${SITE_URL}/gallery`,
  },
};

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-salon-black px-5 pb-24 pt-28 md:px-8 md:pt-36">
      <RevealProvider>
        <section className="section-shell reveal-section">
          <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">Gallery</p>
          <h1 className="mt-4 max-w-5xl font-display text-6xl leading-none md:text-8xl">
            Real results from Whitefield&apos;s premier salon.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
            Every transformation you see here was done at Toni &amp; Guy Hopefarm, Whitefield.
            Our stylists are trained to international TONI&amp;GUY standards — from precision cuts
            and hand-painted balayage to full bridal looks and keratin smoothening. Browse the
            work, then book your own transformation online.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {["Haircuts", "Balayage", "Hair Colour", "Highlights", "Keratin", "Bridal"].map((tag) => (
              <span key={tag} className="rounded-full border border-white/15 px-4 py-1.5 text-xs uppercase tracking-widest text-white/50">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-16">
            <GalleryGrid images={galleryImages} />
          </div>

          <div className="mt-20 rounded-2xl border border-white/8 bg-white/[0.02] p-8 md:p-10">
            <p className="font-display text-3xl uppercase text-white md:text-4xl">
              Like what you see?
            </p>
            <p className="mt-3 max-w-xl text-white/55 leading-relaxed">
              Every look in this gallery started with a consultation. Our stylists at Hopefarm
              Junction, Whitefield will recommend the right technique for your hair type, lifestyle,
              and maintenance preference — before a single scissor or colour brush is picked up.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href="https://wa.me/919187200430?text=Hi, I saw your gallery and would like to book an appointment"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-salon-gold px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-salon-black"
              >
                Book via WhatsApp
              </a>
              <a href="tel:+919187200430" className="flex items-center gap-2 text-sm text-white/50 hover:text-salon-gold transition">
                +91 91872 00430
              </a>
            </div>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { stat: "808+", label: "Google Reviews", sub: "4.5★ average rating" },
              { stat: "9 AM–9 PM", label: "Open Daily", sub: "Monday through Sunday" },
              { stat: "5 min", label: "From ITPL", sub: "Hopefarm Junction, Whitefield" },
            ].map((s) => (
              <div key={s.stat} className="rounded-xl border border-white/8 bg-white/[0.02] p-5 text-center">
                <p className="font-display text-3xl uppercase text-salon-gold">{s.stat}</p>
                <p className="mt-1 text-sm font-semibold text-white">{s.label}</p>
                <p className="mt-0.5 text-xs text-white/40">{s.sub}</p>
              </div>
            ))}
          </div>
        </section>
      </RevealProvider>
    </main>
  );
}
