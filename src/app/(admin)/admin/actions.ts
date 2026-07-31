"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAdminAction } from "@/lib/adminLogger";

export async function updateAdminStatus(userId: string, status: "TRABALHANDO" | "REPOUSO" | "OFFLINE") {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { 
        adminStatus: status,
        adminLastActive: new Date()
      }
    });

    await logAdminAction(userId, "Alterou status de trabalho", `Novo status: ${status}`);
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
