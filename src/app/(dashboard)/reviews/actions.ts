"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createStoreReview(rating: number, title: string, comment: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado" };

  try {
    await prisma.review.create({
      data: {
        userId: session.user.id,
        rating,
        comment: `**${title}**\n\n${comment}`,
      }
    });

    revalidatePath("/reviews");
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (e) {
    console.error("Error creating review:", e);
    return { success: false, error: "Erro ao criar avaliação" };
  }
}
