import { prisma } from "@/lib/prisma";
import { AdminDashboardClient } from "./AdminDashboardClient";

export default async function AdminDashboardPage() {
  const [totalUsers, totalStock, totalPurchases, revenueData] = await Promise.all([
    prisma.user.count(),
    prisma.stockItem.count({ where: { isDelivered: false } }),
    prisma.transaction.count({ where: { status: "COMPLETED" } }),
    prisma.transaction.aggregate({
      where: { status: "COMPLETED" },
      _sum: { total: true }
    })
  ]);

  const stats = {
    totalUsers,
    totalStock,
    totalPurchases,
    totalRevenue: revenueData._sum.total || 0,
  };

  return <AdminDashboardClient stats={stats} />;
}
