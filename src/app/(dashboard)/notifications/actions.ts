"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function markAllNotificationsAsRead() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Não autorizado" };

  await prisma.notification.updateMany({
    where: { userId: session.user.id, isRead: false },
    data: { isRead: true }
  });

  return { success: true };
}
