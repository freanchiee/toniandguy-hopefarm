"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { services, stylists } from "@/lib/data";
import { CheckCircle2, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";

type Slot = { time: string; available: boolean };

type FormState = {
  service_id: string;
  service_name: string;
  stylist_id: string;
  stylist_name: string;
  date: string;
  time: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  gender: string;
  notes: string;
};

const EMPTY: FormState = {
  service_id: "", service_name: "", stylist_id: "", stylist_name: "",
  date: "", time: "", client_name: "", client_phone: "", client_email: "", gender: "", notes: "",
};

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function maxDateStr() {
  const d = new Date();
  d.setDate(d.getDate() + 60);
  return d.toISOString().split("T")[0];
}

const stepVariants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

export function BookingForm({ onSuccess }: { onSuccess?: () => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ discount: number; bookingId: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!form.date) return;
    setLoadingSlots(true);
    const qs = new URLSearchParams({ date: form.date });
    if (form.stylist_id) qs.set("stylist_id", form.stylist_id);
    fetch(`/api/slots?${qs}`)
      .then((r) => r.json())
      .then((d) => setSlots(d.slots ?? []))
      .finally(() => setLoadingSlots(false));
  }, [form.date, form.stylist_id]);

  function setField(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  // ── client-side validation ───────────────────────────────────────────────
  function validate(): string {
    const phone = form.client_phone.replace(/\D/g, "");
    if (phone.length !== 10) return "Phone must be exactly 10 digits";
    if (form.client_email) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.client_email);
      if (!emailOk) return "Please enter a valid email address";
    }
    return "";
  }

  async function submit() {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setSubmitting(true);
    setError("");
    try {
      // Map form field names → API field names
      const payload = {
        service_id:    form.service_id,
        service_name:  form.service_name,
        stylist_id:    form.stylist_id,
        stylist_name:  form.stylist_name,
        booking_date:  form.date,
        booking_time:  form.time,
        client_name:   form.client_name,
        client_phone:  form.client_phone,
        client_email:  form.client_email,
        gender:        form.gender,
        notes:         form.notes,
      };
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Booking failed");
      setResult({ discount: data.discount, bookingId: data.booking.id });
      setStep(4);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const isWeekend = form.date ? [0, 6].includes(new Date(form.date).getDay()) : false;
  const discountRange = isWeekend ? "10–15%" : "25–35%";

  return (
    <div className="max-w-2xl">
      <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">Online booking</p>
      <h1 className="mt-3 font-serif text-5xl leading-none md:text-6xl">Book your visit.</h1>
      <p className="mt-3 text-sm text-white/50">
        {form.date && !result
          ? `${isWeekend ? "Weekend" : "Weekday"} discount: ${discountRange} sent to your WhatsApp`
          : "Weekday bookings save 25–35% · Weekends save 10–15%"}
      </p>

      {!result && (
        <div className="mt-8 flex items-center gap-2">
          {["Service", "Stylist", "Date & Time", "Details"].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition ${
                  i < step ? "bg-salon-gold text-salon-black" : i === step ? "border border-salon-gold text-salon-gold" : "border border-white/20 text-white/30"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`hidden text-xs uppercase tracking-wider md:block ${i === step ? "text-white" : "text-white/30"}`}>{label}</span>
              {i < 3 && <div className="h-px w-4 bg-white/12" />}
            </div>
          ))}
        </div>
      )}

      <div className="mt-10">
        <AnimatePresence mode="wait">

          {step === 0 && (
            <motion.div key="s0" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
              <p className="mb-4 text-sm text-white/60">What would you like?</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {services.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => { setField("service_id", s.name); setField("service_name", s.name); setStep(1); }}
                    className={`rounded-lg border p-4 text-left transition ${
                      form.service_id === s.name ? "border-salon-gold bg-salon-gold/10" : "border-white/12 hover:border-white/40"
                    }`}
                  >
                    <p className="font-semibold">{s.name}</p>
                    <p className="mt-1 text-xs text-white/50">{s.price} · {s.duration}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
              <p className="mb-4 text-sm text-white/60">Choose a stylist</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  onClick={() => { setField("stylist_id", ""); setField("stylist_name", "No preference"); setStep(2); }}
                  className="rounded-lg border border-white/12 p-4 text-left transition hover:border-white/40"
                >
                  <p className="font-semibold">No preference</p>
                  <p className="mt-1 text-xs text-white/50">We&apos;ll assign the best available</p>
                </button>
                {stylists.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => { setField("stylist_id", s.name); setField("stylist_name", s.name); setStep(2); }}
                    className={`rounded-lg border p-4 text-left transition ${
                      form.stylist_id === s.name ? "border-salon-gold bg-salon-gold/10" : "border-white/12 hover:border-white/40"
                    }`}
                  >
                    <p className="font-semibold">{s.name}</p>
                    <p className="mt-1 text-xs text-white/50">{s.speciality}</p>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(0)} className="mt-6 flex items-center gap-1 text-xs text-white/40 hover:text-white">
                <ChevronLeft className="h-3 w-3" /> Back
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
              <p className="mb-4 text-sm text-white/60">Pick a date and time</p>
              <input
                type="date"
                min={todayStr()}
                max={maxDateStr()}
                value={form.date}
                onChange={(e) => { setField("date", e.target.value); setField("time", ""); }}
                className="w-full rounded-lg border border-white/18 bg-white/5 px-4 py-3 text-white [color-scheme:dark] focus:border-salon-gold focus:outline-none"
              />
              {form.date && (
                <div className="mt-6">
                  <p className="mb-3 text-xs uppercase tracking-wider text-salon-gold">
                    {isWeekend ? `Weekend booking — ${discountRange} discount` : `Weekday booking — ${discountRange} discount`}
                  </p>
                  {loadingSlots ? (
                    <div className="flex items-center gap-2 text-sm text-white/40">
                      <Loader2 className="h-4 w-4 animate-spin" /> Loading slots…
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                      {slots.map((slot) => (
                        <button
                          key={slot.time}
                          disabled={!slot.available}
                          onClick={() => setField("time", slot.time)}
                          className={`rounded-md border py-2 text-sm transition ${
                            !slot.available
                              ? "cursor-not-allowed border-white/6 text-white/20 line-through"
                              : form.time === slot.time
                              ? "border-salon-gold bg-salon-gold/10 text-salon-gold"
                              : "border-white/18 hover:border-white/40"
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="mt-6 flex gap-3">
                <button onClick={() => setStep(1)} className="flex items-center gap-1 text-xs text-white/40 hover:text-white">
                  <ChevronLeft className="h-3 w-3" /> Back
                </button>
                <button
                  disabled={!form.date || !form.time}
                  onClick={() => setStep(3)}
                  className="ml-auto flex items-center gap-1 rounded-full border border-salon-gold px-5 py-2 text-sm text-salon-gold transition hover:bg-salon-gold hover:text-salon-black disabled:opacity-30"
                >
                  Next <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
              <p className="mb-4 text-sm text-white/60">Your contact details</p>
              <div className="grid gap-3">
                {/* Gender */}
                <div>
                  <p className="mb-2 text-xs text-white/40">Gender</p>
                  <div className="flex gap-2">
                    {["Male", "Female", "Other"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setField("gender", g)}
                        className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition ${
                          form.gender === g ? "border-salon-gold bg-salon-gold/10 text-salon-gold" : "border-white/18 text-white/60 hover:border-white/40"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <input placeholder="Full name *" value={form.client_name} onChange={(e) => setField("client_name", e.target.value)}
                  className="w-full rounded-lg border border-white/18 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-salon-gold focus:outline-none" />
                {/* Phone with live 10-digit validation */}
                <div>
                  <input
                    placeholder="WhatsApp number (10 digits) *"
                    value={form.client_phone}
                    onChange={(e) => { setField("client_phone", e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
                    type="tel" inputMode="numeric" maxLength={10}
                    className={`w-full rounded-lg border bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:outline-none ${
                      form.client_phone && form.client_phone.replace(/\D/g,"").length !== 10
                        ? "border-red-400/60 focus:border-red-400"
                        : "border-white/18 focus:border-salon-gold"
                    }`}
                  />
                  {form.client_phone && form.client_phone.replace(/\D/g,"").length !== 10 && (
                    <p className="mt-1 text-xs text-red-400">{form.client_phone.replace(/\D/g,"").length}/10 digits</p>
                  )}
                </div>
                {/* Email with live format validation */}
                <div>
                  <input
                    placeholder="Email (optional)"
                    value={form.client_email}
                    onChange={(e) => { setField("client_email", e.target.value); setError(""); }}
                    type="email"
                    className={`w-full rounded-lg border bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:outline-none ${
                      form.client_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.client_email)
                        ? "border-red-400/60 focus:border-red-400"
                        : "border-white/18 focus:border-salon-gold"
                    }`}
                  />
                  {form.client_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.client_email) && (
                    <p className="mt-1 text-xs text-red-400">Enter a valid email (e.g. name@gmail.com)</p>
                  )}
                </div>
                <textarea placeholder="Any notes or requests (optional)" value={form.notes} onChange={(e) => setField("notes", e.target.value)} rows={2}
                  className="w-full rounded-lg border border-white/18 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-salon-gold focus:outline-none" />
              </div>
              <div className="mt-5 rounded-lg border border-white/8 bg-white/3 p-4 text-sm">
                <p className="mb-2 text-xs uppercase tracking-wider text-white/40">Summary</p>
                <div className="space-y-1 text-white/80">
                  <p>📋 {form.service_name} · {form.stylist_name}</p>
                  <p>📅 {new Date(form.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })} at {form.time}</p>
                  <p className="text-salon-gold">🎉 {discountRange} {isWeekend ? "weekend" : "weekday"} discount via WhatsApp</p>
                </div>
              </div>
              {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
              <div className="mt-6 flex gap-3">
                <button onClick={() => setStep(2)} className="flex items-center gap-1 text-xs text-white/40 hover:text-white">
                  <ChevronLeft className="h-3 w-3" /> Back
                </button>
                <button
                  disabled={!form.client_name || form.client_phone.replace(/\D/g,"").length !== 10 || submitting}
                  onClick={submit}
                  className="ml-auto flex items-center gap-2 rounded-full bg-salon-gold px-6 py-3 text-sm font-bold uppercase tracking-wider text-salon-black transition hover:brightness-110 disabled:opacity-40"
                >
                  {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Confirming…</> : "Confirm Booking"}
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && result && (
            <motion.div key="s4" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }}>
              <CheckCircle2 className="mb-4 h-12 w-12 text-salon-gold" strokeWidth={1.4} />
              <h2 className="font-serif text-4xl">You&apos;re booked.</h2>
              <p className="mt-2 text-white/60">
                A WhatsApp confirmation with your discount code has been sent to <span className="text-white">{form.client_phone}</span>.
              </p>

              {/* Animated discount badge */}
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 18 }}
                className="mt-5 rounded-xl border border-salon-gold/40 bg-salon-gold/8 p-5 text-center"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-salon-gold">Your exclusive discount</p>
                <motion.p
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.35, type: "spring", damping: 12 }}
                  className="mt-1 text-7xl font-black text-salon-gold"
                >
                  {result.discount}%
                </motion.p>
                <p className="mt-1 text-sm text-white/50">Show the WhatsApp message at the salon to redeem</p>
              </motion.div>

              {/* WhatsApp message preview */}
              <div className="mt-5 rounded-xl border border-white/8 bg-[#1a1a1a] p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-400" />
                  <p className="text-xs text-white/40">WhatsApp sent to {form.client_phone}</p>
                </div>
                <div className="rounded-lg bg-[#005c4b] p-3 text-xs leading-relaxed text-white/90">
                  <p>✂️ <strong>Booking Confirmed — Toni & Guy Hopefarm</strong></p>
                  <p className="mt-1">Hi {form.client_name}! Your appointment is locked in.</p>
                  <p className="mt-2">📋 {form.service_name} · {form.stylist_name}</p>
                  <p>📅 {form.date && new Date(form.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })} at {form.time}</p>
                  <p className="mt-2 font-bold text-green-300">🎉 {result.discount}% discount applied! Show this message at the salon.</p>
                </div>
              </div>

              <button
                onClick={() => { setForm(EMPTY); setResult(null); setStep(0); if (onSuccess) onSuccess(); }}
                className="mt-6 text-sm text-white/40 underline hover:text-white"
              >
                Make another booking
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
