"use client";
import { useState, useEffect } from "react";
import { Loader2, Plus, Search, ArrowLeft, CreditCard, ChevronRight } from "lucide-react";
import Link from "next/link";

type Package = { id: string; name: string; price_inr: number; credit_inr: number };
type Customer = {
  id: string; name: string; phone: string; email?: string;
  credit_remaining: number; created_at: string;
  salon_packages: Package | null;
};

export default function PackageCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", package_id: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  async function load() {
    const [c, p] = await Promise.all([
      fetch("/api/admin/package-customers").then(r => r.json()),
      fetch("/api/admin/packages").then(r => r.json()),
    ]);
    setCustomers(c.customers ?? []);
    setPackages((p.packages ?? []).filter((pkg: Package & { is_active: boolean }) => pkg.is_active));
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function addCustomer() {
    setSaving(true); setErr("");
    const res = await fetch("/api/admin/package-customers", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form }),
    });
    const d = await res.json();
    if (!res.ok) { setErr(d.error ?? "Error"); setSaving(false); return; }
    setShowAdd(false); setForm({ name: "", phone: "", email: "", package_id: "", notes: "" });
    load(); setSaving(false);
  }

  const filtered = customers.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-salon-black"><Loader2 className="h-6 w-6 animate-spin text-salon-gold" /></div>;

  return (
    <main className="min-h-screen bg-salon-black px-5 py-10 md:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/admin" className="flex items-center gap-2 text-xs text-white/40 hover:text-white mb-8">
          <ArrowLeft className="h-3 w-3" /> Back to dashboard
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-salon-gold">Package Holders</p>
            <h1 className="mt-1 font-display text-4xl text-white uppercase">Customers</h1>
          </div>
          <button onClick={() => { setShowAdd(true); setErr(""); }}
            className="flex items-center gap-2 rounded-full bg-salon-gold px-5 py-2.5 text-sm font-bold text-salon-black">
            <Plus className="h-4 w-4" /> Add Customer
          </button>
        </div>

        {/* Stats bar */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          {[
            { label: "Total customers", value: customers.length },
            { label: "Total credit balance", value: `₹${customers.reduce((s, c) => s + c.credit_remaining, 0).toLocaleString("en-IN")}` },
            { label: "Active packages", value: customers.filter(c => c.credit_remaining > 0).length },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-white/8 bg-white/[0.02] p-4 text-center">
              <p className="text-xl font-bold text-salon-gold">{s.value}</p>
              <p className="mt-0.5 text-xs text-white/40">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Add customer form */}
        {showAdd && (
          <div className="mb-6 rounded-2xl border border-salon-gold/30 bg-salon-gold/5 p-6">
            <p className="mb-4 font-semibold text-white">Add Package Customer</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Full name *", key: "name", placeholder: "Priya Sharma", type: "text" },
                { label: "Phone *", key: "phone", placeholder: "+91 98765 43210", type: "tel" },
                { label: "Email", key: "email", placeholder: "priya@email.com", type: "email" },
              ].map(f => (
                <div key={f.key}>
                  <label className="mb-1 block text-xs text-white/40">{f.label}</label>
                  <input type={f.type} value={(form as Record<string, string>)[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/20 focus:border-salon-gold focus:outline-none" />
                </div>
              ))}
              <div>
                <label className="mb-1 block text-xs text-white/40">Package *</label>
                <select value={form.package_id} onChange={e => setForm(p => ({ ...p, package_id: e.target.value }))}
                  className="w-full rounded-lg border border-white/15 bg-salon-black px-3 py-2.5 text-sm text-white focus:border-salon-gold focus:outline-none">
                  <option value="">Select package</option>
                  {packages.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} — Pay ₹{pkg.price_inr.toLocaleString("en-IN")} → Get ₹{pkg.credit_inr.toLocaleString("en-IN")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-3">
              <label className="mb-1 block text-xs text-white/40">Notes (optional)</label>
              <input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                placeholder="Any notes about this customer"
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/20 focus:border-salon-gold focus:outline-none" />
            </div>
            {err && <p className="mt-2 text-sm text-red-400">{err}</p>}
            <div className="mt-4 flex gap-3">
              <button onClick={addCustomer} disabled={saving}
                className="flex items-center gap-2 rounded-full bg-salon-gold px-5 py-2 text-sm font-bold text-salon-black disabled:opacity-40">
                {saving && <Loader2 className="h-3 w-3 animate-spin" />} Add Customer
              </button>
              <button onClick={() => setShowAdd(false)} className="text-sm text-white/40 hover:text-white">Cancel</button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or phone..."
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-9 pr-4 text-sm text-white placeholder-white/25 focus:border-salon-gold focus:outline-none" />
        </div>

        {/* Customer list */}
        <div className="space-y-2">
          {filtered.map(c => {
            const pkg = c.salon_packages;
            const pct = pkg ? Math.round((c.credit_remaining / pkg.credit_inr) * 100) : 0;
            return (
              <Link key={c.id} href={`/admin/package-customers/${c.id}`}
                className="flex items-center gap-4 rounded-xl border border-white/8 bg-white/[0.02] p-4 transition hover:border-salon-gold/30 hover:bg-white/[0.04]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-salon-gold/10 text-salon-gold font-bold text-sm flex-shrink-0">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white truncate">{c.name}</p>
                    {c.credit_remaining === 0 && <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] text-red-400">Exhausted</span>}
                  </div>
                  <p className="text-xs text-white/40">{c.phone} {pkg && `· ${pkg.name}`}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-salon-gold">₹{c.credit_remaining.toLocaleString("en-IN")}</p>
                  <p className="text-xs text-white/30">{pct}% left</p>
                </div>
                <ChevronRight className="h-4 w-4 text-white/20 flex-shrink-0" />
              </Link>
            );
          })}
          {filtered.length === 0 && (
            <div className="rounded-xl border border-white/8 p-10 text-center text-white/30">
              {search ? "No customers match your search." : "No package customers yet."}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
