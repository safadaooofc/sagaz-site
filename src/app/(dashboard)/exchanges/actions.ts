"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createExchangeRequest(giftCardCode: string, requestedValue: number) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Não autorizado" };

  if (!giftCardCode.trim() || requestedValue <= 0) {
    return { success: false, error: "Preencha todos os campos corretamente" };
  }

  try {
    const req = await (prisma as any).exchangeRequest.create({
      data: {
        userId: session.user.id,
        giftCardCode,
        requestedValue
      }
    });

    revalidatePath("/exchanges");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
