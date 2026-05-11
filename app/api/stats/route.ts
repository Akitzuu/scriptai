import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  // Vérification de la clé secrète
  const secret = req.headers.get("x-api-secret");
  if (secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    // Stats DB
    const [totalUsers, totalScripts, starterUsers, proUsers] = await Promise.all([
      prisma.user.count(),
      prisma.script.count(),
      prisma.user.count({ where: { plan: "STARTER" } }),
      prisma.user.count({ where: { plan: "PRO" } }),
    ]);

    // Revenus Stripe du mois en cours
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const charges = await stripe.charges.list({
      created: { gte: Math.floor(startOfMonth.getTime() / 1000) },
      limit: 100,
    });

    const mrr = charges.data
      .filter((c) => c.paid && !c.refunded)
      .reduce((acc, c) => acc + c.amount, 0) / 100; // en euros

    // MRR théorique (abonnements actifs)
    const theoreticalMrr = starterUsers * 9 + proUsers * 29;

    return NextResponse.json({
      totalUsers,
      totalScripts,
      starterUsers,
      proUsers,
      freeUsers: totalUsers - starterUsers - proUsers,
      mrr: Math.round(mrr * 100) / 100,
      theoreticalMrr,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[STATS]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
