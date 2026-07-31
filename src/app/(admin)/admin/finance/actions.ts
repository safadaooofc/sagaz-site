"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAdminAction } from "@/lib/adminLogger";
import { auth } from "@/auth";

export async function approveRecharge(rechargeId: string) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Sem permissão." };

    const recharge = await prisma.recharge.findUnique({ where: { id: rechargeId } });
    if (!recharge || recharge.status !== "pending") return { success: false, error: "Recarga inválida." };

    await prisma.$transaction(async (tx) => {
      await tx.recharge.update({
        where: { id: rechargeId },
        data: { status: "completed" }
      });

      await tx.user.update({
        where: { id: recharge.userId },
        data: { balance: { increment: recharge.totalAmount } }
      });

      await tx.balanceMovement.create({
        data: {
          userId: recharge.userId,
          amount: recharge.totalAmount,
          type: "DEPOSIT_MANUAL",
          description: `Recarga manual aprovada (Ref: ${recharge.id})`
        }
      });
    });

    await logAdminAction(session.user.id, "Aprovou Recarga", `Recarga: ${recharge.id} | Valor: R$ ${recharge.totalAmount}`);
    revalidatePath("/admin/finance");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function rejectRecharge(rechargeId: string) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Sem permissão." };

    await prisma.recharge.update({
      where: { id: rechargeId },
      data: { status: "failed" }
    });

    await logAdminAction(session.user.id, "Rejeitou Recarga", `Recarga: ${rechargeId}`);
    revalidatePath("/admin/finance");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
