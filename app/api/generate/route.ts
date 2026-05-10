import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { groq, SCRIPT_SYSTEM_PROMPT } from "@/lib/groq";
import { Platform, Tone } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer ou créer l'utilisateur en base
    const { currentUser } = await import("@clerk/nextjs/server");
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";

    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: {
        id: userId,
        clerkId: userId,
        email,
        credits: 3,
      },
    });

    // Vérifier les crédits
    if (user.credits <= 0) {
      return NextResponse.json(
        { error: "Plus de crédits disponibles. Passez à un plan supérieur." },
        { status: 402 }
      );
    }

    const body = await req.json();
    const { platform, topic, tone, duration } = body;

    if (!platform || !topic || !tone || !duration) {
      return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
    }

    // Prompt utilisateur
    const userPrompt = `Génère un script vidéo pour ${platform} sur le sujet : "${topic}".
Ton : ${tone}
Durée cible : ${duration} secondes (environ ${Math.round((duration / 60) * 150)} mots)
Plateforme : ${platform}

Réponds UNIQUEMENT avec un JSON valide, sans texte avant ou après.`;

    // Appel Groq
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SCRIPT_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 4000,
    });

    const rawContent = completion.choices[0]?.message?.content ?? "";

    // Parser le JSON retourné
    let parsed: { script: string; hooks: string[] };
    try {
      // Extraire le JSON même si l'IA a ajouté du texte autour
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Pas de JSON trouvé");
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json(
        { error: "Erreur lors du parsing de la réponse IA" },
        { status: 500 }
      );
    }

    // Décrémenter les crédits et sauvegarder le script en parallèle
    const [, script] = await Promise.all([
      prisma.user.update({
        where: { id: user.id },
        data: { credits: { decrement: 1 } },
      }),
      prisma.script.create({
        data: {
          userId: user.id,
          platform: platform as Platform,
          topic,
          tone: tone as Tone,
          duration: Number(duration),
          content: parsed.script,
          hooks: parsed.hooks ?? [],
        },
      }),
    ]);

    return NextResponse.json({
      script: script.content,
      hooks: script.hooks,
      scriptId: script.id,
      creditsRemaining: user.credits - 1,
    });
  } catch (error) {
    console.error("[GENERATE]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
