"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function createBalanceGift(formData: FormData) {
  const session = await auth();
  const userRole = (session?.user as any)?.role;
  
  if (userRole !== "ADMIN" && userRole !== "SUPERADMIN" && userRole !== "OWNER") {
    throw new Error("Não autorizado");
  }

  const code = formData.get("code") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const maxUses = parseInt(formData.get("maxUses") as string);

  if (!code || isNaN(amount) || isNaN(maxUses)) {
    throw new Error("Dados inválidos");
  }

  await prisma.giftCode.create({
    data: {
      code: code.toUpperCase(),
      amount,
      maxUses,
    }
  });

  revalidatePath("/admin/gifts");
}

export async function createProductDrop(formData: FormData) {
  const session = await auth();
  const userRole = (session?.user as any)?.role;
  
  if (userRole !== "ADMIN" && userRole !== "SUPERADMIN" && userRole !== "OWNER") {
    throw new Error("Não autorizado");
  }

  const code = formData.get("code") as string;
  const productId = formData.get("productId") as string;
  const maxUses = parseInt(formData.get("maxUses") as string);

  if (!code || !productId || isNaN(maxUses)) {
    throw new Error("Dados inválidos");
  }

  await prisma.dropCode.create({
    data: {
      code: code.toUpperCase(),
      productId,
      maxUses,
    }
  });

  revalidatePath("/admin/gifts");
}
