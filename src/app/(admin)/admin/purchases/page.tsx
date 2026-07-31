import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PurchasesClient } from "./PurchasesClient";
import { redirect } from "next/navigation";

export default async function AdminPurchasesPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const purchases = await prisma.transaction.findMany({
    orderBy: { date: 'desc' },
    include: {
      user: {
        select: { name: true, email: true, image: true }
      }
    }
  });

  return <PurchasesClient purchases={purchases} />;
}
