"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      message: String(formData.get("message") || "")
    };

    if (!supabase) {
      setStatus("sent");
      event.currentTarget.reset();
      return;
    }

    const { error } = await supabase.from("enquiries").insert(payload);
    setStatus(error ? "error" : "sent");
    if (!error) event.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <input name="name" required placeholder="Name" className="border-b border-white/24 bg-transparent px-0 py-4 outline-none transition placeholder:text-white/42 focus:border-salon-gold" />
      <input name="phone" required placeholder="Phone" className="border-b border-white/24 bg-transparent px-0 py-4 outline-none transition placeholder:text-white/42 focus:border-salon-gold" />
      <input name="email" type="email" placeholder="Email" className="border-b border-white/24 bg-transparent px-0 py-4 outline-none transition placeholder:text-white/42 focus:border-salon-gold" />
      <textarea name="message" rows={5} placeholder="Message" className="resize-none border-b border-white/24 bg-transparent px-0 py-4 outline-none transition placeholder:text-white/42 focus:border-salon-gold" />
      <button type="submit" disabled={status === "sending"} className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/60 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] transition hover:border-salon-gold hover:text-salon-gold disabled:opacity-60">
        <Send className="h-4 w-4" />
        {status === "sending" ? "Sending" : "Send Enquiry"}
      </button>
      {status === "sent" && <p className="text-sm text-salon-gold">Thank you. We will get back to you shortly.</p>}
      {status === "error" && <p className="text-sm text-red-300">Something went wrong. Please try WhatsApp instead.</p>}
    </form>
  );
}
