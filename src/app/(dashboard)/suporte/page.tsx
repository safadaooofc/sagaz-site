import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SuporteClient } from "./SuporteClient";
import { prisma } from "@/lib/prisma";

export default async function SuportePage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const tickets = await (prisma as any).ticket.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      messages: {
        orderBy: { createdAt: "asc" }
      }
    }
  });

  return <SuporteClient initialTickets={tickets} />;
}
