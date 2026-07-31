"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAdminAction } from "@/lib/adminLogger";
import { auth } from "@/auth";

export async function revokeAllSessions(targetUserId: string) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "OWNER") {
      return { success: false, error: "Sem permissão." };
    }

    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) return { success: false, error: "Usuário não encontrado." };

    // Incrementa tokenVersion para deslogar da conta principal
    await prisma.user.update({
      where: { id: targetUserId },
      data: { tokenVersion: { increment: 1 } }
    });

    // Remove todos os registros de dispositivo
    await prisma.deviceSession.deleteMany({
      where: { userId: targetUserId }
    });

    await logAdminAction(session.user.id, "Revogou Sessões", `Desconectou todos os dispositivos de ${targetUser.name || targetUser.email}`);
    revalidatePath("/admin/logins");
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
