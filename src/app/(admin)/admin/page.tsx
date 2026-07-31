import { prisma } from "@/lib/prisma";
import { AdminDashboardClient } from "./AdminDashboardClient";
import { auth } from "@/auth";

export default async function AdminDashboardPage() {
  const session = await auth();
  
  const [totalUsers, totalStock, totalPurchases, revenueData, logs, team] = await Promise.all([
    prisma.user.count(),
    prisma.stockItem.count({ where: { isDelivered: false } }),
    prisma.transaction.count({ where: { status: "COMPLETED" } }),
    prisma.transaction.aggregate({
      where: { status: "COMPLETED" },
      _sum: { total: true }
    }),
    prisma.adminLog.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, image: true, role: true } } }
    }),
    prisma.user.findMany({
      where: { role: { in: ["SUPERADMIN", "ADMIN", "MODERATOR", "OWNER"] } },
      select: { id: true, name: true, image: true, role: true, adminStatus: true, adminLastActive: true },
      orderBy: { adminStatus: 'asc' }
    })
  ]);

  const stats = {
    totalUsers,
    totalStock,
    totalPurchases,
    totalRevenue: revenueData._sum.total || 0,
  };

  return <AdminDashboardClient stats={stats} logs={logs} team={team} currentUser={session?.user} />;
}
