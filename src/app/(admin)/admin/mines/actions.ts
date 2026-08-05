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
    const oldConfig = await prisma.systemConfig.findUnique({
      where: { key: "mines_active" }
    });
    const wasActive = oldConfig?.value === "true";

    await prisma.systemConfig.upsert({
      where: { key: "mines_active" },
      update: { value: isActive ? "true" : "false" },
      create: { key: "mines_active", value: isActive ? "true" : "false" }
    });

    // Se o status mudou, gera notificação para todos os usuários
    if (wasActive !== isActive) {
      // Cria uma única notificação no banco se houver suporte a global (ou envia uma para cada, como parece ser o caso do site)
      // Como não há tabela de notificação global padrão listada antes, mas Notification tem userId... 
      // Fazer um findMany pode ser pesado se houver muitos usuários, mas é assim que o Prisma faria sem raw query avançada
      const users = await prisma.user.findMany({ select: { id: true } });
      const notifications = users.map(u => ({
        userId: u.id,
        title: isActive ? "Evento Mines Iniciado! 💣" : "Evento Mines Encerrado",
        message: isActive 
          ? "O evento de Casino Mines acaba de começar! Vá até a aba Mines e boa sorte nas apostas." 
          : "O evento de Casino Mines terminou. Fique de olho para quando ele retornar!",
        type: isActive ? "MINES_START" : "MINES_END"
      }));
      
      // Insere em lote (ignora erro se type não for aceito e usa padrão)
      try {
        await prisma.notification.createMany({
          data: notifications
        });
      } catch (e: any) {
        // Fallback caso enum "type" seja estrito, usamos "SYSTEM"
        await prisma.notification.createMany({
          data: notifications.map(n => ({ ...n, type: "SYSTEM" }))
        });
      }
    }

    
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
