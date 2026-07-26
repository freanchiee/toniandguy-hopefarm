"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Calculator, Lock, Unlock, Printer } from "lucide-react";

const INR = (v: number) => `₹${(v ?? 0).toLocaleString("en-IN")}`;
const inp = "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/25 focus:border-salon-gold focus:outline-none";
const monthLabel = (p: string) => new Date(p).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

type Slip = any;

export function PayrollTab() {
  const [employees, setEmployees] = useState<{ id: string; name: string; base_salary: number }[]>([]);
  const [history, setHistory] = useState<Slip[]>([]);
  const [empId, setEmpId] = useState("");
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [inputs, setInputs] = useState({ paid_days: "", bonus: "", overtime: "", advance_deduction: "", other_deduction: "" });
  const [slip, setSlip] = useState<Slip | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const loadHistory = useCallback(async () => {
    const d = await fetch("/api/admin/payroll").then((r) => r.json());
    setHistory(d.payslips ?? []);
  }, []);
  useEffect(() => {
    fetch("/api/admin/employees?active=1").then((r) => r.json()).then((d) => setEmployees(d.employees ?? []));
    loadHistory();
  }, [loadHistory]);

  async function generate() {
    if (!empId) { setErr("Pick an employee"); return; }
    setBusy(true); setErr("");
    const res = await fetch("/api/admin/payroll", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employee_id: empId, period: `${month}-01`, ...Object.fromEntries(Object.entries(inputs).map(([k, v]) => [k, Number(v || 0)])) }),
    });
    const d = await res.json(); setBusy(false);
    if (!res.ok) { setErr(d.error ?? "Error"); return; }
    setSlip(d.payslip); loadHistory();
  }

  async function toggleLock(s: Slip) {
    const res = await fetch(`/api/admin/payroll/${s.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ locked: !s.locked }) });
    const d = await res.json();
    if (res.ok) { setSlip(d.payslip); loadHistory(); } else setErr(d.error);
  }

  function loadSlip(s: Slip) {
    setSlip(s); setEmpId(s.employee_id); setMonth(s.period.slice(0, 7));
    setInputs({ paid_days: String(s.paid_days ?? ""), bonus: String(s.bonus ?? ""), overtime: String(s.overtime ?? ""), advance_deduction: String(s.advance_deduction ?? ""), other_deduction: String(s.other_deduction ?? "") });
  }

  function printSlip(s: Slip) {
    const name = s.employees?.name ?? "Employee";
    const rows = (s.incentive_breakdown ?? []).map((b: any) => `<tr><td>${b.category}</td><td style="text-align:right">${INR(b.menu_revenue)}</td><td style="text-align:right">${b.pct}%</td><td style="text-align:right">${INR(b.incentive)}</td></tr>`).join("");
    const html = `<html><head><title>Payslip ${name} ${monthLabel(s.period)}</title>
      <style>body{font-family:Arial,sans-serif;color:#111;padding:32px;max-width:640px;margin:auto}h1{font-size:20px;margin:0}h2{font-size:14px;color:#666;font-weight:normal;margin:4px 0 24px}table{width:100%;border-collapse:collapse;margin:8px 0}td,th{padding:6px 4px;border-bottom:1px solid #eee;font-size:13px}.tot{font-weight:bold;font-size:16px;border-top:2px solid #111}</style></head>
      <body><h1>Toni &amp; Guy Hopefarm — Payslip</h1><h2>${name}${s.employees?.designation ? " · " + s.employees.designation : ""} · ${monthLabel(s.period)}</h2>
      <table>
      <tr><td>Base salary (${s.paid_days}/${s.month_days} days)</td><td style="text-align:right">${INR(s.base_earned)}</td></tr>
      </table>
      <table><thead><tr><th style="text-align:left">Incentive by category</th><th style="text-align:right">Menu revenue</th><th style="text-align:right">%</th><th style="text-align:right">Incentive</th></tr></thead><tbody>${rows || '<tr><td colspan=4 style="color:#999">No incentive-eligible sales</td></tr>'}</tbody></table>
      <table>
      <tr><td>Incentive total</td><td style="text-align:right">${INR(s.incentive_total)}</td></tr>
      <tr><td>Bonus</td><td style="text-align:right">${INR(s.bonus)}</td></tr>
      <tr><td>Overtime</td><td style="text-align:right">${INR(s.overtime)}</td></tr>
      <tr><td>Advance (deduction)</td><td style="text-align:right">−${INR(s.advance_deduction)}</td></tr>
      <tr><td>Other deduction</td><td style="text-align:right">−${INR(s.other_deduction)}</td></tr>
      <tr class="tot"><td>Net pay</td><td style="text-align:right">${INR(s.net_pay)}</td></tr>
      </table>
      <p style="color:#999;font-size:11px;margin-top:24px">Generated ${new Date(s.generated_at).toLocaleString("en-IN")}${s.locked ? " · FINALISED" : ""}</p>
      </body></html>`;
    const w = window.open("", "_blank", "width=720,height=900");
    if (!w) return;
    w.document.write(html); w.document.close(); w.focus(); setTimeout(() => w.print(), 250);
  }

  return (
    <div>
      {/* Generate */}
      <div className="mb-6 rounded-2xl border border-white/8 bg-white/[0.02] p-5">
        <p className="mb-4 flex items-center gap-2 text-sm font-medium text-white"><Calculator className="h-4 w-4 text-salon-gold" /> Generate payslip</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <select value={empId} onChange={(e) => setEmpId(e.target.value)} className={inp}><option value="">Employee…</option>{employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className={`${inp} [color-scheme:dark]`} />
        </div>
        <div className="mt-2 grid gap-2 sm:grid-cols-5">
          {([["paid_days", "Paid days"], ["bonus", "Bonus ₹"], ["overtime", "Overtime ₹"], ["advance_deduction", "Advance ₹"], ["other_deduction", "Other ded. ₹"]] as const).map(([k, ph]) => (
            <input key={k} type="number" value={(inputs as any)[k]} onChange={(e) => setInputs((s) => ({ ...s, [k]: e.target.value }))} placeholder={ph} className={inp} />
          ))}
        </div>
        {err && <p className="mt-2 text-sm text-red-400">{err}</p>}
        <button onClick={generate} disabled={busy} className="mt-3 flex items-center gap-2 rounded-full bg-salon-gold px-5 py-2 text-sm font-bold text-salon-black disabled:opacity-50">{busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Generate</button>
      </div>

      {/* Result */}
      {slip && (
        <div className="mb-8 rounded-2xl border border-salon-gold/25 bg-salon-gold/5 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div><p className="font-display text-2xl uppercase text-white">{slip.employees?.name}</p><p className="text-xs text-white/40">{monthLabel(slip.period)}{slip.locked ? " · Finalised" : ""}</p></div>
            <div className="flex gap-2">
              <button onClick={() => printSlip(slip)} className="flex items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/60 hover:text-white"><Printer className="h-3.5 w-3.5" /> Print</button>
              <button onClick={() => toggleLock(slip)} className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${slip.locked ? "bg-white/10 text-white/70" : "bg-salon-gold text-salon-black"}`}>{slip.locked ? <><Unlock className="h-3.5 w-3.5" /> Unlock</> : <><Lock className="h-3.5 w-3.5" /> Finalise</>}</button>
            </div>
          </div>
          <div className="space-y-1 text-sm">
            <Row label={`Base (${slip.paid_days}/${slip.month_days} days)`} v={slip.base_earned} />
            {(slip.incentive_breakdown ?? []).map((b: any) => <Row key={b.category} label={`Incentive · ${b.category} (${b.pct}% of ${INR(b.menu_revenue)})`} v={b.incentive} sub />)}
            <Row label="Incentive total" v={slip.incentive_total} />
            {slip.bonus > 0 && <Row label="Bonus" v={slip.bonus} />}
            {slip.overtime > 0 && <Row label="Overtime" v={slip.overtime} />}
            {slip.advance_deduction > 0 && <Row label="Advance" v={-slip.advance_deduction} />}
            {slip.other_deduction > 0 && <Row label="Other deduction" v={-slip.other_deduction} />}
            <div className="mt-2 flex justify-between border-t border-white/15 pt-2 text-lg font-bold text-white"><span>Net pay</span><span className="text-salon-gold">{INR(slip.net_pay)}</span></div>
          </div>
        </div>
      )}

      {/* History */}
      <p className="mb-3 text-xs uppercase tracking-wider text-salon-gold">Payslip history</p>
      {history.length === 0 ? <p className="text-sm text-white/30">No payslips yet.</p> : (
        <div className="space-y-2">
          {history.map((s) => (
            <button key={s.id} onClick={() => loadSlip(s)} className="flex w-full items-center justify-between rounded-lg border border-white/8 bg-white/[0.02] px-4 py-3 text-left hover:border-white/20">
              <div><p className="text-sm text-white/80">{s.employees?.name}</p><p className="text-xs text-white/30">{monthLabel(s.period)}{s.locked ? " · locked" : ""}</p></div>
              <span className="font-semibold text-salon-gold">{INR(s.net_pay)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Row({ label, v, sub }: { label: string; v: number; sub?: boolean }) {
  return <div className={`flex justify-between ${sub ? "text-white/40 text-xs pl-3" : "text-white/70"}`}><span>{label}</span><span className={v < 0 ? "text-red-400" : ""}>{v < 0 ? "−" : ""}₹{Math.abs(v).toLocaleString("en-IN")}</span></div>;
}
