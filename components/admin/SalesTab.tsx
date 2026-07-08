"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Plus, Check, X, UserX } from "lucide-react";
import { TicketFormModal } from "@/components/admin/TicketFormModal";

const INR = (v: number) => `₹${(v ?? 0).toLocaleString("en-IN")}`;
const fmt = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

type Booking = { id: string; client_name: string; client_phone: string; booking_date: string; booking_time: string; status: string; service_name?: string; stylist_name?: string };
type Ticket = { id: string; invoice_number: string; customer_name: string; grand_total: number; payment_mode: string; is_gst: boolean; sale_at: string };

export function SalesTab() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | any>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [b, t] = await Promise.all([
      fetch("/api/bookings").then((r) => r.json()),
      fetch("/api/admin/tickets").then((r) => r.json()),
    ]);
    setBookings(b.bookings ?? []);
    setTickets(t.tickets ?? []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function setStatus(id: string, status: string) {
    setBusy(id);
    const res = await fetch(`/api/admin/bookings/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    const d = await res.json();
    setBusy(null);
    if (status === "completed" && d.prefill) setModal(d.prefill);
    load();
  }

  const open = bookings.filter((b) => ["pending", "confirmed"].includes(b.status));

  if (loading) return <div className="flex items-center gap-2 py-16 text-white/40"><Loader2 className="h-4 w-4 animate-spin" />Loading…</div>;

  return (
    <div>
      {modal !== null && <TicketFormModal prefill={modal?.booking_id ? modal : undefined} onClose={() => setModal(null)} onSaved={load} />}

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-white/50">Complete bookings or log a walk-in sale.</p>
        <button onClick={() => setModal({})} className="flex items-center gap-2 rounded-full bg-salon-gold px-5 py-2 text-sm font-bold text-salon-black hover:brightness-110">
          <Plus className="h-4 w-4" /> New Sale
        </button>
      </div>

      {/* Open bookings */}
      <p className="mb-3 text-xs uppercase tracking-wider text-salon-gold">Bookings to action ({open.length})</p>
      {open.length === 0 ? (
        <p className="mb-8 text-sm text-white/30">No pending bookings.</p>
      ) : (
        <div className="mb-8 space-y-2">
          {open.map((b) => (
            <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/8 bg-white/[0.02] px-4 py-3">
              <div>
                <p className="text-sm font-medium text-white">{b.client_name} <span className="text-white/40">· {b.service_name ?? "—"}</span></p>
                <p className="text-xs text-white/30">{fmt(b.booking_date)} {b.booking_time} · {b.stylist_name ?? "any"} · {b.client_phone}</p>
              </div>
              <div className="flex items-center gap-2">
                <button disabled={busy === b.id} onClick={() => setStatus(b.id, "completed")} className="flex items-center gap-1 rounded-full bg-salon-gold/90 px-3 py-1.5 text-xs font-bold text-salon-black disabled:opacity-50"><Check className="h-3 w-3" /> Complete</button>
                <button disabled={busy === b.id} onClick={() => setStatus(b.id, "no_show")} className="flex items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/50 hover:border-amber-400/40 hover:text-amber-400"><UserX className="h-3 w-3" /> No-show</button>
                <button disabled={busy === b.id} onClick={() => setStatus(b.id, "cancelled")} className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/50 hover:border-red-400/40 hover:text-red-400"><X className="h-3 w-3" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent tickets */}
      <p className="mb-3 text-xs uppercase tracking-wider text-salon-gold">Recent sales</p>
      {tickets.length === 0 ? (
        <p className="text-sm text-white/30">No sales logged yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-white/8">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-wider text-white/40">
              <tr><th className="px-4 py-2">Invoice</th><th className="px-4 py-2">Customer</th><th className="px-4 py-2">Total</th><th className="px-4 py-2">Paid</th><th className="px-4 py-2">GST</th><th className="px-4 py-2">Date</th></tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id} className="border-t border-white/5">
                  <td className="px-4 py-2 font-mono text-xs text-white/60">{t.invoice_number}</td>
                  <td className="px-4 py-2 text-white/80">{t.customer_name}</td>
                  <td className="px-4 py-2 font-semibold text-salon-gold">{INR(t.grand_total)}</td>
                  <td className="px-4 py-2 text-white/50 capitalize">{t.payment_mode}</td>
                  <td className="px-4 py-2 text-white/40">{t.is_gst ? "GST" : "—"}</td>
                  <td className="px-4 py-2 text-white/40">{fmt(t.sale_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
