"use client";
import { useState, useEffect, use } from "react";
import { Loader2, ArrowLeft, Minus } from "lucide-react";
import Link from "next/link";

type Transaction = { id: string; service_name: string; amount_deducted: number; performed_by: string; created_at: string };
type Customer = {
  id: string; name: string; phone: string; email?: string; notes?: string;
  credit_remaining: number; created_at: string;
  salon_packages: { name: string; price_inr: number; credit_inr: number } | null;
};

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ service_name: "", amount: "" });
  const [deducting, setDeducting] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  async function load() {
    const res = await fetch(`/api/admin/package-customers/${id}`);
    const d = await res.json();
    setCustomer(d.customer);
    setTransactions(d.transactions ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, [id]);

  async function deduct() {
    if (!form.service_name || !form.amount) { setErr("Fill in both fields"); return; }
    setDeducting(true); setErr(""); setSuccess("");
    const res = await fetch(`/api/admin/package-customers/${id}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service_name: form.service_name, amount: Number(form.amount) }),
    });
    const d = await res.json();
    if (!res.ok) { setErr(d.error ?? "Error"); setDeducting(false); return; }
    setSuccess(`Deducted ₹${Number(form.amount).toLocaleString("en-IN")}. New balance: ₹${d.credit_remaining.toLocaleString("en-IN")}`);
    setForm({ service_name: "", amount: "" });
    load(); setDeducting(false);
  }

  if (loading || !customer) return <div className="flex min-h-screen items-center justify-center bg-salon-black"><Loader2 className="h-6 w-6 animate-spin text-salon-gold" /></div>;

  const pkg = customer.salon_packages;
  const pct = pkg ? Math.round((customer.credit_remaining / pkg.credit_inr) * 100) : 0;
  const totalSpent = pkg ? pkg.credit_inr - customer.credit_remaining : 0;

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
              <span className="font-bold text-salon-gold">₹{customer.credit_remaining.toLocaleString("en-IN")}</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-salon-gold transition-all" style={{ width: `${pct}%` }} />
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
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-white/40">Service performed</label>
              <input value={form.service_name} onChange={e => setForm(f => ({ ...f, service_name: e.target.value }))}
                placeholder="e.g. Balayage"
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/20 focus:border-salon-gold focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/40">Amount to deduct (₹)</label>
              <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                placeholder="3500"
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/20 focus:border-salon-gold focus:outline-none" />
            </div>
          </div>
          {err && <p className="mt-2 text-sm text-red-400">{err}</p>}
          {success && <p className="mt-2 text-sm text-green-400">{success}</p>}
          <button onClick={deduct} disabled={deducting || customer.credit_remaining === 0}
            className="mt-4 flex items-center gap-2 rounded-full bg-salon-gold px-5 py-2.5 text-sm font-bold text-salon-black disabled:opacity-40">
            {deducting && <Loader2 className="h-3 w-3 animate-spin" />}
            Deduct from balance
          </button>
          {customer.credit_remaining === 0 && <p className="mt-2 text-xs text-red-400">Balance exhausted — cannot deduct further.</p>}
        </div>

        {/* Transaction history */}
        <div>
          <p className="font-semibold text-white mb-3">Transaction History</p>
          {transactions.length === 0 ? (
            <p className="text-sm text-white/30">No services deducted yet.</p>
          ) : (
            <div className="space-y-2">
              {transactions.map(t => (
                <div key={t.id} className="flex items-center justify-between rounded-lg border border-white/8 bg-white/[0.02] px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">{t.service_name}</p>
                    <p className="text-xs text-white/30">
                      {new Date(t.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      {t.performed_by ? ` · ${t.performed_by}` : ""}
                    </p>
                  </div>
                  <p className="font-semibold text-red-400">−₹{t.amount_deducted.toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
