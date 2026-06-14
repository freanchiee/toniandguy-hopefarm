import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { RevealProvider } from "@/components/RevealProvider";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toniandguy-hopefarm.vercel.app";

export const metadata: Metadata = {
  title: "Contact & Location | Toni & Guy Hopefarm Whitefield Bangalore",
  description:
    "Contact Toni & Guy Hopefarm — the closest Toni & Guy to Whitefield, ITPL, Marathahalli & Bellandur. Hopefarm Junction, Bangalore. Call +91 91872 00430. Open daily 9 AM–9 PM.",
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: "Contact & Location | Toni & Guy Hopefarm Whitefield",
    description: "Toni & Guy at Hopefarm Junction, Whitefield — serving Marathahalli, ITPL, Bellandur & east Bangalore. Call +91 91872 00430.",
    url: `${SITE_URL}/contact`,
  },
};

export default function ContactPage() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919187200430";
  const message = encodeURIComponent("Hi, I'd like to book an appointment at Toni & Guy Hopefarm.");

  return (
    <main className="min-h-screen bg-salon-black px-5 pb-24 pt-28 md:px-8 md:pt-36">
      <RevealProvider>
        <section className="section-shell reveal-section grid gap-16 md:grid-cols-[0.85fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">Contact</p>
            <h1 className="mt-4 font-display text-6xl leading-none md:text-8xl">Hopefarm, Whitefield.</h1>
            <div className="mt-10 space-y-7 text-lg leading-8 text-salon-smoke">
              <p>1st Floor, No-242&243 Whitefield Main Road, above Axis Bank, next to Four Points Hotel, Bengaluru 560066</p>
              <p>Open daily, 9:00 AM – 9:00 PM</p>
              <Link
                href={`https://wa.me/${number}?text=${message}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex text-salon-gold underline underline-offset-8"
              >
                WhatsApp us to book
              </Link>
            </div>
          </div>
          <ContactForm />
        </section>
      </RevealProvider>
    </main>
  );
}
