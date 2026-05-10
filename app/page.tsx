import Link from "next/link";
import { Zap, Sparkles, Clock, TrendingUp } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg">ScriptAI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="text-slate-400 hover:text-white text-sm transition-colors">
            Connexion
          </Link>
          <Link
            href="/sign-up"
            className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Commencer gratuitement
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-32">
        <div className="inline-flex items-center gap-2 bg-violet-900/30 border border-violet-700/50 rounded-full px-4 py-1.5 text-violet-300 text-sm mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          Propulsé par Llama 3.3 70B
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
          Des scripts vidéo{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
            viraux
          </span>
          <br />en 30 secondes
        </h1>

        <p className="text-slate-400 text-xl max-w-2xl mb-10">
          Génère des scripts professionnels pour YouTube, TikTok, Shorts et Reels.
          Arrête de bloquer sur la page blanche.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/sign-up"
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg"
          >
            Essayer gratuitement →
          </Link>
          <Link
            href="/sign-in"
            className="border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg"
          >
            Se connecter
          </Link>
        </div>

        <p className="text-slate-600 text-sm mt-4">3 scripts offerts • Sans carte bancaire</p>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-32 grid md:grid-cols-3 gap-6">
        {[
          {
            icon: Zap,
            title: "Ultra rapide",
            desc: "Un script complet généré en moins de 30 secondes grâce à l'IA.",
            color: "text-amber-400",
            bg: "bg-amber-900/20",
          },
          {
            icon: TrendingUp,
            title: "Optimisé par plateforme",
            desc: "YouTube, TikTok, Shorts, Reels — chaque format est adapté au réseau.",
            color: "text-emerald-400",
            bg: "bg-emerald-900/20",
          },
          {
            icon: Clock,
            title: "Hooks inclus",
            desc: "3 accroches alternatives générées pour maximiser ton taux de rétention.",
            color: "text-violet-400",
            bg: "bg-violet-900/20",
          },
        ].map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${f.color}`} />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}
