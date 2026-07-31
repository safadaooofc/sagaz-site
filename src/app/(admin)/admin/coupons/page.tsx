import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CouponsClient } from "./CouponsClient";

export default async function AdminCouponsPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  // Fetch only DISCOUNT type
  const coupons = await (prisma as any).rewardCode.findMany({
    where: { type: 'DISCOUNT' },
    orderBy: { createdAt: 'desc' },
    include: {
      usages: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  return <CouponsClient coupons={coupons} />;
}
