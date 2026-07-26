"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Download, TrendingUp, TrendingDown, Trophy } from "lucide-react";

const INR = (v: number) => `₹${(v ?? 0).toLocaleString("en-IN")}`;
const KIND = [
  { key: "service", label: "Services", color: "#c9a84c" },
  { key: "product", label: "Products", color: "#7ea8c4" },
  { key: "package_redemption", label: "Package", color: "#c48ca0" },
] as const;
const CATEGORIES = ["Haircut", "Colour", "Highlights", "Treatment", "Hair Spa", "Blow Dry", "Styling", "Facial", "Manicure", "Pedicure", "Threading", "Waxing", "Massage", "product"];
const inp = "rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:border-salon-gold focus:outline-none";

export function SalesDashboardTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
  const [f, setF] = useState({
    from: new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10),
    to: new Date().toISOString().slice(0, 10),
    granularity: "daily", category: "", employee: "",
  });

  useEffect(() => { fetch("/api/admin/employees?active=1").then((r) => r.json()).then((d) => setEmployees(d.employees ?? [])); }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const qs = new URLSearchParams(f as any).toString();
    const d = await fetch(`/api/admin/sales?${qs}`).then((r) => r.json());
    setData(d); setLoading(false);
  }, [f]);
  useEffect(() => { load(); }, [load]);

  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  const exportUrl = `/api/admin/sales/export?${new URLSearchParams({ from: f.from, to: f.to, category: f.category, employee: f.employee }).toString()}`;

  const series = data?.series ?? [];
  const maxTotal = Math.max(1, ...series.map((s: any) => s.total));
  const mom = data?.mom;

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div><label className="mb-1 block text-xs text-white/40">From</label><input type="date" value={f.from} onChange={(e) => set("from", e.target.value)} className={`${inp} [color-scheme:dark]`} /></div>
        <div><label className="mb-1 block text-xs text-white/40">To</label><input type="date" value={f.to} onChange={(e) => set("to", e.target.value)} className={`${inp} [color-scheme:dark]`} /></div>
        <div><label className="mb-1 block text-xs text-white/40">Group</label>
          <select value={f.granularity} onChange={(e) => set("granularity", e.target.value)} className={inp}><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option></select></div>
        <div><label className="mb-1 block text-xs text-white/40">Category</label>
          <select value={f.category} onChange={(e) => set("category", e.target.value)} className={inp}><option value="">All</option>{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
        <div><label className="mb-1 block text-xs text-white/40">Stylist</label>
          <select value={f.employee} onChange={(e) => set("employee", e.target.value)} className={inp}><option value="">All</option>{employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select></div>
        <a href={exportUrl} className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/60 hover:border-salon-gold hover:text-salon-gold"><Download className="h-3.5 w-3.5" /> Export</a>
      </div>

      {loading || !data ? <div className="flex items-center gap-2 py-16 text-white/40"><Loader2 className="h-4 w-4 animate-spin" />Loading…</div> : (
        <>
          {/* KPI + MoM */}
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-white/8 p-4"><p className="text-xs uppercase tracking-wider text-white/40">Range total</p><p className="mt-1 text-2xl font-bold text-salon-gold">{INR(data.totals.total)}</p><p className="text-xs text-white/30">{data.totals.services} services</p></div>
            {KIND.map((k) => (
              <div key={k.key} className="rounded-xl border border-white/8 p-4"><p className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-white/40"><span className="h-2 w-2 rounded-full" style={{ background: k.color }} />{k.label}</p><p className="mt-1 text-2xl font-bold text-white">{INR(data.totals[k.key])}</p></div>
            ))}
          </div>

          {mom && (
            <div className="mb-8 flex flex-wrap items-center gap-4 rounded-xl border border-white/8 bg-white/[0.02] p-4">
              <div><p className="text-xs uppercase tracking-wider text-white/40">This month (MTD)</p><p className="text-xl font-bold text-white">{INR(mom.current.total)}</p></div>
              <div><p className="text-xs uppercase tracking-wider text-white/40">Same span last month</p><p className="text-xl font-bold text-white/60">{INR(mom.previous.total)}</p></div>
              {mom.deltaPct != null && (
                <div className={`flex items-center gap-1 text-sm font-semibold ${mom.deltaPct >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {mom.deltaPct >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}{mom.deltaPct >= 0 ? "+" : ""}{mom.deltaPct}%
                </div>
              )}
            </div>
          )}

          {/* Stacked bar chart */}
          <div className="mb-8 rounded-xl border border-white/8 p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-white">Revenue over time</p>
              <div className="flex gap-3 text-xs">{KIND.map((k) => <span key={k.key} className="flex items-center gap-1 text-white/50"><span className="h-2 w-2 rounded-full" style={{ background: k.color }} />{k.label}</span>)}</div>
            </div>
            {series.length === 0 ? <p className="py-8 text-center text-sm text-white/30">No sales in this range.</p> : (
              <div className="flex h-48 items-end gap-1 overflow-x-auto">
                {series.map((s: any) => (
                  <div key={s.period} className="flex min-w-[14px] flex-1 flex-col items-center gap-1" title={`${s.period}: ${INR(s.total)}`}>
                    <div className="flex w-full flex-col justify-end" style={{ height: "160px" }}>
                      {KIND.map((k) => s[k.key] > 0 && <div key={k.key} style={{ height: `${(s[k.key] / maxTotal) * 160}px`, background: k.color }} />)}
                    </div>
                    <span className="text-[8px] text-white/25">{s.period.slice(5)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Leaderboard */}
          <div className="rounded-xl border border-white/8 p-5">
            <p className="mb-4 flex items-center gap-2 text-sm font-medium text-white"><Trophy className="h-4 w-4 text-salon-gold" /> Stylist leaderboard</p>
            {(!data.leaderboard || data.leaderboard.length === 0) ? <p className="text-sm text-white/30">No attributed sales in range.</p> : (
              <div className="space-y-2">
                {data.leaderboard.map((e: any, i: number) => {
                  const max = data.leaderboard[0].revenue || 1;
                  return (
                    <div key={e.id} className={e.active ? "" : "opacity-50"}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="text-white/80">{i + 1}. {e.name}<span className="ml-2 text-xs text-white/30">{e.services} services</span></span>
                        <span className="font-semibold text-salon-gold">{INR(e.revenue)}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/8"><div className="h-1.5 rounded-full bg-salon-gold" style={{ width: `${(e.revenue / max) * 100}%` }} /></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
