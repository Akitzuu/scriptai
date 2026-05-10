"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, Loader2 } from "lucide-react";

const platforms = [
  { value: "YOUTUBE", label: "YouTube", emoji: "🎥" },
  { value: "TIKTOK", label: "TikTok", emoji: "🎵" },
  { value: "SHORTS", label: "YouTube Shorts", emoji: "⚡" },
  { value: "REELS", label: "Instagram Reels", emoji: "📱" },
];

const tones = [
  { value: "EDUCATIF", label: "Éducatif", desc: "Informatif et pédagogue" },
  { value: "DIVERTISSANT", label: "Divertissant", desc: "Fun et engageant" },
  { value: "INSPIRANT", label: "Inspirant", desc: "Motivant et positif" },
  { value: "STORYTELLING", label: "Storytelling", desc: "Narratif et émotionnel" },
  { value: "VIRAL", label: "Viral", desc: "Choquant et accrocheur" },
];

const durations = [
  { value: 60, label: "60 sec" },
  { value: 180, label: "3 min" },
  { value: 300, label: "5 min" },
  { value: 600, label: "10 min" },
];

export default function GeneratePage() {
  const [platform, setPlatform] = useState("YOUTUBE");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("EDUCATIF");
  const [duration, setDuration] = useState(60);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ script: string; hooks: string[]; creditsRemaining: number } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    if (!topic.trim()) {
      setError("Saisis un sujet pour ton script.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, topic, tone, duration }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erreur lors de la génération.");
        return;
      }

      setResult(data);
    } catch {
      setError("Erreur réseau. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Générer un script</h1>
        <p className="text-slate-400 mt-1">Configure ton script et laisse l&apos;IA faire le reste.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Formulaire */}
        <div className="space-y-6">
          {/* Plateforme */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Plateforme</label>
            <div className="grid grid-cols-2 gap-2">
              {platforms.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPlatform(p.value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    platform === p.value
                      ? "bg-violet-600 border-violet-500 text-white"
                      : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white"
                  }`}
                >
                  <span>{p.emoji}</span>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sujet */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Sujet de la vidéo
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Comment économiser 500€ par mois en 5 étapes simples..."
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none text-sm"
            />
          </div>

          {/* Ton */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Ton</label>
            <div className="space-y-2">
              {tones.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTone(t.value)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border text-sm transition-colors ${
                    tone === t.value
                      ? "bg-violet-600 border-violet-500 text-white"
                      : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white"
                  }`}
                >
                  <span className="font-medium">{t.label}</span>
                  <span className={`text-xs ${tone === t.value ? "text-violet-200" : "text-slate-500"}`}>
                    {t.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Durée */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Durée</label>
            <div className="grid grid-cols-4 gap-2">
              {durations.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDuration(d.value)}
                  className={`py-2 rounded-lg border text-sm font-medium transition-colors ${
                    duration === d.value
                      ? "bg-violet-600 border-violet-500 text-white"
                      : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Bouton */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Générer le script (1 crédit)
              </>
            )}
          </button>
        </div>

        {/* Résultat */}
        <div>
          {!result && !loading && (
            <div className="h-full flex items-center justify-center border border-dashed border-slate-700 rounded-xl">
              <div className="text-center text-slate-600">
                <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Ton script apparaîtra ici</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="h-full flex items-center justify-center border border-dashed border-violet-700/50 rounded-xl bg-violet-900/10">
              <div className="text-center">
                <Loader2 className="w-10 h-10 mx-auto mb-3 text-violet-400 animate-spin" />
                <p className="text-slate-400 text-sm">L&apos;IA écrit ton script...</p>
                <p className="text-slate-600 text-xs mt-1">Cela peut prendre 10-20 secondes</p>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Crédits restants */}
              <div className="bg-emerald-900/20 border border-emerald-700/50 rounded-lg px-4 py-2 text-emerald-400 text-sm flex items-center justify-between">
                <span>✅ Script généré avec succès !</span>
                <span className="text-xs text-emerald-600">{result.creditsRemaining} crédit(s) restant(s)</span>
              </div>

              {/* Script principal */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-300">Script</h3>
                  <button
                    onClick={() => handleCopy(result.script)}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copié !" : "Copier"}
                  </button>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto">
                  {result.script}
                </p>
              </div>

              {/* Hooks alternatifs */}
              {result.hooks.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-slate-300 mb-3">💡 Hooks alternatifs</h3>
                  <div className="space-y-2">
                    {result.hooks.map((hook, i) => (
                      <div key={i} className="flex items-start gap-2 group">
                        <span className="text-violet-500 text-xs font-bold mt-0.5">{i + 1}.</span>
                        <p className="text-slate-400 text-sm flex-1">{hook}</p>
                        <button
                          onClick={() => handleCopy(hook)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-white"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
