"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Trash2, X, CheckCircle2 } from "lucide-react";
import { computeTicketMoney } from "@/lib/sales";

type Emp = { id: string; name: string };
type Pkg = { id: string; name: string; credit_remaining: number };
type Match = { id: string; name: string; phone: string; gender?: string; packages: Pkg[] };
type Line = { service_name: string; category: string; menu_price: string; charged_price: string; employee_id: string; package_id: string };

const CATEGORIES = ["Haircut", "Colour", "Highlights", "Treatment", "Hair Spa", "Blow Dry", "Styling", "Facial", "Manicure", "Pedicure", "Threading", "Waxing", "Massage", "Other"];
const PAY_MODES = ["cash", "card", "upi", "wallet"];
const INR = (v: number) => `₹${v.toLocaleString("en-IN")}`;
const inp = "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/25 focus:border-salon-gold focus:outline-none";

function blankLine(pref?: Partial<Line>): Line {
  return { service_name: "", category: "Haircut", menu_price: "", charged_price: "", employee_id: "", package_id: "", ...pref };
}

export function TicketFormModal({ prefill, onClose, onSaved }: { prefill?: any; onClose: () => void; onSaved: () => void }) {
  const [employees, setEmployees] = useState<Emp[]>([]);
  const [cust, setCust] = useState({ id: undefined as string | undefined, name: prefill?.customer_name ?? "", phone: prefill?.customer_phone ?? "", gender: "", packages: [] as Pkg[] });
  const [q, setQ] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [saleAt, setSaleAt] = useState(() => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16));
  const [lines, setLines] = useState<Line[]>([blankLine({ service_name: prefill?.service_name ?? "" })]);
  const [discountType, setDiscountType] = useState<"none" | "percent" | "amount">("none");
  const [discountValue, setDiscountValue] = useState("");
  const [isGst, setIsGst] = useState(false);
  const [gstRate, setGstRate] = useState("18");
  const [payMode, setPayMode] = useState("cash");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => { fetch("/api/admin/employees?active=1").then((r) => r.json()).then((d) => setEmployees(d.employees ?? [])); }, []);
  useEffect(() => {
    if (q.trim().length < 2) { setMatches([]); return; }
    const t = setTimeout(() => fetch(`/api/admin/customers/search?q=${encodeURIComponent(q)}`).then((r) => r.json()).then((d) => setMatches(d.customers ?? [])), 250);
    return () => clearTimeout(t);
  }, [q]);

  const charged = lines.map((l) => Number(l.charged_price || l.menu_price || 0));
  const money = computeTicketMoney({ chargedPrices: charged, discount_type: discountType, discount_value: Number(discountValue || 0), is_gst: isGst, gst_rate: Number(gstRate || 0) });
  const packagePaid = lines.reduce((s, l) => {
    if (!l.package_id) return s;
    const bal = cust.packages.find((p) => p.id === l.package_id)?.credit_remaining ?? 0;
    return s + Math.min(Number(l.charged_price || l.menu_price || 0), bal);
  }, 0);
  const owed = Math.max(0, money.grand_total - packagePaid);

  const setLine = (i: number, k: keyof Line, v: string) => setLines((ls) => ls.map((l, idx) => (idx === i ? { ...l, [k]: v } : l)));

  async function submit() {
    if (!cust.name.trim()) { setErr("Customer name is required"); return; }
    const items = lines
      .filter((l) => l.service_name.trim() && (l.menu_price || l.charged_price))
      .map((l) => ({
        service_name: l.service_name.trim(),
        category: l.category,
        menu_price: Number(l.menu_price || l.charged_price),
        charged_price: Number(l.charged_price || l.menu_price),
        employee_id: l.employee_id || null,
        employee_name: employees.find((e) => e.id === l.employee_id)?.name ?? null,
        package: l.package_id ? { customer_package_id: l.package_id, service_name: l.service_name.trim() } : undefined,
      }));
    if (items.length === 0) { setErr("Add at least one service with a price"); return; }
    setSaving(true); setErr("");
    const payments: Record<string, number> = { cash: 0, card: 0, upi: 0, wallet: 0 };
    payments[payMode] = owed;
    const res = await fetch("/api/admin/tickets", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        booking_id: prefill?.booking_id ?? null,
        customer: { id: cust.id, name: cust.name, phone: cust.phone, gender: cust.gender },
        sale_at: new Date(saleAt).toISOString(),
        is_gst: isGst, gst_rate: Number(gstRate || 0),
        discount: { type: discountType, value: Number(discountValue || 0) },
        items, payments,
      }),
    });
    const d = await res.json(); setSaving(false);
    if (!res.ok) { setErr(d.error ?? "Error saving"); return; }
    setOk(`Saved · ${d.invoice_number} · ${INR(d.grand_total)}`);
    onSaved();
    setTimeout(onClose, 1000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div className="my-6 w-full max-w-2xl rounded-2xl border border-white/10 bg-salon-black p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl uppercase text-white">Log a Sale</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        {/* Customer */}
        <div className="relative rounded-xl border border-white/8 bg-white/[0.02] p-4">
          <label className="mb-1 block text-xs text-white/40">Customer — search by phone or name</label>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type to search existing customers…" className={inp} />
          {matches.length > 0 && (
            <div className="absolute z-10 mt-1 max-h-52 w-[calc(100%-2rem)] overflow-y-auto rounded-lg border border-white/15 bg-zinc-900 shadow-xl">
              {matches.map((m) => (
                <button key={m.id} onClick={() => { setCust({ id: m.id, name: m.name, phone: m.phone, gender: m.gender ?? "", packages: m.packages ?? [] }); setMatches([]); setQ(""); }}
                  className="block w-full px-3 py-2 text-left text-sm text-white/80 hover:bg-white/5">
                  {m.name} · {m.phone}{m.packages?.length ? ` · ${m.packages.length} pkg` : ""}
                </button>
              ))}
            </div>
          )}
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <input value={cust.name} onChange={(e) => setCust((c) => ({ ...c, id: undefined, name: e.target.value }))} placeholder="Name *" className={inp} />
            <input value={cust.phone} onChange={(e) => setCust((c) => ({ ...c, id: undefined, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))} placeholder="Phone" className={inp} />
            <select value={cust.gender} onChange={(e) => setCust((c) => ({ ...c, gender: e.target.value }))} className={inp}>
              <option value="">Gender</option><option>male</option><option>female</option><option>other</option>
            </select>
          </div>
          {cust.packages.length > 0 && <p className="mt-2 text-xs text-salon-gold">Active packages: {cust.packages.map((p) => `${p.name} (${INR(p.credit_remaining)})`).join(", ")}</p>}
        </div>

        {/* Line items */}
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-white">Services</p>
            <button onClick={() => setLines((ls) => [...ls, blankLine()])} className="flex items-center gap-1 text-xs text-salon-gold hover:brightness-110"><Plus className="h-3 w-3" /> Add service</button>
          </div>
          <div className="space-y-2">
            {lines.map((l, i) => (
              <div key={i} className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
                <div className="grid gap-2 sm:grid-cols-2">
                  <input value={l.service_name} onChange={(e) => setLine(i, "service_name", e.target.value)} placeholder="Service *" className={inp} />
                  <select value={l.category} onChange={(e) => setLine(i, "category", e.target.value)} className={inp}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  <input type="number" value={l.menu_price} onChange={(e) => setLine(i, "menu_price", e.target.value)} placeholder="Menu price ₹" className={inp} />
                  <input type="number" value={l.charged_price} onChange={(e) => setLine(i, "charged_price", e.target.value)} placeholder="Charged (= menu)" className={inp} />
                  <select value={l.employee_id} onChange={(e) => setLine(i, "employee_id", e.target.value)} className={inp}>
                    <option value="">Stylist…</option>
                    {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                </div>
                {cust.packages.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <select value={l.package_id} onChange={(e) => setLine(i, "package_id", e.target.value)} className={`${inp} text-xs`}>
                      <option value="">Pay by cash/card</option>
                      {cust.packages.map((p) => <option key={p.id} value={p.id}>Redeem: {p.name} ({INR(p.credit_remaining)})</option>)}
                    </select>
                    {lines.length > 1 && <button onClick={() => setLines((ls) => ls.filter((_, idx) => idx !== i))} className="text-white/30 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>}
                  </div>
                )}
                {cust.packages.length === 0 && lines.length > 1 && (
                  <button onClick={() => setLines((ls) => ls.filter((_, idx) => idx !== i))} className="mt-2 text-xs text-white/30 hover:text-red-400">Remove</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Discount + GST + payment + date */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-white/8 p-3">
            <label className="mb-1 block text-xs text-white/40">Discount</label>
            <div className="flex gap-2">
              <select value={discountType} onChange={(e) => setDiscountType(e.target.value as any)} className={inp}>
                <option value="none">None</option><option value="percent">%</option><option value="amount">₹</option>
              </select>
              {discountType !== "none" && <input type="number" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} placeholder="Value" className={inp} />}
            </div>
          </div>
          <div className="rounded-lg border border-white/8 p-3">
            <label className="mb-1 flex items-center gap-2 text-xs text-white/40">
              <input type="checkbox" checked={isGst} onChange={(e) => setIsGst(e.target.checked)} className="h-3.5 w-3.5 accent-salon-gold" /> GST bill
            </label>
            {isGst && <input type="number" value={gstRate} onChange={(e) => setGstRate(e.target.value)} placeholder="GST %" className={inp} />}
          </div>
          <div className="rounded-lg border border-white/8 p-3">
            <label className="mb-1 block text-xs text-white/40">Balance paid by</label>
            <select value={payMode} onChange={(e) => setPayMode(e.target.value)} className={inp}>
              {PAY_MODES.map((m) => <option key={m} value={m}>{m.toUpperCase()}</option>)}
            </select>
          </div>
          <div className="rounded-lg border border-white/8 p-3">
            <label className="mb-1 block text-xs text-white/40">Date &amp; time</label>
            <input type="datetime-local" value={saleAt} onChange={(e) => setSaleAt(e.target.value)} className={`${inp} [color-scheme:dark]`} />
          </div>
        </div>

        {/* Totals */}
        <div className="mt-4 rounded-lg border border-salon-gold/25 bg-salon-gold/5 p-4 text-sm">
          <div className="flex justify-between text-white/60"><span>Subtotal</span><span>{INR(money.subtotal)}</span></div>
          {money.discount_amount > 0 && <div className="flex justify-between text-white/60"><span>Discount</span><span>−{INR(money.discount_amount)}</span></div>}
          {isGst && <div className="flex justify-between text-white/60"><span>GST (CGST {INR(money.cgst_amount)} + SGST {INR(money.sgst_amount)})</span><span>{INR(money.tax_amount)}</span></div>}
          {packagePaid > 0 && <div className="flex justify-between text-salon-gold"><span>From package</span><span>−{INR(packagePaid)}</span></div>}
          <div className="mt-1 flex justify-between border-t border-white/10 pt-1 text-base font-bold text-white"><span>To collect ({payMode.toUpperCase()})</span><span>{INR(owed)}</span></div>
        </div>

        {err && <p className="mt-3 text-sm text-red-400">{err}</p>}
        {ok && <p className="mt-3 flex items-center gap-2 text-sm text-green-400"><CheckCircle2 className="h-4 w-4" /> {ok}</p>}

        <button onClick={submit} disabled={saving} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-salon-gold py-3 text-sm font-bold uppercase tracking-wider text-salon-black disabled:opacity-50">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save sale
        </button>
      </div>
    </div>
  );
}
