import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toniandguy-hopefarm.vercel.app";
const PAGE_URL = `${SITE_URL}/blog/hair-spa-vs-keratin-vs-botox-vs-nanoplastia`;

export const metadata: Metadata = {
  title: "Hair Spa vs Keratin vs Hair Botox vs Nanoplastia — Which One? | Toni & Guy Whitefield",
  description:
    "Hair spa, keratin, hair botox (Botoliss) and Nanoplastia compared side by side: what each does, how long it lasts, who it suits, aftercare and prices at Toni & Guy Hopefarm, Whitefield Bangalore.",
  keywords: [
    "hair spa vs keratin", "keratin vs botox hair", "hair botox vs nanoplastia",
    "nanoplastia vs keratin", "difference between hair spa keratin botox nanoplastia",
    "best hair treatment for frizzy hair", "hair botox whitefield bangalore",
    "nanoplastia whitefield", "keratin treatment whitefield", "hair spa whitefield",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Hair Spa vs Keratin vs Hair Botox vs Nanoplastia | Toni & Guy Whitefield",
    description: "What each treatment does, how long it lasts, who should choose it — with a full comparison table and Whitefield prices.",
    url: PAGE_URL,
    type: "article",
  },
};

const COMPARISON: Array<[string, string, string, string, string]> = [
  ["Main purpose", "Deep nourishment, moisture and shine", "Smooths frizz and straightens/softens texture", "Repairs and conditions damaged hair; restores softness", "Smooths frizz with a gentler, conditioning-led formula"],
  ["Changes hair texture?", "No — temporary softness only", "Yes — noticeably smoother to straight", "Slightly — reduces frizz, keeps natural wave/curl", "Yes — smooth, often sleek, but more natural-looking"],
  ["Repairs damage?", "Surface-level conditioning", "Coats the strand; not a repair treatment", "Yes — its main job", "Coats and conditions; some repair benefit"],
  ["How long it lasts", "Weeks (a few washes to ~1 month)", "About 3–5 months", "About 2–3 months", "About 3–5 months"],
  ["Time in the chair", "45–90 min", "2.5–4 hours", "2–3 hours", "3–4 hours"],
  ["Best hair types", "Dry, dull, colour-treated, all types", "Thick, wavy, very frizzy", "Damaged, bleached, over-processed", "Frizzy to wavy, mixed or sensitive-to-smell clients"],
  ["Maintenance", "Repeat every 4–6 weeks", "Sulfate-free care; top-up at 3–5 months", "Sulfate-free care; repeat at 2–3 months", "Sulfate-free care; top-up at 3–5 months"],
  ["Starts at (Toni & Guy)", "₹2,000 (men) · from ₹2,500 (women)", "₹4,500 onwards (Cysteine/Keratin)", "₹5,000 onwards (Botoliss)", "₹5,000 onwards"],
];

const SHOULD_CHOOSE = [
  {
    title: "Choose a Hair Spa if…",
    points: [
      "Your hair is dry, dull or tired but not badly damaged.",
      "You want a quick refresh before an event or a holiday.",
      "You colour your hair and want to keep it soft and glossy between colour sessions.",
      "You don't want to change your natural texture at all.",
      "You want the lowest-commitment, lowest-cost option.",
    ],
  },
  {
    title: "Choose Keratin if…",
    points: [
      "Your main problem is frizz, especially in Bangalore's humidity.",
      "You want visibly smoother, easier-to-style hair for months.",
      "You blow-dry or iron your hair often and want to cut styling time.",
      "Your hair is thick or wavy and you're happy for it to look much straighter.",
    ],
  },
  {
    title: "Choose Hair Botox (Botoliss) if…",
    points: [
      "Your hair is damaged: bleached, heavily coloured, or heat-styled.",
      "You want softness and shine without losing your natural wave or curl.",
      "Your hair looks fluffy and brittle and you want it to feel healthy again.",
      "You want a repair-first treatment rather than a straightening one.",
    ],
  },
  {
    title: "Choose Nanoplastia if…",
    points: [
      "You want long-lasting smoothing but a softer, more natural finish than classic keratin.",
      "You've had keratin before and want to try an alternative.",
      "You prefer a lighter smell during the service. Ask your stylist how the formula compares.",
      "Your hair is frizzy and slightly damaged and you want smoothness plus conditioning.",
    ],
  },
];

const FAQS = [
  {
    q: "What is the difference between hair spa and keratin?",
    a: "A hair spa is a conditioning treatment: it moisturises and adds shine but doesn't change your hair's texture, and the effect fades in a few weeks. Keratin is a smoothing treatment that coats the hair and makes it noticeably smoother or straighter for around 3–5 months.",
  },
  {
    q: "Is hair botox the same as keratin?",
    a: "No. Hair botox (Botoliss at our salon) is mainly a repair and conditioning treatment: it softens and de-frizzes damaged hair while keeping natural movement. Keratin is mainly a smoothing treatment that visibly changes texture. Despite the name, hair botox has nothing to do with injections.",
  },
  {
    q: "Is Nanoplastia better than keratin?",
    a: "Neither is better for everyone. Nanoplastia usually gives a softer, more natural-looking smooth finish and many clients find it gentler; keratin often gives a stronger straightening effect. The right choice depends on your hair type, damage level and the look you want, which your stylist assesses at the consultation.",
  },
  {
    q: "Which treatment is best for damaged hair?",
    a: "Hair botox (Botoliss) is usually the first choice for damaged, bleached or over-processed hair because it focuses on repair. A hair spa works for mild dryness. Very damaged hair may need a few weeks of conditioning treatments before a smoothing service.",
  },
  {
    q: "Can I colour my hair after keratin, botox or Nanoplastia?",
    a: "Usually yes, but the order matters. We generally recommend colouring first, then the treatment a week or two later, because the treatment can slightly change how colour takes. Always tell your stylist about your colour plans when you book.",
  },
  {
    q: "How long should I wait before washing my hair after treatment?",
    a: "Most smoothing treatments need 48–72 hours before the first wash and no tying, clipping or tucking behind the ears during that time. Your stylist will give exact instructions for the formula used on your hair.",
  },
  {
    q: "Are these treatments safe during pregnancy?",
    a: "Please speak to your doctor first and tell your stylist if you are pregnant or breastfeeding. We'd rather suggest a gentle hair spa than risk anything.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Hair Spa vs Keratin vs Hair Botox vs Nanoplastia — Which One Is Right for You?",
      description: "A detailed comparison of hair spa, keratin, hair botox and Nanoplastia: results, durability, aftercare, who each suits and prices in Whitefield.",
      datePublished: "2026-10-11",
      dateModified: "2026-10-11",
      author: { "@type": "Organization", name: "Toni & Guy Hopefarm Whitefield" },
      publisher: { "@type": "Organization", name: "Toni & Guy Hopefarm" },
      mainEntityOfPage: { "@type": "WebPage", "@id": PAGE_URL },
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

export default function HairTreatmentComparison() {
  return (
    <main className="min-h-screen bg-salon-black px-5 pb-24 pt-28 md:px-8 md:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Link href="/blog" className="text-xs uppercase tracking-widest text-salon-gold hover:underline">← All Articles</Link>
        </div>
        <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">Hair Treatment Guide</p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-white md:text-6xl">
          Hair Spa vs Keratin vs Hair Botox vs Nanoplastia
        </h1>
        <p className="mt-4 text-sm text-white/40">By Toni &amp; Guy Hopefarm, Whitefield · October 2026 · 8 min read</p>

        <div className="mt-10 space-y-6 leading-8 text-white/70">
          <p>
            Hair spa, keratin, hair botox and Nanoplastia all promise softer, shinier, more manageable hair, so it&apos;s
            easy to book the wrong one. They do different jobs. One conditions, one smooths, one repairs and one smooths
            with a gentler finish. This guide explains each in plain language, compares them side by side, and tells you
            who should pick what.
          </p>

          <div className="rounded-xl border border-salon-gold/30 bg-salon-gold/5 p-5">
            <p className="font-semibold text-white">The 30-second answer</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm">
              <li><strong className="text-white">Dull or dry, but healthy enough?</strong> Hair spa.</li>
              <li><strong className="text-white">Frizzy and want it smooth or straight for months?</strong> Keratin.</li>
              <li><strong className="text-white">Damaged and want softness without losing your wave?</strong> Hair botox.</li>
              <li><strong className="text-white">Frizzy, want smooth but a softer, natural finish?</strong> Nanoplastia.</li>
            </ul>
          </div>

          <h2 className="mt-10 font-display text-3xl text-white">What each treatment actually does</h2>

          <h3 className="mt-6 text-xl font-semibold text-white">1. Hair Spa</h3>
          <p>
            A hair spa is a deep-conditioning ritual: cleansing, a nourishing mask worked into the lengths, a steam or
            heat step to help the product absorb, a scalp massage and a blow-dry. It restores moisture, softness and
            shine. It does <em>not</em> change your hair&apos;s texture or straighten it, and the effect lasts a few weeks.
            It&apos;s the best entry point because it&apos;s quick, affordable and works on every hair type, men and women.
          </p>

          <h3 className="mt-6 text-xl font-semibold text-white">2. Keratin (Cysteine) Treatment</h3>
          <p>
            Keratin treatments apply a smoothing formula to the hair, which is then sealed in with heat. It coats the
            strand, fills in rough spots and holds the hair in a smoother, straighter shape. The result is much less
            frizz, faster blow-drying and hair that behaves in Bangalore&apos;s humidity, typically for 3–5 months, fading
            gradually with every wash. Because it is a smoothing and shape-setting service, it&apos;s the strongest
            straightening effect of the four. Ventilation matters, and some formulas have a noticeable smell during the
            service. Ask which formula we are using for your hair.
          </p>

          <h3 className="mt-6 text-xl font-semibold text-white">3. Hair Botox (Botoliss)</h3>
          <p>
            Despite the name, hair botox has nothing to do with injections. It is a repair-and-conditioning treatment
            that fills in the damaged, rough parts of the hair strand with nourishing ingredients such as proteins,
            amino acids and vitamins, making hair feel denser, softer and shinier. It reduces frizz but, unlike keratin,
            does not aim to straighten, so waves and curls stay. It suits hair that&apos;s been bleached, heavily coloured or
            heat-styled, and it generally lasts around 2–3 months with proper care.
          </p>

          <h3 className="mt-6 text-xl font-semibold text-white">4. Nanoplastia</h3>
          <p>
            Nanoplastia is a smoothing treatment built around amino acids and plant-derived ingredients, positioned as a
            gentler alternative to classic keratin. It gives a smooth, glossy, frizz-free finish that tends to look more
            natural and move more freely, and it also conditions the hair. Results usually last 3–5 months depending on
            hair type and aftercare. If you want smoothness but dislike the very flat, pin-straight look some keratin
            gives, this is often the one to ask about.
          </p>

          <h2 className="mt-10 font-display text-3xl text-white">Side-by-side comparison</h2>
          <p className="text-sm text-white/50">Durations and times are typical ranges. Your hair type, length and aftercare change them.</p>

          <div className="my-4 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="pb-3 pr-3 font-semibold text-white"> </th>
                  <th className="pb-3 pr-3 font-semibold text-salon-gold">Hair Spa</th>
                  <th className="pb-3 pr-3 font-semibold text-salon-gold">Keratin</th>
                  <th className="pb-3 pr-3 font-semibold text-salon-gold">Hair Botox</th>
                  <th className="pb-3 font-semibold text-salon-gold">Nanoplastia</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map(([label, ...cells]) => (
                  <tr key={label} className="border-b border-white/5 align-top">
                    <td className="py-3 pr-3 font-semibold text-white">{label}</td>
                    {cells.map((c, i) => (
                      <td key={i} className="py-3 pr-3 text-white/65 last:pr-0">{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mt-10 font-display text-3xl text-white">Who should go for what?</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {SHOULD_CHOOSE.map((s) => (
              <div key={s.title} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <h3 className="font-display text-xl text-salon-gold">{s.title}</h3>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-white/65">
                  {s.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <h2 className="mt-10 font-display text-3xl text-white">Quick picker by hair concern</h2>
          <div className="my-4 rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="pb-3 font-semibold text-white">Your concern</th>
                  <th className="pb-3 font-semibold text-white">Best fit</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Dull, dry, lacks shine", "Hair Spa"],
                  ["Frizz in humidity, hair takes forever to dry and style", "Keratin or Nanoplastia"],
                  ["Bleached, over-coloured or heat-damaged", "Hair Botox first"],
                  ["Want to keep natural waves/curls but reduce frizz", "Hair Botox"],
                  ["Want sleek, straighter hair that still looks natural", "Nanoplastia"],
                  ["Want the strongest straightening effect", "Keratin"],
                  ["Event or holiday soon, short on time", "Hair Spa"],
                  ["Short hair or men's hair", "Hair Spa; smoothing treatments priced by hair length"],
                ].map(([c, b]) => (
                  <tr key={c} className="border-b border-white/5">
                    <td className="py-2.5 pr-4 text-white/70">{c}</td>
                    <td className="py-2.5 text-salon-gold">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mt-10 font-display text-3xl text-white">Prices at Toni &amp; Guy Hopefarm, Whitefield</h2>
          <p>
            Smoothing and repair treatments are priced by hair length (and spa by product and length). These are starting
            prices, the final price is confirmed at your consultation.
          </p>
          <div className="my-4 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="pb-3 font-semibold text-white">Length</th>
                  <th className="pb-3 text-right font-semibold text-white">Keratin (Cysteine)</th>
                  <th className="pb-3 text-right font-semibold text-white">Hair Botox (Botoliss)</th>
                  <th className="pb-3 text-right font-semibold text-white">Nanoplastia</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Fringe", "₹4,500", "₹5,000", "₹5,000"],
                  ["Up to neck", "₹7,500", "₹8,500", "₹8,500"],
                  ["Shoulder length", "₹10,000", "₹11,000", "₹11,000"],
                  ["Below shoulder", "₹11,000", "₹13,000", "₹13,000"],
                  ["Up to waist", "₹13,000", "₹15,000", "₹15,000"],
                ].map(([len, k, b, n]) => (
                  <tr key={len} className="border-b border-white/5">
                    <td className="py-2.5 text-white/70">{len}</td>
                    <td className="py-2.5 text-right text-salon-gold">{k}</td>
                    <td className="py-2.5 text-right text-salon-gold">{b}</td>
                    <td className="py-2.5 text-right text-salon-gold">{n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-xs text-white/40">All prices onwards. Hair spa: from ₹2,000 for men and from ₹2,500 for women (shoulder length), depending on the product.</p>
          </div>
          <p>
            See the full list on our <Link href="/services" className="text-salon-gold underline">services page</Link>.
          </p>

          <h2 className="mt-10 font-display text-3xl text-white">Aftercare that makes any of them last longer</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Wait the time your stylist advises (typically 48–72 hours) before the first wash for smoothing treatments.</li>
            <li>Don&apos;t tie, clip or tuck hair behind the ears during that window.</li>
            <li>Switch to a sulfate-free shampoo and conditioner. Sulfates strip treatments faster.</li>
            <li>Avoid very hot water and rinse with lukewarm water.</li>
            <li>Use a heat protectant when blow-drying or ironing.</li>
            <li>Be careful with chlorinated pools and the sea. Rinse straight after, or cover your hair.</li>
            <li>Book a hair spa between smoothing treatments to keep hair conditioned.</li>
          </ul>

          <h2 className="mt-10 font-display text-3xl text-white">Common mistakes to avoid</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li><strong className="text-white">Booking keratin for badly damaged hair.</strong> Repair first with botox or a spa series, then smooth.</li>
            <li><strong className="text-white">Expecting a hair spa to straighten.</strong> It conditions; it doesn&apos;t change texture.</li>
            <li><strong className="text-white">Colouring right after a smoothing treatment.</strong> Plan the order with your stylist.</li>
            <li><strong className="text-white">Using regular shampoo afterwards.</strong> It shortens the life of any treatment.</li>
          </ul>

          <h2 className="mt-10 font-display text-3xl text-white">FAQs</h2>
          <div className="mt-4 space-y-4">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="rounded-lg border border-white/8 bg-white/[0.02] p-5">
                <p className="font-semibold text-white">{q}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{a}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-salon-gold/30 bg-salon-gold/5 p-7">
            <p className="font-display text-2xl text-white">Not sure which one your hair needs?</p>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              Book a consultation at Toni &amp; Guy Hopefarm, Hopefarm Junction, Whitefield. Our stylists assess your hair
              type and damage level and recommend the right treatment before you commit. Open 9 AM–9 PM daily.
            </p>
            <div className="mt-5 flex flex-wrap gap-4">
              <Link href="/book" className="rounded-full bg-salon-gold px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-salon-black">
                Book online
              </Link>
              <a href="https://wa.me/919187200430?text=Hi, I'd like advice on a hair treatment" target="_blank" rel="noopener noreferrer"
                className="self-center text-sm text-white/50 hover:text-salon-gold">
                Ask on WhatsApp →
              </a>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 border-t border-white/8 pt-6 text-sm">
            <Link href="/blog/keratin-treatment-whitefield-guide" className="text-salon-gold hover:underline">Keratin Guide →</Link>
            <Link href="/blog/professional-hair-treatment-benefits" className="text-salon-gold hover:underline">Benefits of Salon Treatments →</Link>
            <Link href="/services/keratin-treatment" className="text-salon-gold hover:underline">Keratin Service →</Link>
          </div>
        </div>
      </article>
    </main>
  );
}
