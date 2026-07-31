import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { MinesGameClient } from "./MinesGameClient";
import { prisma } from "@/lib/prisma";

export default async function MinesPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  // Fetch config
  const configs = await prisma.systemConfig.findMany({
    where: { key: { in: ["mines_active", "mines_multiplier", "mines_max_bet"] } }
  });

  const map = configs.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const isActive = map.mines_active === "true";
  const multiplier = parseFloat(map.mines_multiplier || "1.5");
  const maxBet = parseFloat(map.mines_max_bet || "100");

  if (!isActive) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-[#13151a] p-8 rounded-xl border border-[#262933]">
          <h2 className="text-xl font-bold text-red-500 mb-2">Evento Desativado</h2>
          <p className="text-[#9ca3af]">O Casino Mines está offline no momento. Tente novamente mais tarde.</p>
        </div>
      </div>
    );
  }

  // Fetch user balance
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { balance: true }
  });

  return (
    <MinesGameClient 
      baseMultiplier={multiplier} 
      maxBet={maxBet} 
      initialBalance={user?.balance || 0} 
    />
  );
}
