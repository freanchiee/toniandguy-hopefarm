import Link from "next/link";
import { Camera, Sparkles, ArrowRight } from "lucide-react";

// Reusable promo for the AI Style Match tool. `source` is appended as ?src= so
// clicks can be attributed per placement in Vercel Analytics / server logs.
export function StyleMatchCta({
  source,
  title = "Not sure which cut suits your face?",
  compact = false,
}: {
  source: string;
  title?: string;
  compact?: boolean;
}) {
  return (
    <div className="not-prose my-10 rounded-2xl border border-salon-gold/30 bg-gradient-to-br from-salon-gold/10 via-salon-black to-salon-black p-6 md:p-8">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-salon-gold">
        <Sparkles className="h-3.5 w-3.5" /> Free · AI Style Match
      </p>
      <p className="mt-3 font-display text-2xl leading-tight text-white md:text-3xl">{title}</p>
      {!compact && (
        <p className="mt-2 text-sm leading-relaxed text-white/60">
          Upload a selfie and our AI reads your face shape and picks the 3 haircuts that suit you best.
          Takes under a minute, and your photo is never stored.
        </p>
      )}
      <Link
        href={`/face-analysis?src=${encodeURIComponent(source)}`}
        className="group mt-5 inline-flex items-center gap-2 rounded-full bg-salon-gold px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-salon-black transition hover:brightness-110"
      >
        <Camera className="h-4 w-4" /> Try AI Style Match
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
