import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminExchangesClient } from "./AdminExchangesClient";
import { prisma } from "@/lib/prisma";

export default async function AdminExchangesPage() {
  const session = await auth();
  if (!session?.user || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "SUPERADMIN")) {
    redirect("/");
  }

  const requests = await (prisma as any).exchangeRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true, id: true } }
    }
  });

  return <AdminExchangesClient initialRequests={requests} />;
}
