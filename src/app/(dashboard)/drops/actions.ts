"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function claimDrop(eventId: string, password?: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado" };

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });
    
    if (!user) return { success: false, error: "Usuário não encontrado" };

    const event = await prisma.dropEvent.findUnique({
      where: { id: eventId },
      include: {
        cards: true,
        claims: {
          where: { userId: session.user.id }
        }
      }
    });

    if (!event) return { success: false, error: "Evento não encontrado" };
    
    if (new Date() > event.expiresAt) {
      return { success: false, error: "Este drop já expirou" };
    }

    if (event.claims.length > 0) {
      // Já resgatou, então vamos apenas retornar os cartões
      const cards = event.cards.map(c => c.content);
      return { success: true, cards };
    }

    if (event.hasPassword && event.password !== password) {
      return { success: false, error: "Senha incorreta" };
    }

    // Verificar cargo (Simulação)
    if (event.targetAudience === "boosters" && !user.discordId) { // Simulação: boosters precisam ter discord vinculado
      return { success: false, error: "Este drop é exclusivo para Boosters do Discord" };
    }
    
    if (event.targetAudience === "verificados" && !user.discordId) {
      return { success: false, error: "Você precisa vincular seu Discord para resgatar este drop" };
    }

    await prisma.dropEventClaim.create({
      data: {
        dropEventId: eventId,
        userId: session.user.id
      }
    });

    revalidatePath("/drops");
    
    const cards = event.cards.map(c => c.content);
    return { success: true, cards };

  } catch (err: any) {
    return { success: false, error: err.message || "Erro ao resgatar drop" };
  }
}
