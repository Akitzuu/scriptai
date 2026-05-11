import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Codes promo disponibles
const PROMO_CODES: Record<string, { credits: number; description: string }> = {
  PRODUCTHUNT: { credits: 10, description: "10 crédits offerts - Product Hunt Launch 🚀" },
};

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { code } = await req.json();
    const normalizedCode = code?.trim().toUpperCase();

    if (!normalizedCode) {
      return NextResponse.json({ error: "Code invalide" }, { status: 400 });
    }

    const promo = PROMO_CODES[normalizedCode];
    if (!promo) {
      return NextResponse.json({ error: "Code promo invalide" }, { status: 400 });
    }

    // Récupérer ou créer l'utilisateur
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";

    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: { id: userId, clerkId: userId, email, credits: 3 },
    });

    // Vérifier si le code a déjà été utilisé
    if (user.promoCodesUsed?.includes(normalizedCode)) {
      return NextResponse.json({ error: "Tu as déjà utilisé ce code promo" }, { status: 400 });
    }

    // Appliquer le code promo
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        credits: { increment: promo.credits },
        promoCodesUsed: { push: normalizedCode },
      },
    });

    return NextResponse.json({
      success: true,
      credits: promo.credits,
      description: promo.description,
      totalCredits: updatedUser.credits,
    });
  } catch (error) {
    console.error("[PROMO]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
