"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getMinesConfig() {
  const configs = await prisma.systemConfig.findMany({
    where: { key: { in: ["mines_active", "mines_multiplier", "mines_max_bet"] } }
  });

  const map = configs.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return {
    isActive: map.mines_active === "true",
    multiplier: map.mines_multiplier || "1.5",
    maxBet: map.mines_max_bet || "100"
  };
}

export async function saveMinesConfig(isActive: boolean, multiplier: string, maxBet: string) {
  const session = await auth();
  const userRole = (session?.user as any)?.role;
  if (!session?.user || (userRole !== "ADMIN" && userRole !== "SUPERADMIN" && userRole !== "OWNER")) {
    return { success: false, error: "Não autorizado" };
  }

  try {
    await prisma.systemConfig.upsert({
      where: { key: "mines_active" },
      update: { value: isActive ? "true" : "false" },
      create: { key: "mines_active", value: isActive ? "true" : "false" }
    });
    
    await prisma.systemConfig.upsert({
      where: { key: "mines_multiplier" },
      update: { value: multiplier },
      create: { key: "mines_multiplier", value: multiplier }
    });

    await prisma.systemConfig.upsert({
      where: { key: "mines_max_bet" },
      update: { value: maxBet },
      create: { key: "mines_max_bet", value: maxBet }
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
