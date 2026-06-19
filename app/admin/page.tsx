"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Loader2, RefreshCw, X, Plus, Users, CalendarDays, UserPlus, LogOut,
  ChevronDown, ChevronUp, Megaphone, Send, Clock, CheckCircle2, XCircle,
  FileText, BarChart3, Edit2, Crown, Trash2, Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";

// ── Types ─────────────────────────────────────────────────────────────────────
type Booking = {
  id: string; client_name: string; client_phone: string; client_email?: string;
  booking_date: string; booking_time: string; status: string;
  discount_percent: number; whatsapp_notified: boolean;
  notes?: string; service_name?: string; stylist_name?: string;
};
type Customer = {
  id: string; name: string; phone: string; email?: string;
  total_bookings: number; last_service?: string; last_visit_date?: string;
  preferred_stylist?: string; tags?: string[]; whatsapp_opted_in: boolean;
  membership: boolean; membership_tier?: string;
  membership_since?: string; membership_expires?: string;
  created_at: string;
};
type InvoiceItem = { name: string; qty: number; unit_price: number };
type Invoice = {
  id: string; invoice_number: string; customer_name: string; customer_phone?: string;
  items: InvoiceItem[]; subtotal: number; discount_percent: number;
  discount_amount: number; total: number; payment_method: string;
  status: string; notes?: string; invoice_date: string; created_at: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending:   "text-yellow-400 border-yellow-400/30 bg-yellow-400/5",
  confirmed: "text-green-400  border-green-400/30  bg-green-400/5",
  cancelled: "text-red-400    border-red-400/30    bg-red-400/5",
  completed: "text-white/40   border-white/10      bg-white/5",
};

const MEMBERSHIP_COLORS: Record<string, string> = {
  Silver:   "text-gray-300  border-gray-400/40  bg-gray-400/8",
  Gold:     "text-salon-gold border-salon-gold/40 bg-salon-gold/8",
  Platinum: "text-purple-300 border-purple-400/40 bg-purple-400/8",
};

const INR = (v: number) => `₹${v.toLocaleString("en-IN")}`;
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

// ── Edit Customer Modal ───────────────────────────────────────────────────────
function EditCustomerModal({ customer, onClose, onSaved }: { customer: Customer; onClose: () => void; onSaved: () => void }) {
  const genderFromTags = customer.tags?.find(t => ["male","female","other"].includes(t)) ?? "";
  const [form, setForm] = useState({
    name: customer.name ?? "",
    phone: customer.phone ?? "",
    email: customer.email ?? "",
    gender: genderFromTags,
    last_service: customer.last_service ?? "",
    preferred_stylist: customer.preferred_stylist ?? "",
    membership: customer.membership ?? false,
    membership_tier: customer.membership_tier ?? "",
    membership_since: customer.membership_since ?? "",
    membership_expires: customer.membership_expires ?? "",
    whatsapp_opted_in: customer.whatsapp_opted_in ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    if (!form.name || !form.phone) { setError("Name and phone are required"); return; }
    setSaving(true); setError("");
    try {
      const res = await fetch(`/api/customers/${customer.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error ?? "Failed");
      onSaved(); onClose();
    } catch (e) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setSaving(false); }
  }

  const inp = "w-full rounded-lg border border-white/18 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-salon-gold focus:outline-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-2xl border border-white/8 bg-[#0e0d0b] p-6 max-h-[90svh] overflow-y-auto">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-2xl">Edit Customer</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-3">
          {/* Gender */}
          <div className="grid grid-cols-3 gap-2">
            {["Male","Female","Other"].map(g => (
              <button key={g} onClick={() => setForm(f=>({...f,gender:g}))}
                className={`rounded-lg border py-2 text-sm transition ${form.gender===g?"border-salon-gold bg-salon-gold/10 text-salon-gold":"border-white/18 text-white/50 hover:border-white/40"}`}>
                {g}
              </button>
            ))}
          </div>
          <input placeholder="Full name *" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} className={inp} />
          <input placeholder="Phone *" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value.replace(/\D/g,"").slice(0,10)}))} className={inp} type="tel" />
          <input placeholder="Email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} className={inp} type="email" />
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="Last service" value={form.last_service} onChange={e=>setForm(f=>({...f,last_service:e.target.value}))} className={inp} />
            <input placeholder="Preferred stylist" value={form.preferred_stylist} onChange={e=>setForm(f=>({...f,preferred_stylist:e.target.value}))} className={inp} />
          </div>

          {/* Membership */}
          <div className="rounded-xl border border-white/8 bg-white/3 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-salon-gold" />
                <p className="text-sm font-medium">Membership</p>
              </div>
              <button onClick={() => setForm(f=>({...f, membership: !f.membership, membership_tier: !f.membership ? "Silver" : ""}))}
                className={`relative h-6 w-11 rounded-full transition-colors ${form.membership ? "bg-salon-gold" : "bg-white/20"}`}>
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${form.membership ? "left-5.5 translate-x-0.5" : "left-0.5"}`} />
              </button>
            </div>
            {form.membership && (
              <div className="mt-3 space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  {["Silver","Gold","Platinum"].map(t => (
                    <button key={t} onClick={() => setForm(f=>({...f,membership_tier:t}))}
                      className={`rounded-lg border py-1.5 text-xs font-medium transition ${form.membership_tier===t ? MEMBERSHIP_COLORS[t] : "border-white/18 text-white/40 hover:border-white/40"}`}>
                      {t}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-xs text-white/40">Since</label>
                    <input type="date" value={form.membership_since} onChange={e=>setForm(f=>({...f,membership_since:e.target.value}))} className={`${inp} [color-scheme:dark]`} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-white/40">Expires</label>
                    <input type="date" value={form.membership_expires} onChange={e=>setForm(f=>({...f,membership_expires:e.target.value}))} className={`${inp} [color-scheme:dark]`} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* WhatsApp opt-in */}
          <div className="flex items-center justify-between rounded-lg border border-white/8 px-4 py-3">
            <p className="text-sm text-white/60">WhatsApp opted in</p>
            <button onClick={() => setForm(f=>({...f,whatsapp_opted_in:!f.whatsapp_opted_in}))}
              className={`relative h-6 w-11 rounded-full transition-colors ${form.whatsapp_opted_in ? "bg-green-500" : "bg-white/20"}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${form.whatsapp_opted_in ? "left-5.5 translate-x-0.5" : "left-0.5"}`} />
            </button>
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <div className="mt-5 flex justify-end gap-3">
          <button onClick={onClose} className="text-sm text-white/40 hover:text-white">Cancel</button>
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 rounded-full bg-salon-gold px-5 py-2 text-sm font-bold text-salon-black hover:brightness-110 disabled:opacity-40">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Add Customer Modal ────────────────────────────────────────────────────────
function AddCustomerModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", last_service: "", preferred_stylist: "", gender: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const inp = "w-full rounded-lg border border-white/18 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-salon-gold focus:outline-none";

  async function save() {
    if (!form.name || !form.phone) { setError("Name and phone required"); return; }
    if (form.phone.replace(/\D/g,"").length !== 10) { setError("Phone must be 10 digits"); return; }
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/customers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error ?? "Failed");
      onSaved(); onClose();
    } catch (e) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/8 bg-[#0e0d0b] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl">Add Customer</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {["Male","Female","Other"].map(g => (
              <button key={g} onClick={() => setForm(f=>({...f,gender:g}))}
                className={`rounded-lg border py-2 text-sm transition ${form.gender===g?"border-salon-gold bg-salon-gold/10 text-salon-gold":"border-white/18 text-white/50"}`}>
                {g}
              </button>
            ))}
          </div>
          <input placeholder="Full name *" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} className={inp} />
          <input placeholder="WhatsApp (10 digits) *" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value.replace(/\D/g,"").slice(0,10)}))} className={inp} type="tel" />
          <input placeholder="Email (optional)" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} className={inp} type="email" />
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="Last service" value={form.last_service} onChange={e=>setForm(f=>({...f,last_service:e.target.value}))} className={inp} />
            <input placeholder="Preferred stylist" value={form.preferred_stylist} onChange={e=>setForm(f=>({...f,preferred_stylist:e.target.value}))} className={inp} />
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <div className="mt-5 flex justify-end gap-3">
          <button onClick={onClose} className="text-sm text-white/40 hover:text-white">Cancel</button>
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 rounded-full bg-salon-gold px-5 py-2 text-sm font-bold text-salon-black hover:brightness-110 disabled:opacity-40">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />} Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Create Invoice Modal ──────────────────────────────────────────────────────
function CreateInvoiceModal({ customers, onClose, onSaved }: { customers: Customer[]; onClose: () => void; onSaved: () => void }) {
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [manualName, setManualName] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([{ name: "", qty: 1, unit_price: 0 }]);
  const [discount, setDiscount] = useState(0);
  const [payMethod, setPayMethod] = useState("cash");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filteredC = customers.filter(c =>
    customerSearch && (c.name?.toLowerCase().includes(customerSearch.toLowerCase()) || c.phone?.includes(customerSearch))
  ).slice(0, 5);

  const subtotal = items.reduce((s, i) => s + i.qty * i.unit_price, 0);
  const discAmt = Math.round(subtotal * discount / 100);
  const total = subtotal - discAmt;

  function setItem(idx: number, field: keyof InvoiceItem, val: string | number) {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, [field]: field === "name" ? val : Number(val) } : it));
  }

  async function save() {
    const name = selectedCustomer?.name ?? manualName;
    const phone = selectedCustomer?.phone ?? manualPhone;
    if (!name) { setError("Customer name required"); return; }
    if (items.some(i => !i.name || i.unit_price <= 0)) { setError("All items need a name and price"); return; }
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/invoices", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: selectedCustomer?.id ?? null,
          customer_name: name, customer_phone: phone,
          items, discount_percent: discount,
          payment_method: payMethod, status: "paid",
          notes, invoice_date: invoiceDate,
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error ?? "Failed");
      onSaved(); onClose();
    } catch (e) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setSaving(false); }
  }

  const inp = "w-full rounded-lg border border-white/18 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:border-salon-gold focus:outline-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-white/8 bg-[#0e0d0b] p-6 max-h-[92svh] overflow-y-auto">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-2xl">New Invoice</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        {/* Customer selection */}
        <div className="mb-4">
          <label className="mb-1 block text-xs text-white/40">Customer</label>
          {selectedCustomer ? (
            <div className="flex items-center justify-between rounded-lg border border-salon-gold/30 bg-salon-gold/5 px-4 py-2.5">
              <div>
                <p className="text-sm font-medium">{selectedCustomer.name}</p>
                <p className="text-xs text-white/40">{selectedCustomer.phone}</p>
              </div>
              <button onClick={() => { setSelectedCustomer(null); setCustomerSearch(""); }} className="text-xs text-white/40 hover:text-white">Change</button>
            </div>
          ) : (
            <div className="relative">
              <input placeholder="Search existing customer or type name below…" value={customerSearch}
                onChange={e => setCustomerSearch(e.target.value)} className={inp} />
              {filteredC.length > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-white/12 bg-[#1a1a1a]">
                  {filteredC.map(c => (
                    <button key={c.id} onClick={() => { setSelectedCustomer(c); setCustomerSearch(""); }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-white/5">
                      <div>
                        <p className="text-sm">{c.name}</p>
                        <p className="text-xs text-white/40">{c.phone}</p>
                      </div>
                      {c.membership && <Crown className="ml-auto h-3.5 w-3.5 text-salon-gold" />}
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input placeholder="Or enter name manually" value={manualName} onChange={e=>setManualName(e.target.value)} className={inp} />
                <input placeholder="Phone (optional)" value={manualPhone} onChange={e=>setManualPhone(e.target.value)} className={inp} type="tel" />
              </div>
            </div>
          )}
        </div>

        {/* Date */}
        <div className="mb-4">
          <label className="mb-1 block text-xs text-white/40">Invoice date</label>
          <input type="date" value={invoiceDate} onChange={e=>setInvoiceDate(e.target.value)} className={`${inp} [color-scheme:dark] w-48`} />
        </div>

        {/* Line items */}
        <div className="mb-4">
          <label className="mb-2 block text-xs text-white/40">Services / items</label>
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_64px_96px_32px] gap-2 items-center">
                <input placeholder="Service name" value={item.name} onChange={e=>setItem(idx,"name",e.target.value)} className={inp} />
                <input type="number" min={1} placeholder="Qty" value={item.qty} onChange={e=>setItem(idx,"qty",e.target.value)} className={`${inp} text-center`} />
                <input type="number" min={0} placeholder="₹ Price" value={item.unit_price || ""} onChange={e=>setItem(idx,"unit_price",e.target.value)} className={inp} />
                {items.length > 1 && (
                  <button onClick={() => setItems(p=>p.filter((_,i)=>i!==idx))} className="text-white/30 hover:text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button onClick={() => setItems(p=>[...p,{name:"",qty:1,unit_price:0}])}
            className="mt-2 flex items-center gap-1 text-xs text-salon-gold hover:brightness-110">
            <Plus className="h-3.5 w-3.5" /> Add item
          </button>
        </div>

        {/* Discount + payment */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-white/40">Discount %</label>
            <input type="number" min={0} max={100} value={discount} onChange={e=>setDiscount(Number(e.target.value))} className={inp} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-white/40">Payment method</label>
            <select value={payMethod} onChange={e=>setPayMethod(e.target.value)} className={`${inp} bg-[#111]`}>
              {["cash","card","upi","other"].map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
            </select>
          </div>
        </div>

        <textarea placeholder="Notes (optional)" value={notes} onChange={e=>setNotes(e.target.value)} rows={2} className={`${inp} mb-4`} />

        {/* Total summary */}
        <div className="mb-5 rounded-xl border border-white/8 bg-white/3 p-4 text-sm">
          <div className="flex justify-between text-white/60"><span>Subtotal</span><span>{INR(subtotal)}</span></div>
          {discount > 0 && <div className="flex justify-between text-salon-gold"><span>Discount ({discount}%)</span><span>−{INR(discAmt)}</span></div>}
          <div className="mt-2 flex justify-between border-t border-white/8 pt-2 text-base font-bold"><span>Total</span><span>{INR(total)}</span></div>
        </div>

        {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="text-sm text-white/40 hover:text-white">Cancel</button>
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 rounded-full bg-salon-gold px-6 py-2.5 text-sm font-bold text-salon-black hover:brightness-110 disabled:opacity-40">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />} Save Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Revenue bar chart (pure CSS) ──────────────────────────────────────────────
function RevenueChart({ data }: { data: { date: string; revenue: number }[] }) {
  const max = Math.max(...data.map(d => d.revenue), 1);
  const today = new Date().toISOString().split("T")[0];
  return (
    <div className="flex h-32 items-end gap-px">
      {data.map(d => {
        const pct = (d.revenue / max) * 100;
        const isToday = d.date === today;
        const label = new Date(d.date).toLocaleDateString("en-IN",{day:"numeric",month:"short"});
        return (
          <div key={d.date} className="group relative flex flex-1 flex-col items-center justify-end">
            <div
              className={`w-full rounded-t transition-all ${isToday ? "bg-salon-gold" : "bg-white/20 group-hover:bg-white/40"}`}
              style={{ height: `${Math.max(pct, 2)}%` }}
            />
            {/* tooltip */}
            <div className="pointer-events-none absolute bottom-full mb-1 hidden rounded bg-black/80 px-2 py-1 text-center text-[10px] text-white group-hover:block whitespace-nowrap">
              {label}<br />{INR(d.revenue)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Analytics Tab ─────────────────────────────────────────────────────────────
function AnalyticsTab() {
  const [data, setData] = useState<{
    today: number; week: number; month: number; total30: number;
    invoiceCount: number; daily: { date: string; revenue: number }[];
    byMethod: Record<string,number>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/revenue").then(r=>r.json()).then(d=>{ setData(d); setLoading(false); });
  }, []);

  if (loading) return <div className="flex items-center gap-2 py-20 text-white/40"><Loader2 className="h-4 w-4 animate-spin"/>Loading…</div>;
  if (!data) return <p className="py-20 text-center text-white/30">No data</p>;

  const stats = [
    { label: "Today",      value: INR(data.today),  sub: "confirmed invoices" },
    { label: "This week",  value: INR(data.week),   sub: "Sun–today" },
    { label: "This month", value: INR(data.month),  sub: new Date().toLocaleDateString("en-IN",{month:"long"}) },
    { label: "Last 30 days", value: INR(data.total30), sub: `${data.invoiceCount} invoices` },
  ];

  const totalByMethod = Object.values(data.byMethod).reduce((a,b)=>a+b,0)||1;

  return (
    <div>
      {/* KPI cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map(s => (
          <div key={s.label} className="rounded-xl border border-white/8 p-4">
            <p className="text-xs uppercase tracking-wider text-white/40">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-salon-gold">{s.value}</p>
            <p className="text-xs text-white/30">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Daily revenue chart */}
      <div className="mb-8 rounded-xl border border-white/8 p-5">
        <p className="mb-1 text-sm font-medium">Daily revenue — last 30 days</p>
        <p className="mb-4 text-xs text-white/30">Gold bar = today</p>
        <RevenueChart data={data.daily} />
        <div className="mt-2 flex justify-between text-[10px] text-white/20">
          <span>{new Date(data.daily[0]?.date).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</span>
          <span>Today</span>
        </div>
      </div>

      {/* Payment method breakdown */}
      <div className="rounded-xl border border-white/8 p-5">
        <p className="mb-4 text-sm font-medium">Payment breakdown</p>
        <div className="space-y-3">
          {Object.entries(data.byMethod).map(([method, amount]) => (
            <div key={method}>
              <div className="flex justify-between text-sm mb-1">
                <span className="capitalize text-white/70">{method}</span>
                <span>{INR(amount)} <span className="text-white/30 text-xs">({Math.round(amount/totalByMethod*100)}%)</span></span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/8">
                <div className="h-1.5 rounded-full bg-salon-gold" style={{ width: `${(amount/totalByMethod)*100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Invoices Tab ──────────────────────────────────────────────────────────────
function InvoicesTab({ customers }: { customers: Customer[] }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/invoices");
    const d = await res.json();
    setInvoices(d.invoices ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = invoices.filter(inv =>
    !search ||
    inv.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
    inv.customer_phone?.includes(search)
  );

  return (
    <>
      {showCreate && <CreateInvoiceModal customers={customers} onClose={() => setShowCreate(false)} onSaved={load} />}
      <div className="mb-5 flex items-center gap-3">
        <input placeholder="Search by name, phone, invoice #…" value={search} onChange={e=>setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-white/18 bg-white/5 px-4 py-2 text-sm text-white placeholder-white/30 focus:border-salon-gold focus:outline-none" />
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-full bg-salon-gold px-5 py-2 text-sm font-bold text-salon-black hover:brightness-110">
          <Plus className="h-4 w-4" /> New Invoice
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-16 text-white/40"><Loader2 className="h-4 w-4 animate-spin"/>Loading…</div>
      ) : filtered.length === 0 ? (
        <p className="py-16 text-center text-white/30">No invoices yet</p>
      ) : (
        <div className="space-y-2">
          {filtered.map(inv => (
            <div key={inv.id} className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-mono text-xs text-salon-gold">{inv.invoice_number}</p>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                      inv.status === "paid" ? "border-green-400/30 bg-green-400/5 text-green-400" :
                      inv.status === "pending" ? "border-yellow-400/30 bg-yellow-400/5 text-yellow-400" :
                      "border-red-400/30 bg-red-400/5 text-red-400"
                    }`}>{inv.status}</span>
                    <span className="rounded-full border border-white/12 px-2 py-0.5 text-[10px] uppercase text-white/40">{inv.payment_method}</span>
                  </div>
                  <p className="mt-1 font-semibold">{inv.customer_name}{inv.customer_phone ? ` · ${inv.customer_phone}` : ""}</p>
                  <p className="text-sm text-white/50">{inv.items.map(i=>`${i.name}${i.qty>1?` ×${i.qty}`:""}`).join(", ")}</p>
                  <p className="text-xs text-white/30">{new Date(inv.invoice_date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">{INR(inv.total)}</p>
                  {inv.discount_percent > 0 && <p className="text-xs text-salon-gold">{inv.discount_percent}% off</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ── Promotions Tab ───────────────────────────────────────────────────────────
type PromoCustomer = { id: string; name: string; phone: string; last_service?: string; last_visit_date?: string };
type SendStatus = "idle" | "pending" | "sent" | "failed";

const DEFAULT_TEMPLATE = `✂️ *Toni & Guy Hopefarm — We miss you!*

Hi {first_name}! It's been a while 😊

As a valued guest, here's an exclusive offer just for you:

🎁 *Flat 20% off* on your next visit this week!
Simply show this message at the salon to redeem.

📍 Hopefarm, Whitefield Bangalore
📞 +91 91872 00430
🕐 10 AM – 9 PM · Mon–Sun

Book now → Reply *BOOK* and we'll call you right back!

_Toni & Guy Hopefarm_`;

function PromoTab() {
  const [weeks, setWeeks] = useState(2);
  const [customers, setCustomers] = useState<PromoCustomer[]>([]);
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [gapSecs, setGapSecs] = useState(60);
  const [running, setRunning] = useState(false);
  const [statuses, setStatuses] = useState<Record<string, SendStatus>>({});
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [countdown, setCountdown] = useState(0);
  const stopRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function fetchCustomers() {
    setLoading(true);
    const res = await fetch(`/api/admin/promo?weeks=${weeks}`);
    const d = await res.json();
    setCustomers(d.customers ?? []);
    setStatuses({});
    setLoading(false);
  }

  useEffect(() => { fetchCustomers(); }, [weeks]);

  function previewMessage(name: string) {
    return template.replace(/\{name\}/gi, name).replace(/\{first_name\}/gi, name.split(" ")[0]);
  }

  function startCountdown(secs: number, onDone: () => void) {
    setCountdown(secs);
    timerRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(timerRef.current!); onDone(); return 0; }
        return c - 1;
      });
    }, 1000);
  }

  async function runCampaign() {
    stopRef.current = false; setRunning(true); setCurrentIdx(0);
    for (let i = 0; i < customers.length; i++) {
      if (stopRef.current) break;
      const c = customers[i];
      setCurrentIdx(i);
      setStatuses(s => ({ ...s, [c.id]: "pending" }));
      try {
        const res = await fetch("/api/admin/promo", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customer_id: c.id, phone: c.phone, name: c.name, message: template }),
        });
        const d = await res.json();
        setStatuses(s => ({ ...s, [c.id]: d.sent ? "sent" : "failed" }));
      } catch { setStatuses(s => ({ ...s, [c.id]: "failed" })); }
      if (i < customers.length - 1 && !stopRef.current) {
        await new Promise<void>(resolve => startCountdown(gapSecs, resolve));
      }
    }
    setRunning(false); setCurrentIdx(-1);
  }

  function stopCampaign() {
    stopRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    setCountdown(0); setRunning(false); setCurrentIdx(-1);
  }

  const sentCount = Object.values(statuses).filter(s => s === "sent").length;
  const failedCount = Object.values(statuses).filter(s => s === "failed").length;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <div className="mb-4 rounded-xl border border-white/8 bg-white/3 p-4 space-y-3">
          <p className="text-xs uppercase tracking-wider text-white/40">Target audience</p>
          <div className="flex items-center gap-3">
            <label className="text-sm text-white/60">Last visited more than</label>
            <select value={weeks} onChange={e=>setWeeks(Number(e.target.value))}
              className="rounded-lg border border-white/18 bg-white/5 px-3 py-1.5 text-sm text-white focus:border-salon-gold focus:outline-none">
              {[1,2,3,4,6,8,12].map(w=><option key={w} value={w}>{w} week{w>1?"s":""} ago</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-white/60">Gap between messages</label>
            <select value={gapSecs} onChange={e=>setGapSecs(Number(e.target.value))}
              className="rounded-lg border border-white/18 bg-white/5 px-3 py-1.5 text-sm text-white focus:border-salon-gold focus:outline-none">
              {[30,45,60,90,120].map(s=><option key={s} value={s}>{s}s</option>)}
            </select>
          </div>
        </div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium">{customers.length} customers eligible</p>
          <button onClick={fetchCustomers} className="text-xs text-white/40 hover:text-white">↻ Refresh</button>
        </div>
        {loading ? <div className="flex items-center gap-2 py-8 text-white/40"><Loader2 className="h-4 w-4 animate-spin"/>Loading…</div> : (
          <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
            {customers.map((c, i) => {
              const st = statuses[c.id];
              return (
                <div key={c.id} className={`flex items-center justify-between rounded-lg border p-3 transition ${currentIdx===i?"border-salon-gold/40 bg-salon-gold/5":"border-white/8 bg-white/[0.02]"}`}>
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-white/40">{c.phone}{c.last_visit_date?` · last ${new Date(c.last_visit_date).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}`:""}</p>
                  </div>
                  <div>
                    {!st && <span className="text-xs text-white/20">queued</span>}
                    {st==="pending" && <Loader2 className="h-4 w-4 animate-spin text-salon-gold"/>}
                    {st==="sent" && <CheckCircle2 className="h-4 w-4 text-green-400"/>}
                    {st==="failed" && <XCircle className="h-4 w-4 text-red-400"/>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div>
        <p className="mb-1 text-xs uppercase tracking-wider text-white/40">Message template</p>
        <p className="mb-2 text-xs text-white/30">Use <span className="font-mono text-salon-gold/70">{"{first_name}"}</span> to personalise</p>
        <textarea value={template} onChange={e=>setTemplate(e.target.value)} rows={12} disabled={running}
          className="w-full rounded-xl border border-white/18 bg-white/5 px-4 py-3 text-sm leading-relaxed text-white font-mono focus:border-salon-gold focus:outline-none disabled:opacity-50" />
        {customers.length > 0 && (
          <div className="mt-3 rounded-xl border border-white/8 bg-[#1a1a1a] p-3">
            <p className="mb-2 text-xs text-white/30">Preview for: {customers[0].name}</p>
            <div className="rounded-lg bg-[#005c4b] p-3 text-xs leading-relaxed text-white/90 whitespace-pre-line">{previewMessage(customers[0].name)}</div>
          </div>
        )}
        {running && (
          <div className="mt-4 rounded-xl border border-salon-gold/20 bg-salon-gold/5 p-4">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-salon-gold"/>
              <p className="text-sm font-medium text-salon-gold">Sending {currentIdx+1} of {customers.length}…</p>
            </div>
            {countdown > 0 && (
              <div className="mt-2">
                <p className="flex items-center gap-1 text-xs text-white/50"><Clock className="h-3 w-3"/>Next in <span className="font-mono text-white ml-1">{countdown}s</span></p>
                <div className="mt-1.5 h-1 w-full rounded-full bg-white/10">
                  <div className="h-1 rounded-full bg-salon-gold transition-all" style={{width:`${((gapSecs-countdown)/gapSecs)*100}%`}}/>
                </div>
              </div>
            )}
            <p className="mt-2 text-xs text-white/40">✓ {sentCount} sent · ✗ {failedCount} failed · Keep tab open</p>
          </div>
        )}
        {!running && sentCount+failedCount > 0 && (
          <div className="mt-4 rounded-xl border border-green-400/20 bg-green-400/5 p-4">
            <p className="font-medium text-green-400">Campaign complete!</p>
            <p className="mt-1 text-sm text-white/60">✓ {sentCount} sent · ✗ {failedCount} failed</p>
          </div>
        )}
        <div className="mt-4">
          {!running ? (
            <button onClick={runCampaign} disabled={customers.length===0||!template.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-salon-gold py-3 text-sm font-bold text-salon-black hover:brightness-110 disabled:opacity-30">
              <Send className="h-4 w-4"/>Send to {customers.length} customer{customers.length!==1?"s":""}
            </button>
          ) : (
            <button onClick={stopCampaign}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-red-400/40 py-3 text-sm text-red-400 hover:border-red-400">
              <X className="h-4 w-4"/>Stop campaign
            </button>
          )}
        </div>
        {!running && customers.length > 0 && (
          <p className="mt-2 text-center text-xs text-white/30">~{Math.ceil(((customers.length-1)*gapSecs)/60)} min · Keep this tab open</p>
        )}
      </div>
    </div>
  );
}

// ── Booking helpers ───────────────────────────────────────────────────────────
function BookingCard({ b, onCancel, cancelling }: { b: Booking; onCancel:(id:string)=>void; cancelling:string|null }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold">{b.client_name}</p>
            <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${STATUS_COLORS[b.status]??""}`}>{b.status}</span>
            {b.discount_percent>0&&<span className="rounded-full border border-salon-gold/30 bg-salon-gold/5 px-2 py-0.5 text-[10px] text-salon-gold">{b.discount_percent}% off</span>}
            {b.whatsapp_notified&&<span className="text-[10px] text-green-400/70">✓ WhatsApp</span>}
          </div>
          <p className="mt-1 text-sm text-white/60">{b.service_name??"Service"} · {b.stylist_name??"Any stylist"}</p>
          <p className="text-sm text-white/40">🕐 {b.booking_time} · 📱 {b.client_phone}</p>
          {b.notes&&<p className="mt-1 text-xs text-white/30 italic">"{b.notes}"</p>}
        </div>
        {b.status==="confirmed"&&(
          <button onClick={()=>onCancel(b.id)} disabled={cancelling===b.id}
            className="rounded-full border border-red-400/30 p-2 text-red-400/60 hover:border-red-400 hover:text-red-400 disabled:opacity-30">
            {cancelling===b.id?<Loader2 className="h-3.5 w-3.5 animate-spin"/>:<X className="h-3.5 w-3.5"/>}
          </button>
        )}
      </div>
    </div>
  );
}

function DateGroup({ date, bookings, onCancel, cancelling }: { date:string; bookings:Booking[]; onCancel:(id:string)=>void; cancelling:string|null }) {
  const [open, setOpen] = useState(true);
  const today=new Date().toISOString().split("T")[0];
  const isToday=date===today;
  const tmrw=new Date(); tmrw.setDate(tmrw.getDate()+1);
  const isTmrw=date===tmrw.toISOString().split("T")[0];
  const label=isToday?"Today":isTmrw?"Tomorrow":fmtDate(date);
  return (
    <div className="mb-4">
      <button onClick={()=>setOpen(o=>!o)} className="flex w-full items-center justify-between rounded-lg border border-white/8 bg-white/3 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className={`font-medium ${isToday?"text-salon-gold":"text-white"}`}>{label}</span>
          <span className="rounded-full border border-white/12 px-2 py-0.5 text-[10px] text-white/40">{bookings.length}</span>
        </div>
        {open?<ChevronUp className="h-4 w-4 text-white/30"/>:<ChevronDown className="h-4 w-4 text-white/30"/>}
      </button>
      {open&&<div className="mt-2 space-y-2">{bookings.map(b=><BookingCard key={b.id} b={b} onCancel={onCancel} cancelling={cancelling}/>)}</div>}
    </div>
  );
}

// ── Walk-in Quick Booking Modal ───────────────────────────────────────────────
const WALKIN_SERVICES = [
  "Haircut — Men",  "Haircut — Women", "Haircut — Kids",
  "Blow Dry", "Wash & Blast Dry", "Ironing / Tongs",
  "Global Colour", "Tint Re-growth", "Highlights — Full Head",
  "Highlights — Half Head", "Highlights — T-Section",
  "Balayage / Ombré", "Keratin Treatment", "Nanoplastia / Smoothening",
  "Rebonding", "Hair Spa", "Beard Trim", "Threading",
];

const WALKIN_STYLISTS = [
  "No preference", "Aarav", "Priya", "Deepak", "Sunita", "Rahul", "Sneha",
];

function getNowRounded(): string {
  const d = new Date();
  d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15, 0, 0);
  return d.toTimeString().slice(0, 5);
}

function WalkInModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const todayStr = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    client_name: "Walk-in Guest",
    client_phone: "",
    service_name: WALKIN_SERVICES[0],
    stylist_name: "No preference",
    booking_date: todayStr,
    booking_time: getNowRounded(),
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const inp = "w-full rounded-lg border border-white/18 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-salon-gold focus:outline-none";

  async function book() {
    if (!form.service_name) { setError("Select a service"); return; }
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "walkin" }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error ?? "Failed");
      setDone(true);
      onSaved();
      setTimeout(onClose, 1400);
    } catch (e) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/8 bg-[#0e0d0b] p-6">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-salon-gold" />
            <h2 className="font-display text-2xl">Walk-in Booking</h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        {done ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <CheckCircle2 className="h-12 w-12 text-green-400" />
            <p className="text-lg font-semibold text-green-400">Booked!</p>
            <p className="text-sm text-white/40">{form.service_name} · {form.booking_time}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-widest text-white/40">Date</label>
                <input type="date" value={form.booking_date} min={todayStr}
                  onChange={e => setForm(f => ({ ...f, booking_date: e.target.value }))}
                  className={`${inp} [color-scheme:dark]`} />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-widest text-white/40">Time</label>
                <input type="time" value={form.booking_time}
                  onChange={e => setForm(f => ({ ...f, booking_time: e.target.value }))}
                  className={`${inp} [color-scheme:dark]`} />
              </div>
            </div>

            {/* Service */}
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-widest text-white/40">Service *</label>
              <select value={form.service_name} onChange={e => setForm(f => ({ ...f, service_name: e.target.value }))}
                className={`${inp} bg-[#111]`}>
                {WALKIN_SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Stylist */}
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-widest text-white/40">Stylist</label>
              <select value={form.stylist_name} onChange={e => setForm(f => ({ ...f, stylist_name: e.target.value }))}
                className={`${inp} bg-[#111]`}>
                {WALKIN_STYLISTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Client name */}
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-widest text-white/40">Client name</label>
              <input placeholder="Walk-in Guest" value={form.client_name}
                onChange={e => setForm(f => ({ ...f, client_name: e.target.value || "Walk-in Guest" }))}
                className={inp} />
            </div>

            {/* Phone (optional) */}
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-widest text-white/40">Phone <span className="text-white/20 normal-case">(optional — for WhatsApp)</span></label>
              <input placeholder="10-digit mobile" type="tel" value={form.client_phone}
                onChange={e => setForm(f => ({ ...f, client_phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                className={inp} />
            </div>

            {/* Notes */}
            <input placeholder="Notes (e.g. colour notes, allergies)" value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              className={inp} />

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button onClick={book} disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-salon-gold py-3 text-sm font-bold text-salon-black hover:brightness-110 disabled:opacity-40 mt-1">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              Confirm Walk-in
            </button>
            <p className="text-center text-xs text-white/25">No WhatsApp sent for walk-ins · Instant confirmation</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter();
  type Tab = "bookings"|"customers"|"invoices"|"analytics"|"promos";
  const [tab, setTab] = useState<Tab>("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [cancelling, setCancelling] = useState<string|null>(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer|null>(null);
  const [showWalkIn, setShowWalkIn] = useState(false);
  const [search, setSearch] = useState("");

  const loadBookings = useCallback(async () => {
    const res = await fetch("/api/bookings");
    const d = await res.json();
    setBookings(d.bookings??[]);
  }, []);
  const loadCustomers = useCallback(async () => {
    const res = await fetch("/api/customers");
    const d = await res.json();
    setCustomers(d.customers??[]);
  }, []);
  const load = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadBookings(), loadCustomers()]);
    setLoading(false);
  }, [loadBookings, loadCustomers]);
  useEffect(() => { load(); }, [load]);

  async function cancel(id: string) {
    if(!confirm("Cancel this booking?")) return;
    setCancelling(id);
    await fetch("/api/bookings/cancel",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({booking_id:id,reason:"Cancelled by salon"})});
    setCancelling(null); loadBookings();
  }
  async function logout() { await fetch("/api/admin/logout",{method:"POST"}); router.push("/admin/login"); }

  const today=new Date().toISOString().split("T")[0];
  const filtered=filter==="all"?bookings:bookings.filter(b=>b.status===filter);
  const grouped=filtered.reduce<Record<string,Booking[]>>((acc,b)=>{(acc[b.booking_date]??=[]).push(b);return acc;},{});
  const sortedDates=Object.keys(grouped).sort((a,b)=>a<b?1:-1);
  const filteredCustomers=customers.filter(c=>!search||c.name?.toLowerCase().includes(search.toLowerCase())||c.phone?.includes(search));

  const TABS: [Tab, React.ElementType, string][] = [
    ["bookings", CalendarDays, "Bookings"],
    ["customers", Users, "Customers"],
    ["invoices", FileText, "Invoices"],
    ["analytics", BarChart3, "Analytics"],
    ["promos", Megaphone, "Promos"],
  ];

  return (
    <main className="min-h-screen bg-salon-black px-5 py-10 md:px-8">
      {showAddCustomer && <AddCustomerModal onClose={()=>setShowAddCustomer(false)} onSaved={loadCustomers}/>}
      {editingCustomer && <EditCustomerModal customer={editingCustomer} onClose={()=>setEditingCustomer(null)} onSaved={loadCustomers}/>}
      {showWalkIn && <WalkInModal onClose={()=>setShowWalkIn(false)} onSaved={loadBookings}/>}

      <div className="mx-auto max-w-6xl">
        {/* Quick links to package system */}
        <div className="mb-6 flex flex-wrap gap-2">
          <a href="/admin/package-customers"
            className="flex items-center gap-2 rounded-full border border-salon-gold/30 bg-salon-gold/5 px-4 py-2 text-xs font-semibold text-salon-gold hover:bg-salon-gold/10 transition">
            <Crown className="h-3.5 w-3.5" /> Package Customers
          </a>
          <a href="/admin/packages"
            className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-white/50 hover:border-white/30 hover:text-white transition">
            <Zap className="h-3.5 w-3.5" /> Manage Packages
          </a>
        </div>

        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-salon-gold">Admin</p>
            <h1 className="mt-2 font-display text-4xl">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={load} className="flex items-center gap-2 rounded-full border border-white/18 px-4 py-2 text-sm text-white/60 hover:border-white/40 hover:text-white">
              <RefreshCw className={`h-3.5 w-3.5 ${loading?"animate-spin":""}`}/>Refresh
            </button>
            <button onClick={logout} className="flex items-center gap-2 rounded-full border border-white/18 px-4 py-2 text-sm text-white/40 hover:border-red-400/40 hover:text-red-400">
              <LogOut className="h-3.5 w-3.5"/>Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            {label:"Today",     value:bookings.filter(b=>b.booking_date===today&&b.status==="confirmed").length},
            {label:"Bookings",  value:bookings.length},
            {label:"Customers", value:customers.length},
            {label:"Members",   value:customers.filter(c=>c.membership).length},
          ].map(s=>(
            <div key={s.label} className="rounded-xl border border-white/8 p-4">
              <p className="text-xs uppercase tracking-wider text-white/40">{s.label}</p>
              <p className="mt-1 text-3xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-1 rounded-xl border border-white/8 bg-white/3 p-1 w-fit">
          {TABS.map(([key, Icon, label]) => (
            <button key={key} onClick={()=>setTab(key)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${tab===key?"bg-salon-gold text-salon-black":"text-white/50 hover:text-white"}`}>
              <Icon className="h-4 w-4"/>{label}
            </button>
          ))}
        </div>

        {/* ── Bookings ── */}
        {tab==="bookings"&&(
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {["all","confirmed","pending","completed","cancelled"].map(f=>(
                  <button key={f} onClick={()=>setFilter(f)}
                    className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-wider transition ${filter===f?"border-salon-gold text-salon-gold":"border-white/12 text-white/40 hover:border-white/30"}`}>
                    {f}
                  </button>
                ))}
              </div>
              <button onClick={()=>setShowWalkIn(true)}
                className="flex items-center gap-2 rounded-full bg-salon-gold px-5 py-2 text-sm font-bold text-salon-black hover:brightness-110 shadow-md shadow-salon-gold/30">
                <Zap className="h-4 w-4"/>Walk-in
              </button>
            </div>
            {loading?<div className="flex items-center gap-2 py-16 text-white/40"><Loader2 className="h-4 w-4 animate-spin"/>Loading…</div>
            :filtered.length===0?<p className="py-16 text-center text-white/30">No bookings yet</p>
            :sortedDates.map(date=><DateGroup key={date} date={date} bookings={grouped[date]} onCancel={cancel} cancelling={cancelling}/>)}
          </>
        )}

        {/* ── Customers ── */}
        {tab==="customers"&&(
          <>
            <div className="mb-5 flex items-center gap-3">
              <input placeholder="Search by name or phone…" value={search} onChange={e=>setSearch(e.target.value)}
                className="flex-1 rounded-lg border border-white/18 bg-white/5 px-4 py-2 text-sm text-white placeholder-white/30 focus:border-salon-gold focus:outline-none"/>
              <button onClick={()=>setShowAddCustomer(true)}
                className="flex items-center gap-2 rounded-full bg-salon-gold px-5 py-2 text-sm font-bold text-salon-black hover:brightness-110">
                <Plus className="h-4 w-4"/>Add
              </button>
            </div>
            {loading?<div className="flex items-center gap-2 py-16 text-white/40"><Loader2 className="h-4 w-4 animate-spin"/>Loading…</div>
            :filteredCustomers.length===0?<p className="py-16 text-center text-white/30">No customers yet</p>
            :(
              <div className="space-y-2">
                {filteredCustomers.map(c=>(
                  <div key={c.id} className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold">{c.name}</p>
                          {c.membership && c.membership_tier && (
                            <span className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${MEMBERSHIP_COLORS[c.membership_tier]}`}>
                              <Crown className="h-2.5 w-2.5"/>{c.membership_tier}
                            </span>
                          )}
                          {c.tags?.filter(t=>!["male","female","other"].includes(t)).map(t=>(
                            <span key={t} className="rounded-full border border-white/12 px-2 py-0.5 text-[10px] capitalize text-white/50">{t}</span>
                          ))}
                          {c.whatsapp_opted_in&&<span className="text-[10px] text-green-400/60">✓ WA</span>}
                        </div>
                        <p className="text-sm text-white/60">📱 {c.phone}{c.email?` · ${c.email}`:""}</p>
                        {c.last_service&&<p className="text-sm text-white/40">Last: {c.last_service}{c.preferred_stylist?` · ${c.preferred_stylist}`:""}</p>}
                        {c.last_visit_date&&<p className="text-xs text-white/30">Visited {new Date(c.last_visit_date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</p>}
                        {c.membership_expires&&<p className="text-xs text-salon-gold/60">Membership expires {new Date(c.membership_expires).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</p>}
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-salon-gold">{c.total_bookings}</p>
                          <p className="text-[10px] text-white/30">visits</p>
                        </div>
                        <button onClick={()=>setEditingCustomer(c)}
                          className="rounded-full border border-white/18 p-2 text-white/40 hover:border-salon-gold hover:text-salon-gold transition">
                          <Edit2 className="h-3.5 w-3.5"/>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Invoices ── */}
        {tab==="invoices"&&<InvoicesTab customers={customers}/>}

        {/* ── Analytics ── */}
        {tab==="analytics"&&<AnalyticsTab/>}

        {/* ── Promos ── */}
        {tab==="promos"&&<PromoTab/>}
      </div>
    </main>
  );
}
