"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAction } from "@/lib/actionLogger";

export async function processPurchase(productId: string, quantity: number, couponCode?: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Não logado" };

  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Get user & balance
      const user = await tx.user.findUnique({ where: { id: session.user.id } });
      if (!user) throw new Error("Usuário não encontrado");

      // 2. Get product & available stock
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) throw new Error("Produto não encontrado");

      const availableStock = await tx.stockItem.findMany({
        where: { productId, isDelivered: false },
        take: quantity
      });

      if (availableStock.length < quantity) {
        throw new Error("Estoque insuficiente. Alguém comprou antes de você!");
      }

      let totalCost = product.price * quantity;
      let appliedCoupon = null;

      // 3. Process Coupon if provided
      if (couponCode) {
        const rewardData = await (tx as any).rewardCode.findUnique({ where: { code: couponCode } });
        const coupon = rewardData;
        if (!coupon || !coupon.active || coupon.type !== 'DISCOUNT') {
          throw new Error("Cupom inválido ou inativo");
        }
        if (coupon.used >= coupon.maxUses) {
          throw new Error("Cupom esgotado");
        }
        
        // Calculate discount
        if (coupon.value) {
          const discountAmount = (totalCost * coupon.value) / 100;
          totalCost -= discountAmount;
          appliedCoupon = coupon;
        }
      }

      if (user.balance < totalCost) {
        throw new Error("Saldo insuficiente");
      }

      // 4. Deduct balance
      await tx.user.update({
        where: { id: user.id },
        data: { balance: { decrement: totalCost } }
      });

      // 5. Create Transaction
      const transaction = await tx.transaction.create({
        data: {
          userId: user.id,
          productId: product.id,
          quantity: quantity,
          total: totalCost,
          status: "COMPLETED"
        }
      });

      // 6. Mark stock as sold & associate to transaction
      for (const item of availableStock) {
        await tx.stockItem.update({
          where: { id: item.id },
          data: {
            isDelivered: true,
            transactionId: transaction.id
          }
        });
      }

      // 7. Log balance movement
      await tx.balanceMovement.create({
        data: {
          userId: user.id,
          amount: -totalCost,
          type: "PURCHASE",
          description: `Compra de ${quantity}x ${product.name}${appliedCoupon ? ` (Cupom: ${appliedCoupon.code})` : ''}`
        }
      });

      // 8. Update Coupon Usage
      if (appliedCoupon) {
        await (tx as any).rewardCode.update({
          where: { id: appliedCoupon.id },
          data: { uses: { increment: 1 } }
        });
        await (tx as any).rewardUsageLog.create({
          data: {
            userId: user.id,
            rewardCodeId: appliedCoupon.id
          }
        });
      }

      // Log success to global logger
      logAction("INFO", {
        userId: user.id,
        action: "PROCESS_PURCHASE",
        payload: {
          productId,
          quantity,
          totalCost,
          coupon: couponCode || null,
          transactionId: transaction.id
        }
      });

      return { success: true, transactionId: transaction.id };
    });
  } catch (error: any) {
    logAction("ERROR", {
      userId: session.user.id as string,
      action: "PROCESS_PURCHASE_FAILED",
      error: error.message
    });
    return { success: false, error: error.message };
  }
}
