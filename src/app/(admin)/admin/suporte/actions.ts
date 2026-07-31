"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function adminReplyTicket(ticketId: string, message: string) {
  const session = await auth();
  if (!session?.user || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "SUPERADMIN")) {
    return { success: false, error: "Não autorizado" };
  }

  if (!message.trim()) return { success: false, error: "Mensagem vazia" };

  try {
    const ticket = await (prisma as any).ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) return { success: false, error: "Ticket não encontrado" };
    if (ticket.status === "CLOSED") return { success: false, error: "Ticket fechado" };

    await (prisma as any).ticketMessage.create({
      data: {
        ticketId,
        senderId: session.user.id,
        content: message,
        isAdmin: true
      }
    });

    // Update ticket updatedAt so it goes to the top
    await (prisma as any).ticket.update({
      where: { id: ticketId },
      data: { updatedAt: new Date() }
    });

    revalidatePath("/admin/suporte");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function closeTicket(ticketId: string) {
  const session = await auth();
  if (!session?.user || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "SUPERADMIN")) {
    return { success: false, error: "Não autorizado" };
  }

  try {
    await (prisma as any).ticket.update({
      where: { id: ticketId },
      data: { status: "CLOSED" }
    });
    revalidatePath("/admin/suporte");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
