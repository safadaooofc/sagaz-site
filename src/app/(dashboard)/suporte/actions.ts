"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createTicket(subject: string, message: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Não autorizado" };

  if (!subject.trim() || !message.trim()) return { success: false, error: "Preencha todos os campos" };

  try {
    const ticket = await (prisma as any).ticket.create({
      data: {
        userId: session.user.id,
        subject,
        messages: {
          create: {
            senderId: session.user.id,
            content: message,
            isAdmin: false
          }
        }
      }
    });

    revalidatePath("/suporte");
    return { success: true, ticketId: ticket.id };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function replyTicket(ticketId: string, message: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Não autorizado" };
  if (!message.trim()) return { success: false, error: "Mensagem vazia" };

  try {
    const ticket = await (prisma as any).ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) return { success: false, error: "Ticket não encontrado" };
    
    // User sending a reply
    if (ticket.userId !== session.user.id) return { success: false, error: "Não autorizado" };
    if (ticket.status === "CLOSED") return { success: false, error: "Ticket fechado" };

    await (prisma as any).ticketMessage.create({
      data: {
        ticketId,
        senderId: session.user.id,
        content: message,
        isAdmin: false
      }
    });

    revalidatePath("/suporte");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
