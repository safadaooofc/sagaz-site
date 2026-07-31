import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GiftsClient } from "./GiftsClient";

export default async function AdminGiftsPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  // Fetch only non-discount types (Gifts, Products, Boosts)
  const gifts = await prisma.rewardCode.findMany({
    where: { type: { not: 'DISCOUNT' } },
    orderBy: { createdAt: 'desc' },
    include: {
      createdBy: { select: { name: true, image: true } },
      usages: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  const products = await prisma.product.findMany({
    select: { id: true, name: true }
  });

  return <GiftsClient gifts={gifts} products={products} />;
}
