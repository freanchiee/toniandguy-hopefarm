"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Plus, ToggleLeft, ToggleRight } from "lucide-react";

type Emp = { id: string; name: string; designation?: string; phone?: string; base_salary: number; default_incentive_pct: number; is_stylist: boolean; active: boolean };
const inp = "rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/25 focus:border-salon-gold focus:outline-none";

// Roster + basic employee record (super_admin). Full payroll comes in the Payroll tab.
export function EmployeeRosterTab() {
  const [emps, setEmps] = useState<Emp[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", designation: "", phone: "", base_salary: "", default_incentive_pct: "5" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    const d = await fetch("/api/admin/employees").then((r) => r.json());
    setEmps(d.employees ?? []); setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function add() {
    if (!form.name.trim()) { setErr("Name required"); return; }
    setSaving(true); setErr("");
    const res = await fetch("/api/admin/employees", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, designation: form.designation, phone: form.phone, base_salary: Number(form.base_salary || 0), default_incentive_pct: Number(form.default_incentive_pct || 5) }),
    });
    const d = await res.json(); setSaving(false);
    if (!res.ok) { setErr(d.error ?? "Error"); return; }
    setForm({ name: "", designation: "", phone: "", base_salary: "", default_incentive_pct: "5" });
    load();
  }

  async function toggle(e: Emp) {
    await fetch(`/api/admin/employees/${e.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !e.active }) });
    load();
  }

  if (loading) return <div className="flex items-center gap-2 py-16 text-white/40"><Loader2 className="h-4 w-4 animate-spin" />Loading…</div>;

  return (
    <div className="max-w-2xl">
      <div className="mb-6 rounded-2xl border border-white/8 bg-white/[0.02] p-5">
        <p className="mb-3 flex items-center gap-2 text-sm font-medium text-white"><Plus className="h-4 w-4 text-salon-gold" /> Add employee</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Name *" className={inp} />
          <input value={form.designation} onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))} placeholder="Designation" className={inp} />
          <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="Phone" className={inp} />
          <input type="number" value={form.base_salary} onChange={(e) => setForm((f) => ({ ...f, base_salary: e.target.value }))} placeholder="Base salary ₹/mo" className={inp} />
          <input type="number" value={form.default_incentive_pct} onChange={(e) => setForm((f) => ({ ...f, default_incentive_pct: e.target.value }))} placeholder="Incentive %" className={inp} />
        </div>
        {err && <p className="mt-2 text-sm text-red-400">{err}</p>}
        <button onClick={add} disabled={saving} className="mt-3 flex items-center gap-2 rounded-full bg-salon-gold px-5 py-2 text-sm font-bold text-salon-black disabled:opacity-50">
          {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Add
        </button>
      </div>

      <div className="space-y-2">
        {emps.map((e) => (
          <div key={e.id} className={`flex items-center justify-between rounded-lg border border-white/8 bg-white/[0.02] px-4 py-3 ${e.active ? "" : "opacity-50"}`}>
            <div>
              <p className="text-sm font-medium text-white">{e.name} {e.designation && <span className="text-white/40">· {e.designation}</span>}</p>
              <p className="text-xs text-white/30">Base ₹{(e.base_salary ?? 0).toLocaleString("en-IN")}/mo · {e.default_incentive_pct}% incentive{e.phone ? ` · ${e.phone}` : ""}</p>
            </div>
            <button onClick={() => toggle(e)} className="text-white/40 hover:text-white" title={e.active ? "Deactivate" : "Activate"}>
              {e.active ? <ToggleRight className="h-6 w-6 text-salon-gold" /> : <ToggleLeft className="h-6 w-6" />}
            </button>
          </div>
        ))}
        {emps.length === 0 && <p className="text-sm text-white/30">No employees yet.</p>}
      </div>
    </div>
  );
}
