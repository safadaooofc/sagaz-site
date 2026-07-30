"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAvailableCards() {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: "Não autorizado", data: [] };

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { balance: true }
  });

  const cards = await prisma.product.findMany({
    where: {
      category: { slug: { contains: "card" } },
      stock: { gt: 0 }
    },
    include: {
      stockItems: {
        where: { isDelivered: false },
        take: 50 // Limit to avoid massive payloads
      }
    }
  });

  // If no category found, fallback to name contains card or cc
  let products = cards;
  if (products.length === 0) {
    products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: "card", mode: "insensitive" } },
          { name: { contains: "cc", mode: "insensitive" } }
        ],
        stock: { gt: 0 }
      },
      include: {
        stockItems: {
          where: { isDelivered: false },
          take: 50
        }
      }
    });
  }

  const availableCards: any[] = [];
  
  for (const product of products) {
    for (const item of product.stockItems) {
      if (item.content.includes("|")) {
        const parts = item.content.split("|");
        if (parts.length > 5 && !parts[0].includes("@")) {
          // number|cvv|expiry|name|bank|brand|level|type|country|bin|cpf
          availableCards.push({
            id: item.id, // we use stockItem id to uniquely buy this exact card
            cardId: product.id,
            price: product.price,
            level: parts[6] || "Indefinido",
            modality: parts[7] || "Credit",
            bank: parts[4] || "Banco não informado",
            numberPrefix: parts[0] ? parts[0].substring(0, 6) : "000000",
            brand: parts[5] || "Desconhecida",
            expiryPreview: parts[2] ? parts[2].substring(0, 1) + "*/" + parts[2].substring(parts[2].length - 1) + "*" : "**/**"
          });
        }
      }
    }
  }

  return { success: true, data: availableCards, balance: user?.balance || 0 };
}

export async function buyCard(productId: string, quantity: number, something: any, stockItemId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: "Não autorizado" };

  try {
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: session.user!.id } });
      if (!user) throw new Error("Usuário não encontrado.");

      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) throw new Error("Produto não encontrado.");
      if (product.stock < 1) throw new Error("Produto esgotado.");
      
      const stockItem = await tx.stockItem.findUnique({ where: { id: stockItemId } });
      if (!stockItem || stockItem.isDelivered) throw new Error("Cartão já vendido ou indisponível.");
      if (stockItem.productId !== productId) throw new Error("Inconsistência de produto.");

      if (user.balance < product.price) {
        throw new Error("Saldo insuficiente.");
      }

      // Create transaction
      const transaction = await tx.transaction.create({
        data: {
          userId: user.id,
          productId: product.id,
          quantity: 1,
          total: product.price,
          status: "COMPLETED"
        }
      });

      // Update StockItem
      await tx.stockItem.update({
        where: { id: stockItemId },
        data: {
          isDelivered: true,
          transactionId: transaction.id
        }
      });

      // Decrease product stock
      await tx.product.update({
        where: { id: product.id },
        data: { stock: { decrement: 1 } }
      });

      // Decrease user balance
      await tx.user.update({
        where: { id: user.id },
        data: { balance: { decrement: product.price } }
      });
      
      // Log balance movement
      await tx.balanceMovement.create({
        data: {
          userId: user.id,
          amount: -product.price,
          type: "PURCHASE",
          description: `Compra de Cartão: ${product.name}`
        }
      });

      revalidatePath("/dashboard");
      return { success: true };
    });
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
