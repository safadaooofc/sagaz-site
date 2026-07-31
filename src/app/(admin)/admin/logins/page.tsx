import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { LoginsClient } from "./LoginsClient";
import { redirect } from "next/navigation";

export default async function AdminLoginsPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  // Pega as sessões mais recentes e agrupa pelo usuário (Raio-X)
  const recentSessions = await prisma.deviceSession.findMany({
    orderBy: { lastSeen: 'desc' },
    take: 50,
    include: {
      user: {
        include: {
          transactions: {
            take: 3,
            orderBy: { date: 'desc' },
            include: { product: true }
          },
          recharges: {
            take: 3,
            orderBy: { createdAt: 'desc' }
          }
        }
      }
    }
  });

  // Remove usuários duplicados para mostrar apenas o raio-x único mais recente
  const uniqueUsers = new Map();
  for (const s of recentSessions) {
    if (!uniqueUsers.has(s.userId)) {
      uniqueUsers.set(s.userId, s);
    }
  }

  return <LoginsClient sessions={Array.from(uniqueUsers.values())} currentUser={session.user} />;
}
