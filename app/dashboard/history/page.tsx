import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { HistoryClient } from "./history-client";

export default async function HistoryPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });

  if (!user) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Compte non trouvé. Reconnecte-toi.</p>
      </div>
    );
  }

  const scripts = await prisma.script.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const serialized = scripts.map((s) => ({
    ...s,
    createdAt: s.createdAt.toISOString(),
  }));

  return <HistoryClient scripts={serialized} />;
}
