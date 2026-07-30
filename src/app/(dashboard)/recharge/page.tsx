import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { RechargeClient } from "./RechargeClient";

export default async function RechargePage() {
  const session = await auth();
  const user = session?.user?.id ? await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { referredById: true, referralRewardGiven: true, balance: true }
  }) : null;

  const isEligibleForReferralBonus = user?.referredById && !user?.referralRewardGiven;

  return (
    <div className="mx-auto py-8 font-sans relative">
      <RechargeClient balance={user?.balance || 0} isEligibleForReferralBonus={isEligibleForReferralBonus || false} />
    </div>
  );
}
