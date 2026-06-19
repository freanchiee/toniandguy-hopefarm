import type { Metadata } from "next";
import { BookingForm } from "@/components/BookingForm";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toniandguy-hopefarm.vercel.app";

export const metadata: Metadata = {
  title: "Book an Appointment | Toni & Guy Hopefarm Whitefield Bangalore",
  description:
    "Book a hair appointment at Toni & Guy Hopefarm, Whitefield Bangalore. Online booking available 24/7. Up to 35% off on weekday bookings. Haircuts, colour, keratin, balayage, bridal hair & more.",
  keywords: [
    "book salon appointment whitefield", "online salon booking bangalore",
    "toni and guy hopefarm book appointment", "hair appointment whitefield bangalore",
    "salon booking whitefield", "toni guy appointment online",
  ],
  alternates: { canonical: `${SITE_URL}/book` },
  openGraph: {
    title: "Book an Appointment | Toni & Guy Hopefarm Whitefield",
    description: "Online booking at Toni & Guy Hopefarm Whitefield. Up to 35% off on weekday appointments. Haircuts, colour, keratin, bridal & more.",
    url: `${SITE_URL}/book`,
  },
};

export default function BookPage() {
  return (
    <main className="min-h-screen bg-salon-black px-5 pb-24 pt-28 md:px-8 md:pt-36">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">Online Booking</p>
        <h1 className="mt-4 font-display text-5xl leading-none uppercase text-white md:text-7xl">
          Book your appointment
        </h1>
        <p className="mt-5 text-base leading-7 text-white/50">
          Fill in your details below and we&apos;ll confirm your appointment via WhatsApp or call.
          Walk-ins also welcome — open daily 9 AM–9 PM at Hopefarm Junction, Whitefield.
        </p>
        <div className="mt-10">
          <BookingForm />
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-3 text-center">
          {[
            { label: "Open daily", value: "9 AM – 9 PM" },
            { label: "Weekday discount", value: "Up to 35% off" },
            { label: "Call / WhatsApp", value: "+91 91872 00430" },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-white/8 bg-white/[0.02] px-4 py-4">
              <p className="text-sm font-bold text-salon-gold">{s.value}</p>
              <p className="text-xs text-white/40 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
