import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { stripe, PLANS } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { plan } = await req.json();
    const planConfig = PLANS[plan as keyof typeof PLANS];

    if (!planConfig) {
      return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
    }

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";

    // Récupérer ou créer l'utilisateur
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: { id: userId, clerkId: userId, email, credits: 3 },
    });

    // Créer ou récupérer le customer Stripe
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: { clerkId: userId },
      });
      customerId = customer.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    // Créer la session checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: planConfig.priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard?success=true&plan=${plan}`,
      cancel_url: `${appUrl}/pricing`,
      metadata: { userId: user.id, plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[STRIPE_CHECKOUT]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
