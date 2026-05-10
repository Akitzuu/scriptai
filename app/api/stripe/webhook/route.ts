import { NextRequest, NextResponse } from "next/server";
import { stripe, PLANS } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Webhook invalide" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan as keyof typeof PLANS;

    if (userId && plan && PLANS[plan]) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: plan,
          credits: { increment: PLANS[plan].credits },
        },
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;
    const customer = await stripe.customers.retrieve(subscription.customer as string);

    if (customer && !customer.deleted) {
      const user = await prisma.user.findFirst({
        where: { stripeCustomerId: customer.id },
      });
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { plan: "FREE" },
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
