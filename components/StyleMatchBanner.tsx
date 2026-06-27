import Link from "next/link";
import { Sparkles, Camera, ArrowRight } from "lucide-react";

// Homepage promo for the AI Style Match tool — drives traffic to /face-analysis
export function StyleMatchBanner() {
  return (
    <section className="reveal-section bg-salon-black py-16 md:py-24">
      <div className="section-shell">
        <div className="relative overflow-hidden rounded-3xl border border-salon-gold/30 bg-gradient-to-br from-salon-gold/10 via-salon-black to-salon-black p-8 md:p-14">
          {/* glow accent */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-salon-gold/10 blur-3xl" />

          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-salon-gold">
                <Sparkles className="h-3.5 w-3.5" /> New · AI Style Match
              </p>
              <h2 className="mt-4 font-display text-4xl leading-none md:text-6xl">
                Not sure what suits you?
              </h2>
              <p className="mt-4 text-base leading-7 text-salon-smoke">
                Upload a selfie and our AI reads your face shape to suggest the
                three haircuts that suit you best — for men and women. Free, instant,
                and your photo is <span className="text-white">never stored</span>.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Link
                  href="/face-analysis"
                  className="group flex items-center gap-2 rounded-full bg-salon-gold px-7 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-salon-black transition hover:brightness-110"
                >
                  <Camera className="h-4 w-4" /> Try AI Style Match
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
                <span className="text-xs text-white/40">Takes under a minute</span>
              </div>
            </div>

            {/* Steps */}
            <div className="flex shrink-0 gap-4 md:flex-col md:gap-3">
              {[
                { n: "1", label: "Upload a selfie" },
                { n: "2", label: "Get your face shape" },
                { n: "3", label: "See your top 3 cuts" },
              ].map((s) => (
                <div key={s.n} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-salon-gold/15 text-sm font-bold text-salon-gold">
                    {s.n}
                  </span>
                  <span className="text-sm text-white/70">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
