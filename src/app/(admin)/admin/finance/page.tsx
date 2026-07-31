import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { FinanceClient } from "./FinanceClient";
import { redirect } from "next/navigation";

export default async function AdminFinancePage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const recharges = await prisma.recharge.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { name: true, email: true, image: true }
      }
    }
  });

  return <FinanceClient recharges={recharges} />;
}
