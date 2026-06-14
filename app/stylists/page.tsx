import type { Metadata } from "next";
import Link from "next/link";
import { RevealProvider } from "@/components/RevealProvider";
import { StylistCard } from "@/components/StylistCard";
import { stylists } from "@/lib/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toniandguywhitefield.com";

export const metadata: Metadata = {
  title: "Our Hair Stylists | Toni & Guy Hopefarm Whitefield Bangalore",
  description:
    "Meet the expert stylists at Toni & Guy Hopefarm, Whitefield Bangalore. Specialists in precision haircuts, balayage, hair colour, keratin treatments, and bridal hair styling. TONI&GUY trained team.",
  keywords: [
    "toni and guy stylists whitefield", "hair stylist whitefield bangalore",
    "best hair stylist whitefield", "toni and guy hopefarm team",
    "balayage specialist whitefield", "bridal hair stylist whitefield bangalore",
    "trained hair stylist whitefield", "toni guy hairdresser bangalore",
  ],
  alternates: { canonical: `${SITE_URL}/stylists` },
  openGraph: {
    title: "Our Hair Stylists | Toni & Guy Hopefarm Whitefield",
    description: "Meet our TONI&GUY trained stylists — specialists in cuts, balayage, colour, keratin and bridal hair at Hopefarm, Whitefield Bangalore.",
    url: `${SITE_URL}/stylists`,
  },
};

export default function StylistsPage() {
  return (
    <main className="min-h-screen bg-[#0e0d0b] px-5 pb-24 pt-28 md:px-8 md:pt-36">
      <RevealProvider>
        <section className="section-shell reveal-section">
          <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">The Team</p>
          <h1 className="mt-4 max-w-5xl font-display text-6xl leading-none md:text-8xl">
            TONI&amp;GUY trained specialists in Whitefield.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
            Every stylist at Toni &amp; Guy Hopefarm has completed the internationally recognised
            TONI&amp;GUY training programme. That means the same cutting, colouring, and finishing
            techniques used in salons across London, New York, and Tokyo — right here at
            Hopefarm Junction, Whitefield Bangalore.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/45">
            Whether you&apos;re coming in for a quick trim or a full balayage transformation, you&apos;re in
            the hands of specialists who take their craft seriously. Book by stylist or let us
            match you — either way, you&apos;ll receive a thorough consultation before any service begins.
          </p>

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {stylists.map((stylist) => (
              <StylistCard key={stylist.name} {...stylist} />
            ))}
          </div>

          <div className="mt-20 rounded-2xl border border-white/8 bg-white/[0.02] p-8 md:p-10">
            <p className="font-display text-3xl uppercase text-white md:text-4xl">
              Not sure who to book with?
            </p>
            <p className="mt-3 max-w-xl text-white/55 leading-relaxed">
              Tell us what you&apos;re looking for — a colour correction, a first-time balayage,
              a bridal look — and we&apos;ll pair you with the right specialist. Call us at
              +91 91872 00430 or book online and mention your preference in the notes.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href="https://wa.me/919187200430?text=Hi, I'd like help choosing the right stylist"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-salon-gold px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-salon-black"
              >
                Ask via WhatsApp
              </a>
              <a href="tel:+919187200430" className="flex items-center gap-2 text-sm text-white/50 hover:text-salon-gold transition">
                +91 91872 00430
              </a>
            </div>
          </div>

          <div className="mt-14">
            <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">What our team specialises in</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { service: "Precision Haircuts", desc: "Men's and women's cuts shaped to face structure and lifestyle." },
                { service: "Balayage & Highlights", desc: "Hand-painted colour for natural, sun-kissed results." },
                { service: "Hair Colour", desc: "Global colour, root touch-ups, fashion colour and toning." },
                { service: "Keratin & Smoothening", desc: "Brazilian keratin, Nanoplastia and hair Botox treatments." },
                { service: "Bridal Hair", desc: "Wedding updos, blowouts and bridal trials for east Bangalore brides." },
                { service: "Hair Spa & Treatments", desc: "Deep conditioning and repair for damaged or over-processed hair." },
              ].map((s) => (
                <div key={s.service} className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
                  <p className="font-semibold text-white">{s.service}</p>
                  <p className="mt-1 text-sm text-white/45 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/services" className="text-xs text-white/40 hover:text-salon-gold">View all services & prices →</Link>
            <Link href="/gallery" className="text-xs text-white/40 hover:text-salon-gold">See our work →</Link>
          </div>
        </section>
      </RevealProvider>
    </main>
  );
}
