"use client";
import { useState, useEffect } from "react";
import { Loader2, ArrowLeft, Minus, MessageCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

type Transaction = { id: string; service_name: string; amount_deducted: number; performed_by: string; created_at: string };
type Customer = {
  id: string; name: string; phone: string; email?: string; notes?: string;
  credit_remaining: number; created_at: string;
  salon_packages: { name: string; price_inr: number; credit_inr: number } | null;
};

const SALON_SERVICES = [
  "Haircut — Men",
  "Haircut — Women",
  "Haircut — Kids",
  "Blow Dry / Styling",
  "Wash & Blast Dry",
  "Ironing / Tonging",
  "Global Colour (Men)",
  "Global Colour (Women)",
  "Tint Re-growth",
  "Highlights — Full Head",
  "Highlights — Half Head",
  "T-Section Highlights",
  "Balayage / Ombré",
  "Keratin Treatment",
  "Nanoplastia Treatment",
  "Protein Smoothening",
  "Rebonding / Straightening",
  "Hair Spa — Men",
  "Hair Spa — Women",
  "Bridal Hair Styling",
  "Bridal Trial",
  "Skin Facial",
  "Manicure",
  "Pedicure",
  "Threading",
  "Waxing",
  "Head Oil Massage",
  "Swedish Massage",
  "Deep Tissue Massage",
  "Custom service…",
];

const CUSTOM_KEY = "Custom service…";

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState("");
  const [customService, setCustomService] = useState("");
  const [amount, setAmount] = useState("");
  const [deducting, setDeducting] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState<{ msg: string; waSent: boolean; waPhone?: string } | null>(null);

  async function load() {
    const res = await fetch(`/api/admin/package-customers/${id}`);
    const d = await res.json();
    setCustomer(d.customer);
    setTransactions(d.transactions ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, [id]);

  const serviceName = selectedService === CUSTOM_KEY ? customService : selectedService;

  async function deduct() {
    if (!serviceName.trim()) { setErr("Select or enter a service"); return; }
    if (!amount || Number(amount) <= 0) { setErr("Enter a valid amount"); return; }
    setDeducting(true); setErr(""); setSuccess(null);
    const res = await fetch(`/api/admin/package-customers/${id}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service_name: serviceName.trim(), amount: Number(amount) }),
    });
    const d = await res.json();
    if (!res.ok) { setErr(d.error ?? "Error"); setDeducting(false); return; }
    setSuccess({
      msg: `Deducted ₹${Number(amount).toLocaleString("en-IN")} for ${serviceName.trim()}. New balance: ₹${d.credit_remaining.toLocaleString("en-IN")}`,
      waSent: d.wa_sent,
      waPhone: d.wa_phone,
    });
    setSelectedService(""); setCustomService(""); setAmount("");
    load(); setDeducting(false);
  }

  if (loading || !customer) return (
    <div className="flex min-h-screen items-center justify-center bg-salon-black">
      <Loader2 className="h-6 w-6 animate-spin text-salon-gold" />
    </div>
  );

  const pkg = customer.salon_packages;
  const pct = pkg ? Math.min(100, Math.round((customer.credit_remaining / pkg.credit_inr) * 100)) : 0;
  const totalSpent = pkg ? pkg.credit_inr - customer.credit_remaining : 0;
  const exhausted = customer.credit_remaining === 0;

  const inp = "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/20 focus:border-salon-gold focus:outline-none";

  return (
    <main className="min-h-screen bg-salon-black px-5 py-10 md:px-8">
      <div className="mx-auto max-w-2xl">
        <Link href="/admin/package-customers" className="flex items-center gap-2 text-xs text-white/40 hover:text-white mb-8">
          <ArrowLeft className="h-3 w-3" /> All customers
        </Link>

        {/* Customer card */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-salon-gold/10 text-salon-gold font-bold text-xl flex-shrink-0">
              {customer.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-3xl text-white uppercase">{customer.name}</h1>
              <p className="text-sm text-white/40">{customer.phone}{customer.email ? ` · ${customer.email}` : ""}</p>
              {pkg && <p className="mt-1 text-xs text-salon-gold">{pkg.name}</p>}
              {customer.notes && <p className="mt-2 text-xs text-white/30 italic">{customer.notes}</p>}
            </div>
          </div>

          {/* Credit bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/50">Remaining credit</span>
              <span className={`font-bold ${exhausted ? "text-red-400" : "text-salon-gold"}`}>
                ₹{customer.credit_remaining.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-white/10">
              <div
                className={`h-2.5 rounded-full transition-all ${exhausted ? "bg-red-500" : pct < 25 ? "bg-amber-400" : "bg-salon-gold"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-xs text-white/30">
              <span>₹{totalSpent.toLocaleString("en-IN")} spent</span>
              {pkg && <span>of ₹{pkg.credit_inr.toLocaleString("en-IN")} total</span>}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: "Paid", value: pkg ? `₹${pkg.price_inr.toLocaleString("en-IN")}` : "—" },
              { label: "Total credits", value: pkg ? `₹${pkg.credit_inr.toLocaleString("en-IN")}` : "—" },
              { label: "Services done", value: transactions.length },
            ].map(s => (
              <div key={s.label} className="rounded-lg border border-white/8 p-3 text-center">
                <p className="font-bold text-white">{s.value}</p>
                <p className="text-xs text-white/30">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Deduct form */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 mb-6">
          <p className="font-semibold text-white mb-4 flex items-center gap-2">
            <Minus className="h-4 w-4 text-salon-gold" /> Deduct Service
          </p>

          <div className="space-y-3">
            {/* Service dropdown */}
            <div>
              <label className="mb-1 block text-xs text-white/40">Service performed</label>
              <select
                value={selectedService}
                onChange={e => { setSelectedService(e.target.value); setCustomService(""); }}
                className={`${inp} appearance-none cursor-pointer`}
              >
                <option value="" disabled>— Select a service —</option>
                {SALON_SERVICES.map(s => (
                  <option key={s} value={s} className="bg-zinc-900">{s}</option>
                ))}
              </select>
            </div>

            {/* Custom service input — shown only when "Custom service…" is picked */}
            {selectedService === CUSTOM_KEY && (
              <div>
                <label className="mb-1 block text-xs text-white/40">Custom service name</label>
                <input
                  value={customService}
                  onChange={e => setCustomService(e.target.value)}
                  placeholder="e.g. Bridal Saree Draping"
                  className={inp}
                  autoFocus
                />
              </div>
            )}

            {/* Amount */}
            <div>
              <label className="mb-1 block text-xs text-white/40">Amount to deduct (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="3500"
                min={1}
                className={inp}
              />
              {customer.credit_remaining > 0 && (
                <p className="mt-1 text-xs text-white/30">
                  Available: ₹{customer.credit_remaining.toLocaleString("en-IN")}
                </p>
              )}
            </div>
          </div>

          {err && <p className="mt-3 text-sm text-red-400">{err}</p>}

          {success && (
            <div className="mt-3 rounded-lg border border-green-400/20 bg-green-400/5 p-3">
              <p className="flex items-center gap-2 text-sm text-green-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" /> {success.msg}
              </p>
              <p className={`mt-1 flex items-center gap-1.5 text-xs ${success.waSent ? "text-green-400/70" : "text-white/30"}`}>
                <MessageCircle className="h-3 w-3" />
                {success.waSent
                  ? `WhatsApp sent to ${success.waPhone}`
                  : "WhatsApp not sent (gateway not configured — set OPENWA_URL or TWILIO_* env vars)"}
              </p>
            </div>
          )}

          <button
            onClick={deduct}
            disabled={deducting || exhausted}
            className="mt-4 flex items-center gap-2 rounded-full bg-salon-gold px-5 py-2.5 text-sm font-bold text-salon-black disabled:opacity-40"
          >
            {deducting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Minus className="h-3.5 w-3.5" />}
            Deduct from balance
          </button>
          {exhausted && <p className="mt-2 text-xs text-red-400">Balance exhausted — cannot deduct further.</p>}
        </div>

        {/* Transaction history */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6">
          <p className="font-semibold text-white mb-4">Transaction History</p>
          {transactions.length === 0 ? (
            <p className="text-sm text-white/30 py-4 text-center">No services deducted yet.</p>
          ) : (
            <div className="divide-y divide-white/5">
              {transactions.map(t => (
                <div key={t.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-white">{t.service_name}</p>
                    <p className="text-xs text-white/30 mt-0.5">
                      {new Date(t.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      {" · "}
                      {new Date(t.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      {t.performed_by ? ` · by ${t.performed_by}` : ""}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-red-400 shrink-0 ml-4">
                    −₹{t.amount_deducted.toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
