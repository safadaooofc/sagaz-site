import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SaquesClient } from "./SaquesClient";
import { redirect } from "next/navigation";

export default async function AdminSaquesPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const withdrawals = await prisma.withdrawal.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { name: true, email: true }
      }
    }
  });

  return <SaquesClient withdrawals={withdrawals} />;
}
