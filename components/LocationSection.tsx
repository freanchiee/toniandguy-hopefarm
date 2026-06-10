"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Navigation } from "lucide-react";

export function LocationSection() {
  return (
    <section id="location" className="bg-salon-black py-24 md:py-32">
      <div className="section-shell">

        {/* Header */}
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">Find Us</p>
          <h2 className="mt-4 font-display text-5xl leading-none md:text-7xl">
            Visit the salon.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">

          {/* Map embed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="overflow-hidden rounded-2xl border border-white/8"
          >
            <iframe
              src="https://maps.google.com/maps?q=Toni+%26+Guy+Hopefarm+Whitefield+Bangalore&output=embed&z=16"
              width="100%"
              height="360"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Toni & Guy Hopefarm location"
            />
          </motion.div>

          {/* Info cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-col gap-4"
          >

            {/* Address */}
            <div className="flex gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-salon-gold/10">
                <MapPin className="h-5 w-5 text-salon-gold" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/40">Address</p>
                <p className="mt-1 text-sm font-medium leading-relaxed text-white">
                  Hopefarm Junction, Whitefield<br />
                  Bangalore, Karnataka 560066
                </p>
                <a
                  href="https://maps.app.goo.gl/nFqNAeWzgR4XLTne9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-salon-gold hover:underline"
                >
                  <Navigation className="h-3 w-3" />
                  Get Directions
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-salon-gold/10">
                <Clock className="h-5 w-5 text-salon-gold" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/40">Opening Hours</p>
                <p className="mt-1 text-sm font-medium text-white">9:00 AM – 9:00 PM</p>
                <p className="text-xs text-white/50">Monday to Sunday · Open all week</p>
              </div>
            </div>

            {/* Contact */}
            <div className="flex gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-salon-gold/10">
                <Phone className="h-5 w-5 text-salon-gold" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/40">Contact</p>
                <p className="mt-1 text-sm font-medium text-white">Rishav Raj</p>
                <a
                  href="tel:+919187200430"
                  className="mt-0.5 block text-sm text-salon-gold hover:underline"
                >
                  +91 91872 00430
                </a>
                <a
                  href="https://wa.me/919187200430"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-salon-gold/30 bg-salon-gold/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-salon-gold transition hover:bg-salon-gold/15"
                >
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>

          </motion.div>
        </div>

        {/* Areas We Serve — SEO text + user value */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 rounded-2xl border border-white/8 bg-white/[0.02] p-6"
        >
          <p className="mb-4 text-xs uppercase tracking-[0.22em] text-salon-gold">Areas We Serve</p>
          <p className="mb-4 text-sm text-white/60 leading-relaxed max-w-2xl">
            Conveniently located at Hopefarm Junction — the closest Toni &amp; Guy to east Bangalore.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "Whitefield", "Hopefarm Junction", "ITPL", "Varthur", "Marathahalli",
              "Mahadevapura", "Brookefield", "Kundalahalli", "Bellandur", "Sarjapur Road",
              "Kadugodi", "Nallurhalli", "Phoenix Marketcity Area",
            ].map((area) => (
              <span
                key={area}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60"
              >
                {area}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
