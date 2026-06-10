"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Where is Toni & Guy Hopefarm located?",
    a: "We're on the 1st Floor, No.242 & 243, Whitefield Main Road — above Axis Bank, next to Four Points Hotel, Hopefarm Junction. Easily accessible from ITPL, Varthur, Marathahalli, and Brookefield.",
  },
  {
    q: "What are your opening hours?",
    a: "We're open every day from 9 AM to 9 PM — Monday through Sunday, including public holidays.",
  },
  {
    q: "Do you take walk-ins or do I need an appointment?",
    a: "Walk-ins are always welcome. However, booking online guarantees your slot and gets you a weekday discount of 25–35% on most services.",
  },
  {
    q: "What is the price list for Toni & Guy Hopefarm?",
    a: "Men's haircuts start from ₹700, women's from ₹900, hair colour from ₹2,500, balayage from ₹3,500, and keratin treatments from ₹1,800. Prices vary by hair length — confirmed at consultation. Book online for weekday discounts.",
  },
  {
    q: "Which is the closest Toni & Guy to ITPL and Whitefield?",
    a: "Toni & Guy Hopefarm is the closest TONI&GUY franchise to ITPL — just 5 minutes away on Whitefield Main Road. It also serves customers from Varthur, Marathahalli, Bellandur, Brookefield, and Mahadevapura.",
  },
  {
    q: "Do you offer keratin treatment and smoothening?",
    a: "Yes — we offer Brazilian keratin, Nanoplastia, and hair Botox treatments. Prices start from ₹1,800 for short hair. Results last 3–6 months even in Bangalore's humidity.",
  },
  {
    q: "Does Toni & Guy Hopefarm do bridal hair?",
    a: "Yes. We offer bridal trials, wedding updos, blowouts, and bridesmaid packages. Call +91 91872 00430 to enquire about bridal bookings and group packages.",
  },
  {
    q: "What hair colour products do you use?",
    a: "All colour services use L'Oreal Professional exclusively — the same range used at TONI&GUY salons globally. No drugstore or local brands.",
  },
  {
    q: "How do I contact the salon?",
    a: "Call or WhatsApp: +91 91872 00430. You can also book directly on this website for instant confirmation and weekday discounts.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="section-shell py-20 md:py-28">
      <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">FAQs</p>
      <h2 className="mt-3 font-display text-5xl font-black uppercase leading-none text-white md:text-7xl">
        Common Questions
      </h2>
      <p className="mt-5 max-w-xl text-white/50">
        Everything you need to know before visiting Toni &amp; Guy Hopefarm, Whitefield.
      </p>

      <div className="mt-12 divide-y divide-white/8 border-y border-white/8">
        {faqs.map((faq, i) => (
          <div key={i}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-6 py-5 text-left"
              aria-expanded={open === i}
            >
              <span className="text-base font-semibold text-white md:text-lg">{faq.q}</span>
              <span
                className="shrink-0 text-salon-gold text-xl leading-none transition-transform duration-200"
                style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}
              >
                +
              </span>
            </button>
            {open === i && (
              <p className="pb-5 text-sm leading-relaxed text-white/60 md:text-base">
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
