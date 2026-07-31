import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminSuporteClient } from "./AdminSuporteClient";
import { prisma } from "@/lib/prisma";

export default async function AdminSuportePage() {
  const session = await auth();
  if (!session?.user || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "SUPERADMIN")) {
    redirect("/");
  }

  const tickets = await (prisma as any).ticket.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      user: { select: { name: true, email: true, id: true } },
      messages: {
        orderBy: { createdAt: "asc" }
      }
    }
  });

  return <AdminSuporteClient initialTickets={tickets} />;
}
