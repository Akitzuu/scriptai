"use client";

import { useState } from "react";
import { FileText, Clock, PlayCircle, Music2, Zap, Camera, Copy, Check, X } from "lucide-react";
import Link from "next/link";

type Script = {
  id: string;
  platform: string;
  topic: string;
  tone: string;
  duration: number;
  content: string;
  hooks: string[];
  createdAt: string;
};

const platformConfig: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  YOUTUBE: { label: "YouTube", icon: PlayCircle, color: "text-red-400", bg: "bg-red-900/20" },
  TIKTOK: { label: "TikTok", icon: Music2, color: "text-pink-400", bg: "bg-pink-900/20" },
  SHORTS: { label: "Shorts", icon: Zap, color: "text-amber-400", bg: "bg-amber-900/20" },
  REELS: { label: "Reels", icon: Camera, color: "text-purple-400", bg: "bg-purple-900/20" },
};

const toneLabels: Record<string, string> = {
  EDUCATIF: "Éducatif",
  DIVERTISSANT: "Divertissant",
  INSPIRANT: "Inspirant",
  STORYTELLING: "Storytelling",
  VIRAL: "Viral",
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(iso));
}

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}min`;
}

export function HistoryClient({ scripts }: { scripts: Script[] }) {
  const [selected, setSelected] = useState<Script | null>(null);
  const [copied, setCopied] = useState(false);

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Historique</h1>
          <p className="text-slate-400 mt-1">
            {scripts.length} script{scripts.length !== 1 ? "s" : ""} généré{scripts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/dashboard/generate"
          className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Nouveau script
        </Link>
      </div>

      {/* Liste */}
      {scripts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FileText className="w-16 h-16 text-slate-700 mb-4" />
          <h2 className="text-xl font-semibold text-slate-400 mb-2">Aucun script pour l&apos;instant</h2>
          <p className="text-slate-600 mb-6">Génère ton premier script en quelques secondes.</p>
          <Link
            href="/dashboard/generate"
            className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Générer un script
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {scripts.map((script) => {
            const config = platformConfig[script.platform] ?? platformConfig.YOUTUBE;
            const Icon = config.icon;
            return (
              <div
                key={script.id}
                onClick={() => setSelected(script)}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-violet-700/50 hover:bg-slate-800/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                        {config.label}
                      </span>
                      <span className="text-xs text-slate-500 border border-slate-700 px-2 py-0.5 rounded-full">
                        {toneLabels[script.tone] ?? script.tone}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />{formatDuration(script.duration)}
                      </span>
                    </div>
                    <h3 className="text-white font-medium truncate">{script.topic}</h3>
                    <p className="text-slate-500 text-sm mt-1 line-clamp-1">{script.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-slate-600 text-xs">{formatDate(script.createdAt)}</span>
                      <span className="text-violet-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        Cliquer pour ouvrir →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between p-6 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${platformConfig[selected.platform]?.bg} ${platformConfig[selected.platform]?.color}`}>
                    {platformConfig[selected.platform]?.label}
                  </span>
                  <span className="text-xs text-slate-500 border border-slate-700 px-2 py-0.5 rounded-full">
                    {toneLabels[selected.tone]}
                  </span>
                  <span className="text-xs text-slate-500">{formatDuration(selected.duration)}</span>
                </div>
                <h2 className="text-white font-semibold text-lg">{selected.topic}</h2>
                <p className="text-slate-500 text-xs mt-0.5">{formatDate(selected.createdAt)}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-slate-500 hover:text-white transition-colors ml-4 flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal content */}
            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              {/* Script */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-slate-300 font-medium text-sm uppercase tracking-wide">Script</h3>
                  <button
                    onClick={() => handleCopy(selected.content)}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copié !" : "Copier"}
                  </button>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap bg-slate-800/50 rounded-xl p-4">
                  {selected.content}
                </p>
              </div>

              {/* Hooks */}
              {selected.hooks.length > 0 && (
                <div>
                  <h3 className="text-slate-300 font-medium text-sm uppercase tracking-wide mb-3">
                    💡 Hooks alternatifs
                  </h3>
                  <div className="space-y-2">
                    {selected.hooks.map((hook, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 bg-slate-800/50 rounded-xl p-3 group"
                      >
                        <span className="text-violet-500 font-bold text-sm flex-shrink-0">{i + 1}.</span>
                        <p className="text-slate-300 text-sm flex-1">{hook}</p>
                        <button
                          onClick={() => handleCopy(hook)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-white"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
