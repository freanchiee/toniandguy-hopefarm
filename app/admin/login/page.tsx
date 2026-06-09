"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      router.push("/admin");
    } else {
      const d = await res.json();
      setError(d.error ?? "Invalid credentials");
    }
    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-salon-black px-4">
      <div className="w-full max-w-sm">
        <p className="text-center text-xs uppercase tracking-[0.22em] text-salon-gold">Admin Access</p>
        <h1 className="mt-2 text-center font-display text-4xl">Toni & Guy</h1>
        <p className="mt-1 text-center text-sm text-white/30">Hopefarm Dashboard</p>

        <form onSubmit={login} className="mt-10 space-y-4">
          <div>
            <label className="mb-1 block text-xs text-white/40">Username</label>
            <input
              value={username} onChange={e => setUsername(e.target.value)}
              autoComplete="username" required
              className="w-full rounded-lg border border-white/18 bg-white/5 px-4 py-3 text-white placeholder-white/20 focus:border-salon-gold focus:outline-none"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-white/40">Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              autoComplete="current-password" required
              className="w-full rounded-lg border border-white/18 bg-white/5 px-4 py-3 text-white placeholder-white/20 focus:border-salon-gold focus:outline-none"
              placeholder="Enter password"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-salon-gold py-3 text-sm font-bold text-salon-black hover:brightness-110 disabled:opacity-40">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
}
