"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, MessageCircle } from "lucide-react";

export default function SuperLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"request" | "verify">("request");
  const [sentTo, setSentTo] = useState("");
  const [ttl, setTtl] = useState(5);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function requestOtp() {
    setBusy(true); setErr("");
    const res = await fetch("/api/admin/super-login/request", { method: "POST" });
    const d = await res.json();
    setBusy(false);
    if (!res.ok) { setErr(d.error ?? "Couldn't send the code."); return; }
    setSentTo(d.sent_to); setTtl(d.ttl ?? 5); setStep("verify");
  }

  async function verifyOtp() {
    if (!/^\d{6}$/.test(code)) { setErr("Enter the 6-digit code."); return; }
    setBusy(true); setErr("");
    const res = await fetch("/api/admin/super-login/verify", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const d = await res.json();
    setBusy(false);
    if (!res.ok) { setErr(d.error ?? "Verification failed."); return; }
    router.push("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-salon-black px-5">
      <div className="w-full max-w-sm rounded-2xl border border-salon-gold/30 bg-white/[0.02] p-8">
        <p className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-salon-gold">
          <ShieldCheck className="h-3.5 w-3.5" /> Owner Access
        </p>
        <h1 className="mt-3 font-display text-4xl uppercase text-white">Super Admin</h1>

        {step === "request" ? (
          <>
            <p className="mt-3 text-sm text-white/50">
              We&apos;ll send a 6-digit code over WhatsApp to the owner number on file.
            </p>
            {err && <p className="mt-4 text-sm text-red-400">{err}</p>}
            <button onClick={requestOtp} disabled={busy}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-salon-gold py-3.5 text-sm font-bold uppercase tracking-wider text-salon-black disabled:opacity-50">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
              Send WhatsApp code
            </button>
          </>
        ) : (
          <>
            <p className="mt-3 text-sm text-white/50">
              Code sent to <span className="text-white">{sentTo}</span> · valid {ttl} min.
            </p>
            <input
              value={code}
              onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setErr(""); }}
              inputMode="numeric" maxLength={6} placeholder="••••••" autoFocus
              className="mt-5 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-center text-2xl tracking-[0.5em] text-white placeholder-white/20 focus:border-salon-gold focus:outline-none"
            />
            {err && <p className="mt-3 text-sm text-red-400">{err}</p>}
            <button onClick={verifyOtp} disabled={busy || code.length !== 6}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-salon-gold py-3.5 text-sm font-bold uppercase tracking-wider text-salon-black disabled:opacity-40">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} Verify & sign in
            </button>
            <button onClick={() => { setStep("request"); setCode(""); setErr(""); }}
              className="mt-4 w-full text-center text-xs text-white/40 hover:text-white">
              Resend code
            </button>
          </>
        )}

        <a href="/admin/login" className="mt-6 block text-center text-xs text-white/30 hover:text-white/60">
          Front-desk login →
        </a>
      </div>
    </main>
  );
}
