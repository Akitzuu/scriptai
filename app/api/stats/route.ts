import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-api-secret");
  if (secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      select: { plan: true },
    });

    const totalUsers = users.length;
    const starterUsers = users.filter((u) => u.plan === "STARTER").length;
    const proUsers = users.filter((u) => u.plan === "PRO").length;
    const freeUsers = users.filter((u) => u.plan === "FREE").length;

    const totalScripts = await prisma.script.count();

    const theoreticalMrr = starterUsers * 9 + proUsers * 29;

    return NextResponse.json({
      totalUsers: totalUsers ?? 0,
      totalScripts: totalScripts ?? 0,
      starterUsers: starterUsers ?? 0,
      proUsers: proUsers ?? 0,
      freeUsers: freeUsers ?? 0,
      mrr: theoreticalMrr,
      theoreticalMrr: theoreticalMrr,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[STATS]", error);
    return NextResponse.json({
      totalUsers: 0,
      totalScripts: 0,
      starterUsers: 0,
      proUsers: 0,
      freeUsers: 0,
      mrr: 0,
      theoreticalMrr: 0,
      updatedAt: new Date().toISOString(),
    });
  }
}
