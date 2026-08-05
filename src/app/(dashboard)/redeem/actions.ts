"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAction } from "@/lib/actionLogger";

export async function redeemGift(code: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Não autenticado" };

  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Get User
      const user = await tx.user.findUnique({ where: { id: session?.user?.id || "" } });
      if (!user) throw new Error("Usuário não encontrado");

      // 2. Validate Gift Code
      const reward = await tx.rewardCode.findUnique({
        where: { code: code.toUpperCase() }
      });

      if (!reward || !reward.active) {
        throw new Error("Código inválido ou inativo");
      }
      
      if (reward.type === 'DISCOUNT') {
        throw new Error("Este é um cupom de desconto, use na página de checkout.");
      }

      if (reward.used >= reward.maxUses) {
        throw new Error("Este código já atingiu o limite de usos");
      }

      // Check if user already used this specific code (optional, but requested: "Cada gift pode ser utilizado apenas uma vez por usuário")
      const alreadyUsed = await tx.rewardUsageLog.findFirst({
        where: { userId: user.id, rewardCodeId: reward.id }
      });

      if (alreadyUsed) {
        throw new Error("Você já resgatou este código!");
      }

      let resgateMsg = "";
      let amountResgatado = 0;

      // 3. Process Based on Type
      switch (reward.type) {
        case 'BALANCE':
          if (!reward.value) throw new Error("Valor do gift inválido");
          
          await tx.user.update({
            where: { id: user.id },
            data: { balance: { increment: reward.value } }
          });
          
          await tx.balanceMovement.create({
            data: {
              userId: user.id,
              amount: reward.value,
              type: "GIFT_REDEEM",
              description: `Resgate do Gift Card: ${reward.code}`
            }
          });
          
          resgateMsg = `Adicionado R$ ${reward.value.toFixed(2)} ao seu saldo!`;
          amountResgatado = reward.value;
          break;

        case 'PRODUCT':
          if (!reward.productId) throw new Error("Produto não configurado neste código");
          
          const product = await tx.product.findUnique({ where: { id: reward.productId } });
          if (!product) throw new Error("Produto não encontrado");
          
          const availableStock = await tx.stockItem.findFirst({
            where: { productId: product.id, isDelivered: false }
          });
          
          if (!availableStock) {
            throw new Error("Produto sem estoque no momento.");
          }

          const transaction = await tx.transaction.create({
            data: {
              userId: user.id,
              productId: product.id,
              quantity: 1,
              total: 0, // It's free
              status: "COMPLETED"
            }
          });

          await tx.stockItem.update({
            where: { id: availableStock.id },
            data: { isDelivered: true, transactionId: transaction.id }
          });

          resgateMsg = `Produto "${product.name}" recebido com sucesso!`;
          break;

        case 'RECHARGE_BONUS':
          if (!reward.value) throw new Error("Bônus inválido");
          
          // Injecting directly to balance as requested for simplicity
          const bonusAmount = reward.value;
          await tx.user.update({
            where: { id: user.id },
            data: { balance: { increment: bonusAmount } }
          });

          await tx.balanceMovement.create({
            data: {
              userId: user.id,
              amount: bonusAmount,
              type: "GIFT_REDEEM_BONUS",
              description: `Bônus Resgatado: ${reward.code}`
            }
          });

          resgateMsg = `Bônus de R$ ${bonusAmount.toFixed(2)} injetado na sua conta!`;
          amountResgatado = bonusAmount;
          break;

        default:
          throw new Error("Tipo de código desconhecido");
      }

      // 4. Update usage and log
      await tx.rewardCode.update({
        where: { id: reward.id },
        data: { used: { increment: 1 } }
      });

      await tx.rewardUsageLog.create({
        data: {
          userId: user.id,
          rewardCodeId: reward.id
        }
      });

      // 5. Global Logging
      logAction("INFO", {
        userId: user.id,
        action: "REDEEM_GIFT",
        payload: {
          code: reward.code,
          type: reward.type,
          msg: resgateMsg
        }
      });

      return { success: true, message: resgateMsg, amount: amountResgatado };
    });
  } catch (error: any) {
    logAction("ERROR", {
      userId: session?.user?.id || "unknown",
      action: "REDEEM_FAILED",
      error: error.message,
      payload: { code }
    });
    return { success: false, error: error.message };
  }
}
