import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919187200430";
  const message = encodeURIComponent("Hi, I'd like to book an appointment at Toni & Guy Hopefarm.");
  const href = `https://wa.me/${number}?text=${message}`;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Book on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border border-salon-gold/70 bg-salon-black/80 text-salon-gold shadow-2xl backdrop-blur transition hover:bg-salon-gold hover:text-salon-black"
    >
      <MessageCircle className="h-5 w-5" />
    </Link>
  );
}
