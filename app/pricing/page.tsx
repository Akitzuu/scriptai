"use client";

import { useState } from "react";
import { Check, Zap, Loader2 } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    key: "FREE",
    name: "Gratuit",
    price: 0,
    credits: 3,
    features: [
      "3 scripts offerts",
      "YouTube, TikTok, Shorts, Reels",
      "5 tons disponibles",
      "Hooks alternatifs inclus",
    ],
    cta: "Commencer gratuitement",
    href: "/sign-up",
    highlight: false,
  },
  {
    key: "STARTER",
    name: "Starter",
    price: 9,
    credits: 50,
    features: [
      "50 crédits / mois",
      "YouTube, TikTok, Shorts, Reels",
      "5 tons disponibles",
      "Hooks alternatifs inclus",
      "Historique illimité",
    ],
    cta: "Choisir Starter",
    highlight: false,
  },
  {
    key: "PRO",
    name: "Pro",
    price: 29,
    credits: 200,
    features: [
      "200 crédits / mois",
      "YouTube, TikTok, Shorts, Reels",
      "5 tons disponibles",
      "Hooks alternatifs inclus",
      "Historique illimité",
      "Support prioritaire",
    ],
    cta: "Choisir Pro",
    highlight: true,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleCheckout(planKey: string) {
    if (planKey === "FREE") return;
    setLoading(planKey);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert("Erreur lors du paiement. Réessaie.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg">ScriptAI</span>
        </Link>
        <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm transition-colors">
          Dashboard →
        </Link>
      </nav>

      {/* Header */}
      <div className="text-center py-16 px-6">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Tarifs simples et transparents</h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Commence gratuitement, passe au plan supérieur quand tu es prêt.
        </p>
      </div>

      {/* Plans */}
      <div className="max-w-5xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.key}
            className={`relative rounded-2xl p-6 flex flex-col ${
              plan.highlight
                ? "bg-violet-600 border-2 border-violet-400"
                : "bg-slate-900 border border-slate-800"
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                ⭐ Populaire
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black">{plan.price}€</span>
                {plan.price > 0 && <span className={`text-sm mb-1 ${plan.highlight ? "text-violet-200" : "text-slate-500"}`}>/mois</span>}
              </div>
              <p className={`text-sm mt-1 ${plan.highlight ? "text-violet-200" : "text-slate-500"}`}>
                {plan.credits} crédits{plan.price > 0 ? " par mois" : " offerts"}
              </p>
            </div>

            <ul className="space-y-3 flex-1 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? "text-violet-200" : "text-emerald-400"}`} />
                  <span className={plan.highlight ? "text-violet-100" : "text-slate-300"}>{f}</span>
                </li>
              ))}
            </ul>

            {plan.key === "FREE" ? (
              <Link
                href="/sign-up"
                className={`w-full py-3 rounded-xl font-semibold text-center transition-colors ${
                  plan.highlight
                    ? "bg-white text-violet-600 hover:bg-violet-50"
                    : "bg-slate-800 hover:bg-slate-700 text-white"
                }`}
              >
                {plan.cta}
              </Link>
            ) : (
              <button
                onClick={() => handleCheckout(plan.key)}
                disabled={loading === plan.key}
                className={`w-full py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60 ${
                  plan.highlight
                    ? "bg-white text-violet-600 hover:bg-violet-50"
                    : "bg-violet-600 hover:bg-violet-700 text-white"
                }`}
              >
                {loading === plan.key ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Chargement...</>
                ) : plan.cta}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
