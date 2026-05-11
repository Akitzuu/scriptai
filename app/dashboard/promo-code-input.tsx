"use client";

import { useState } from "react";
import { Tag, Loader2, CheckCircle, XCircle } from "lucide-react";

export function PromoCodeInput() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setResult({
          type: "success",
          message: `${data.description} — Tu as maintenant ${data.totalCredits} crédits.`,
        });
        setCode("");
      } else {
        setResult({
          type: "error",
          message: data.error ?? "Une erreur est survenue.",
        });
      }
    } catch {
      setResult({ type: "error", message: "Erreur réseau. Réessaie." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-violet-600/20 flex items-center justify-center">
          <Tag className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold">Code promo</h3>
          <p className="text-slate-400 text-xs">Entre ton code pour obtenir des crédits gratuits</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="ex: PRODUCTHUNT"
          disabled={loading}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 disabled:opacity-50 uppercase tracking-wider"
        />
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Appliquer"
          )}
        </button>
      </form>

      {result && (
        <div
          className={`mt-3 flex items-start gap-2 text-sm rounded-lg px-4 py-3 ${
            result.type === "success"
              ? "bg-emerald-900/30 border border-emerald-700/50 text-emerald-300"
              : "bg-red-900/30 border border-red-700/50 text-red-300"
          }`}
        >
          {result.type === "success" ? (
            <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
          )}
          <span>{result.message}</span>
        </div>
      )}
    </div>
  );
}
