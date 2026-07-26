"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Plus, ToggleLeft, ToggleRight, ShoppingBag, CheckCircle2 } from "lucide-react";

type Product = { id: string; name: string; category?: string; price: number; is_active: boolean };
type Emp = { id: string; name: string };
type Match = { id: string; name: string; phone: string };
type Sale = { id: string; product_name: string; quantity: number; total_amount: number; payment_mode: string; employee_name?: string; customer_name?: string; is_gst: boolean; created_at: string };

const INR = (v: number) => `₹${(v ?? 0).toLocaleString("en-IN")}`;
const PAY_MODES = ["cash", "card", "upi", "wallet"];
const inp = "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/25 focus:border-salon-gold focus:outline-none";

export function ProductsTab({ role }: { role: "core" | "staff" | null }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [employees, setEmployees] = useState<Emp[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  // sale form
  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState("1");
  const [unitPrice, setUnitPrice] = useState("");
  const [empId, setEmpId] = useState("");
  const [payMode, setPayMode] = useState("cash");
  const [isGst, setIsGst] = useState(false);
  const [gstRate, setGstRate] = useState("18");
  const [discType, setDiscType] = useState<"none" | "percent" | "amount">("none");
  const [discVal, setDiscVal] = useState("");
  const [q, setQ] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [cust, setCust] = useState({ id: undefined as string | undefined, name: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  // master form (core)
  const [pForm, setPForm] = useState({ name: "", category: "", price: "" });
  const [pSaving, setPSaving] = useState(false);

  const load = useCallback(async () => {
    const [p, e, s] = await Promise.all([
      fetch("/api/admin/products").then((r) => r.json()),
      fetch("/api/admin/employees?active=1").then((r) => r.json()),
      fetch("/api/admin/product-sales").then((r) => r.json()),
    ]);
    setProducts(p.products ?? []); setEmployees(e.employees ?? []); setSales(s.sales ?? []); setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (q.trim().length < 2) { setMatches([]); return; }
    const t = setTimeout(() => fetch(`/api/admin/customers/search?q=${encodeURIComponent(q)}`).then((r) => r.json()).then((d) => setMatches(d.customers ?? [])), 250);
    return () => clearTimeout(t);
  }, [q]);

  const activeProducts = products.filter((p) => p.is_active);
  const product = products.find((p) => p.id === productId);
  const unit = Number(unitPrice || product?.price || 0);
  const gross = unit * Number(qty || 1);
  const disc = discType === "percent" ? Math.round((gross * Number(discVal || 0)) / 100) : discType === "amount" ? Math.round(Number(discVal || 0)) : 0;
  const taxable = Math.max(0, gross - Math.min(disc, gross));
  const tax = isGst ? Math.round((taxable * Number(gstRate || 0)) / 100) : 0;
  const total = taxable + tax;

  function pickProduct(id: string) { setProductId(id); const p = products.find((x) => x.id === id); if (p) setUnitPrice(String(p.price)); }

  async function submitSale() {
    if (!productId) { setErr("Pick a product"); return; }
    if (!empId) { setErr("Pick who sold it"); return; }
    setSaving(true); setErr(""); setOk("");
    const res = await fetch("/api/admin/product-sales", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: productId, product_name: product?.name, menu_price: product?.price,
        quantity: Number(qty || 1), unit_price: unit,
        employee_id: empId, employee_name: employees.find((e) => e.id === empId)?.name,
        customer_id: cust.id, customer_name: cust.name || null, customer_phone: cust.phone || null,
        payment_mode: payMode, is_gst: isGst, gst_rate: Number(gstRate || 0),
        discount_type: discType, discount_value: Number(discVal || 0),
      }),
    });
    const d = await res.json(); setSaving(false);
    if (!res.ok) { setErr(d.error ?? "Error"); return; }
    setOk(`Sold · ${INR(d.total_amount)}`);
    setProductId(""); setQty("1"); setUnitPrice(""); setDiscVal(""); setDiscType("none"); setCust({ id: undefined, name: "", phone: "" });
    load();
  }

  async function addProduct() {
    if (!pForm.name.trim()) return;
    setPSaving(true);
    await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: pForm.name, category: pForm.category, price: Number(pForm.price || 0) }) });
    setPForm({ name: "", category: "", price: "" }); setPSaving(false); load();
  }
  async function toggleProduct(p: Product) {
    await fetch(`/api/admin/products/${p.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_active: !p.is_active }) });
    load();
  }

  if (loading) return <div className="flex items-center gap-2 py-16 text-white/40"><Loader2 className="h-4 w-4 animate-spin" />Loading…</div>;

  return (
    <div>
      {/* Log a product sale */}
      <div className="mb-8 rounded-2xl border border-white/8 bg-white/[0.02] p-5">
        <p className="mb-4 flex items-center gap-2 text-sm font-medium text-white"><ShoppingBag className="h-4 w-4 text-salon-gold" /> Sell a product</p>
        {activeProducts.length === 0 ? (
          <p className="text-sm text-white/40">No active products yet.{role === "core" ? " Add one below." : " Ask the owner to add products."}</p>
        ) : (
          <>
            <div className="grid gap-2 sm:grid-cols-2">
              <select value={productId} onChange={(e) => pickProduct(e.target.value)} className={inp}>
                <option value="">Product…</option>
                {activeProducts.map((p) => <option key={p.id} value={p.id}>{p.name} — {INR(p.price)}</option>)}
              </select>
              <select value={empId} onChange={(e) => setEmpId(e.target.value)} className={inp}>
                <option value="">Sold by…</option>
                {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
              <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="Qty" className={inp} />
              <input type="number" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} placeholder="Unit price ₹" className={inp} />
            </div>

            {/* customer (optional) */}
            <div className="relative mt-2">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Customer (optional) — search…" className={inp} />
              {matches.length > 0 && (
                <div className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-white/15 bg-zinc-900">
                  {matches.map((m) => (
                    <button key={m.id} onClick={() => { setCust({ id: m.id, name: m.name, phone: m.phone }); setMatches([]); setQ(`${m.name} · ${m.phone}`); }} className="block w-full px-3 py-2 text-left text-sm text-white/80 hover:bg-white/5">{m.name} · {m.phone}</button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-2 grid gap-2 sm:grid-cols-4">
              <select value={payMode} onChange={(e) => setPayMode(e.target.value)} className={inp}>{PAY_MODES.map((m) => <option key={m} value={m}>{m.toUpperCase()}</option>)}</select>
              <select value={discType} onChange={(e) => setDiscType(e.target.value as any)} className={inp}><option value="none">No disc.</option><option value="percent">Disc %</option><option value="amount">Disc ₹</option></select>
              {discType !== "none" ? <input type="number" value={discVal} onChange={(e) => setDiscVal(e.target.value)} placeholder="Value" className={inp} /> : <div />}
              <label className="flex items-center gap-2 text-xs text-white/50"><input type="checkbox" checked={isGst} onChange={(e) => setIsGst(e.target.checked)} className="h-3.5 w-3.5 accent-salon-gold" /> GST{isGst && <input type="number" value={gstRate} onChange={(e) => setGstRate(e.target.value)} className="w-14 rounded border border-white/15 bg-white/5 px-1 py-0.5 text-white" />}</label>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-lg border border-salon-gold/25 bg-salon-gold/5 px-4 py-2 text-sm">
              <span className="text-white/60">Total{isGst ? " (incl. GST)" : ""}</span>
              <span className="font-bold text-salon-gold">{INR(total)}</span>
            </div>
            {err && <p className="mt-2 text-sm text-red-400">{err}</p>}
            {ok && <p className="mt-2 flex items-center gap-2 text-sm text-green-400"><CheckCircle2 className="h-4 w-4" />{ok}</p>}
            <button onClick={submitSale} disabled={saving} className="mt-3 flex items-center gap-2 rounded-full bg-salon-gold px-5 py-2 text-sm font-bold text-salon-black disabled:opacity-50">{saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Log sale</button>
          </>
        )}
      </div>

      {/* Master management (core only) */}
      {role === "core" && (
        <div className="mb-8 rounded-2xl border border-white/8 bg-white/[0.02] p-5">
          <p className="mb-3 flex items-center gap-2 text-sm font-medium text-white"><Plus className="h-4 w-4 text-salon-gold" /> Manage products</p>
          <div className="grid gap-2 sm:grid-cols-4">
            <input value={pForm.name} onChange={(e) => setPForm((f) => ({ ...f, name: e.target.value }))} placeholder="Name *" className={`${inp} sm:col-span-2`} />
            <input value={pForm.category} onChange={(e) => setPForm((f) => ({ ...f, category: e.target.value }))} placeholder="Category" className={inp} />
            <input type="number" value={pForm.price} onChange={(e) => setPForm((f) => ({ ...f, price: e.target.value }))} placeholder="Price ₹" className={inp} />
          </div>
          <button onClick={addProduct} disabled={pSaving} className="mt-3 rounded-full bg-salon-gold px-5 py-2 text-sm font-bold text-salon-black disabled:opacity-50">Add product</button>
          <div className="mt-4 space-y-1.5">
            {products.map((p) => (
              <div key={p.id} className={`flex items-center justify-between rounded-lg border border-white/8 px-4 py-2 text-sm ${p.is_active ? "" : "opacity-50"}`}>
                <span className="text-white/80">{p.name} <span className="text-white/30">{p.category ? `· ${p.category}` : ""} · {INR(p.price)}</span></span>
                <button onClick={() => toggleProduct(p)} className="text-white/40 hover:text-white">{p.is_active ? <ToggleRight className="h-5 w-5 text-salon-gold" /> : <ToggleLeft className="h-5 w-5" />}</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent product sales */}
      <p className="mb-3 text-xs uppercase tracking-wider text-salon-gold">Recent product sales</p>
      {sales.length === 0 ? <p className="text-sm text-white/30">No product sales yet.</p> : (
        <div className="overflow-x-auto rounded-lg border border-white/8">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-wider text-white/40"><tr><th className="px-4 py-2">Product</th><th className="px-4 py-2">Qty</th><th className="px-4 py-2">Total</th><th className="px-4 py-2">Sold by</th><th className="px-4 py-2">Paid</th></tr></thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.id} className="border-t border-white/5">
                  <td className="px-4 py-2 text-white/80">{s.product_name}</td>
                  <td className="px-4 py-2 text-white/50">{s.quantity}</td>
                  <td className="px-4 py-2 font-semibold text-salon-gold">{INR(s.total_amount)}</td>
                  <td className="px-4 py-2 text-white/50">{s.employee_name ?? "—"}</td>
                  <td className="px-4 py-2 capitalize text-white/40">{s.payment_mode}{s.is_gst ? " · GST" : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
