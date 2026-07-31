import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { MarketingClient } from "./MarketingClient";
import { redirect } from "next/navigation";

export default async function AdminMarketingPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const rewardCodes = await prisma.rewardCode.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const products = await prisma.product.findMany({
    select: { id: true, name: true }
  });

  return <MarketingClient rewardCodes={rewardCodes} products={products} />;
}
