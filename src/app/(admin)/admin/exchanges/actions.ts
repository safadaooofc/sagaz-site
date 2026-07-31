"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function processExchangeRequest(requestId: string, action: "APPROVE" | "REJECT", adminNotes?: string) {
  const session = await auth();
  if (!session?.user || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "SUPERADMIN")) {
    return { success: false, error: "Não autorizado" };
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const req = await (tx as any).exchangeRequest.findUnique({ where: { id: requestId } });
      if (!req) throw new Error("Solicitação não encontrada");
      if (req.status !== "PENDING") throw new Error("A solicitação já foi processada.");

      if (action === "APPROVE") {
        // Credit the user
        await tx.user.update({
          where: { id: req.userId },
          data: { balance: { increment: req.requestedValue } }
        });
        await tx.balanceMovement.create({
          data: { userId: req.userId, amount: req.requestedValue, type: "EXCHANGE_APPROVED", description: `Troca de Gift Card Aprovada: ${req.giftCardCode}` }
        });

        await (tx as any).exchangeRequest.update({
          where: { id: req.id },
          data: { status: "APPROVED", adminNotes }
        });
      } else {
        // Reject
        await (tx as any).exchangeRequest.update({
          where: { id: req.id },
          data: { status: "REJECTED", adminNotes }
        });
      }

      revalidatePath("/admin/exchanges");
      return { success: true };
    });
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
