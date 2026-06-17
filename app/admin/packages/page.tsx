"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Pencil, ToggleLeft, ToggleRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Package = {
  id: string; name: string; price_inr: number; credit_inr: number;
  is_active: boolean; created_at: string;
};

export default function PackagesPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Package | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", price_inr: "", credit_inr: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  async function load() {
    const res = await fetch("/api/admin/packages");
    if (res.status === 403) { router.push("/admin"); return; }
    const d = await res.json();
    setPackages(d.packages ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openEdit(pkg: Package) {
    setEditing(pkg);
    setForm({ name: pkg.name, price_inr: String(pkg.price_inr), credit_inr: String(pkg.credit_inr) });
    setShowNew(false); setErr("");
  }
  function openNew() {
    setEditing(null); setShowNew(true);
    setForm({ name: "", price_inr: "", credit_inr: "" }); setErr("");
  }

  async function save() {
    setSaving(true); setErr("");
    const body = { name: form.name, price_inr: Number(form.price_inr), credit_inr: Number(form.credit_inr) };
    const res = editing
      ? await fetch(`/api/admin/packages/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      : await fetch("/api/admin/packages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const d = await res.json();
    if (!res.ok) { setErr(d.error ?? "Error"); setSaving(false); return; }
    setEditing(null); setShowNew(false); load();
    setSaving(false);
  }

  async function toggle(pkg: Package) {
    await fetch(`/api/admin/packages/${pkg.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !pkg.is_active }),
    });
    load();
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-salon-black"><Loader2 className="h-6 w-6 animate-spin text-salon-gold" /></div>;

  return (
    <main className="min-h-screen bg-salon-black px-5 py-10 md:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/admin" className="flex items-center gap-2 text-xs text-white/40 hover:text-white mb-8">
          <ArrowLeft className="h-3 w-3" /> Back to dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-salon-gold">Core Admin</p>
            <h1 className="mt-1 font-display text-4xl text-white uppercase">Package Management</h1>
            <p className="mt-1 text-sm text-white/40">Define prepaid credit packages for customers</p>
          </div>
          <button onClick={openNew}
            className="flex items-center gap-2 rounded-full bg-salon-gold px-5 py-2.5 text-sm font-bold text-salon-black">
            <Plus className="h-4 w-4" /> New Package
          </button>
        </div>

        {/* Create / Edit form */}
        {(showNew || editing) && (
          <div className="mb-8 rounded-2xl border border-salon-gold/30 bg-salon-gold/5 p-6">
            <p className="mb-4 font-semibold text-white">{editing ? "Edit Package" : "Create Package"}</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs text-white/40">Package name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Gold Package"
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/20 focus:border-salon-gold focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/40">Money charged (₹)</label>
                <input type="number" value={form.price_inr} onChange={e => setForm(f => ({ ...f, price_inr: e.target.value }))}
                  placeholder="20000"
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/20 focus:border-salon-gold focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/40">Credit value (₹)</label>
                <input type="number" value={form.credit_inr} onChange={e => setForm(f => ({ ...f, credit_inr: e.target.value }))}
                  placeholder="30000"
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/20 focus:border-salon-gold focus:outline-none" />
              </div>
            </div>
            {form.price_inr && form.credit_inr && Number(form.credit_inr) > Number(form.price_inr) && (
              <p className="mt-2 text-xs text-salon-gold">
                Customer gets ₹{(Number(form.credit_inr) - Number(form.price_inr)).toLocaleString("en-IN")} bonus value
                ({Math.round(((Number(form.credit_inr) / Number(form.price_inr)) - 1) * 100)}% extra)
              </p>
            )}
            {err && <p className="mt-2 text-sm text-red-400">{err}</p>}
            <div className="mt-4 flex gap-3">
              <button onClick={save} disabled={saving}
                className="flex items-center gap-2 rounded-full bg-salon-gold px-5 py-2 text-sm font-bold text-salon-black disabled:opacity-40">
                {saving && <Loader2 className="h-3 w-3 animate-spin" />}
                {editing ? "Save changes" : "Create package"}
              </button>
              <button onClick={() => { setEditing(null); setShowNew(false); }}
                className="text-sm text-white/40 hover:text-white">Cancel</button>
            </div>
          </div>
        )}

        {/* Package list */}
        <div className="space-y-3">
          {packages.map(pkg => (
            <div key={pkg.id}
              className={`flex items-center gap-4 rounded-xl border p-4 transition ${pkg.is_active ? "border-white/8 bg-white/[0.02]" : "border-white/4 bg-white/[0.01] opacity-50"}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-white">{pkg.name}</p>
                  {!pkg.is_active && <span className="text-xs text-white/30">(inactive)</span>}
                </div>
                <div className="mt-1 flex items-center gap-4 text-sm">
                  <span className="text-white/50">Pay <span className="text-white">₹{pkg.price_inr.toLocaleString("en-IN")}</span></span>
                  <span className="text-white/30">→</span>
                  <span className="text-white/50">Get <span className="text-salon-gold font-semibold">₹{pkg.credit_inr.toLocaleString("en-IN")}</span> in credits</span>
                  <span className="text-xs text-green-400">+{Math.round(((pkg.credit_inr / pkg.price_inr) - 1) * 100)}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(pkg)} className="rounded-lg p-2 text-white/40 hover:bg-white/5 hover:text-white">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => toggle(pkg)} className="rounded-lg p-2 text-white/40 hover:bg-white/5 hover:text-white">
                  {pkg.is_active ? <ToggleRight className="h-4 w-4 text-green-400" /> : <ToggleLeft className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))}
          {packages.length === 0 && (
            <div className="rounded-xl border border-white/8 p-10 text-center text-white/30">
              No packages yet. Create your first one above.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
