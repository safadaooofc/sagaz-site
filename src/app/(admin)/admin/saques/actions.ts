"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAdminAction } from "@/lib/adminLogger";
import { auth } from "@/auth";

export async function processWithdrawal(withdrawalId: string, status: "COMPLETED" | "REJECTED") {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Sem permissão." };

    const withdrawal = await prisma.withdrawal.findUnique({ where: { id: withdrawalId } });
    if (!withdrawal || withdrawal.status !== "PENDING") return { success: false, error: "Saque inválido." };

    await prisma.$transaction(async (tx) => {
      await tx.withdrawal.update({
        where: { id: withdrawalId },
        data: { status }
      });

      if (status === "REJECTED") {
        // Estorna o saldo
        await tx.user.update({
          where: { id: withdrawal.userId },
          data: { balance: { increment: withdrawal.amount } }
        });

        await tx.balanceMovement.create({
          data: {
            userId: withdrawal.userId,
            amount: withdrawal.amount,
            type: "WITHDRAWAL_REJECTED",
            description: `Saque rejeitado (Ref: ${withdrawal.id})`
          }
        });
      }
    });

    await logAdminAction(session.user.id, `Saque ${status === "COMPLETED" ? "Pago" : "Rejeitado"}`, `Saque: ${withdrawal.id} | Valor: R$ ${withdrawal.amount}`);
    revalidatePath("/admin/saques");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
