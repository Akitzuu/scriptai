import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Sparkles, FileText, Coins } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const { userId } = await auth();

  let user = null;
  let scriptCount = 0;

  if (userId) {
    try {
      const clerkUser = await currentUser();
      const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";

      user = await prisma.user.upsert({
        where: { clerkId: userId },
        update: {},
        create: {
          id: userId,
          clerkId: userId,
          email,
          credits: 3,
        },
        include: { _count: { select: { scripts: true } } },
      });
      scriptCount = user?._count?.scripts ?? 0;
    } catch {
      // DB unavailable — show default values
    }
  }

  const credits = user?.credits ?? 0;
  const plan = user?.plan ?? "FREE";

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Tableau de bord</h1>
        <p className="text-slate-400 mt-1">Bienvenue sur ScriptAI 🎬</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-violet-600/20 flex items-center justify-center">
              <Coins className="w-5 h-5 text-violet-400" />
            </div>
            <span className="text-slate-400 text-sm">Crédits restants</span>
          </div>
          <p className="text-3xl font-bold text-white">{credits}</p>
          <p className="text-slate-500 text-xs mt-1">Plan {plan}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-600/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-slate-400 text-sm">Scripts générés</span>
          </div>
          <p className="text-3xl font-bold text-white">{scriptCount}</p>
          <p className="text-slate-500 text-xs mt-1">Au total</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-600/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-slate-400 text-sm">Plateforme</span>
          </div>
          <p className="text-3xl font-bold text-white">4</p>
          <p className="text-slate-500 text-xs mt-1">YouTube, TikTok, Shorts, Reels</p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-violet-900/40 to-violet-600/20 border border-violet-700/50 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Prêt à créer ton prochain script ?</h2>
          <p className="text-slate-400 text-sm">
            {credits > 0
              ? `Tu as ${credits} crédit${credits > 1 ? "s" : ""} disponible${credits > 1 ? "s" : ""}.`
              : "Tu n'as plus de crédits. Passe à un plan supérieur."}
          </p>
        </div>
        <Link
          href="/dashboard/generate"
          className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4" />
          Générer un script
        </Link>
      </div>
    </div>
  );
}
