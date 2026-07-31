"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createRewardCode(data: {
  code: string;
  type: string;
  value?: number;
  productId?: string;
  maxUses: number;
}) {
  try {
    const existing = await prisma.rewardCode.findUnique({
      where: { code: data.code }
    });

    if (existing) {
      return { success: false, error: "Este código já existe!" };
    }

    await prisma.rewardCode.create({
      data: {
        code: data.code,
        type: data.type,
        value: data.value || null,
        productId: data.productId || null,
        maxUses: data.maxUses,
        active: true
      }
    });

    revalidatePath("/admin/marketing");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating reward code:", error);
    return { success: false, error: "Erro ao criar o código: " + error.message };
  }
}

export async function deleteRewardCode(id: string) {
  try {
    await prisma.rewardCode.delete({
      where: { id }
    });
    revalidatePath("/admin/marketing");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Erro ao deletar o código." };
  }
}

export async function toggleRewardCodeActive(id: string, active: boolean) {
  try {
    await prisma.rewardCode.update({
      where: { id },
      data: { active }
    });
    revalidatePath("/admin/marketing");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Erro ao alterar o status do código." };
  }
}
