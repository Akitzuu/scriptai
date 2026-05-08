import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">ScriptAI Dashboard</h1>
      <p className="text-slate-400">Tu es connecté !</p>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
