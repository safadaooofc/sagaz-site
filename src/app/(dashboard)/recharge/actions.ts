"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUserBalance() {
  const session = await auth();
  if (!session?.user?.id) return { balance: 0 };
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { balance: true } });
  return { balance: user?.balance || 0 };
}

export async function getAvailableCryptos() {
  // Mocked list of available cryptocurrencies
  return [
    { code: "btc", name: "Bitcoin", ticker: "BTC", is_popular: true, is_stable: false, network: "Bitcoin", logo_url: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg" },
    { code: "eth", name: "Ethereum", ticker: "ETH", is_popular: true, is_stable: false, network: "ERC20", logo_url: "https://cryptologos.cc/logos/ethereum-eth-logo.svg" },
    { code: "usdt", name: "Tether", ticker: "USDT", is_popular: true, is_stable: true, network: "TRC20", logo_url: "https://cryptologos.cc/logos/tether-usdt-logo.svg" },
    { code: "ltc", name: "Litecoin", ticker: "LTC", is_popular: false, is_stable: false, network: "Litecoin", logo_url: "https://cryptologos.cc/logos/litecoin-ltc-logo.svg" }
  ];
}

function calculateBonus(amount: number, hasReferralDiscount: boolean = false) {
  let bonusPercentage = 0;
  if (amount >= 500) bonusPercentage = 20;
  else if (amount >= 200) bonusPercentage = 15;
  else if (amount >= 100) bonusPercentage = 10;
  else if (amount >= 50) bonusPercentage = 5;

  if (hasReferralDiscount && amount >= 10) {
    bonusPercentage += 10;
  }

  const bonusAmount = amount * (bonusPercentage / 100);
  return { bonusAmount, totalAmount: amount + bonusAmount };
}

export async function createCryptoPayment(amount: number, currency: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: "Não autorizado" };

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { referredById: true, referralRewardGiven: true }
  });

  const isEligibleForReferralBonus = user?.referredById && !user?.referralRewardGiven;
  const { bonusAmount, totalAmount } = calculateBonus(amount, isEligibleForReferralBonus || false);

  const recharge = await prisma.recharge.create({
    data: {
      userId: session.user.id,
      amount,
      bonus: bonusAmount,
      totalAmount,
      method: "crypto",
      currency,
      status: "pending",
      pixCode: "crypto_address_mock_" + Math.random().toString(36).substring(7)
    }
  });

  return { success: true, recharge: { _id: recharge.id, pixCode: recharge.pixCode, totalAmount: recharge.totalAmount } };
}

export async function createPixPayment(amount: number) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: "Não autorizado" };

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { referredById: true, referralRewardGiven: true }
  });

  const isEligibleForReferralBonus = user?.referredById && !user?.referralRewardGiven;
  const { bonusAmount, totalAmount } = calculateBonus(amount, isEligibleForReferralBonus || false);

  const recharge = await prisma.recharge.create({
    data: {
      userId: session.user.id,
      amount,
      bonus: bonusAmount,
      totalAmount,
      method: "pix",
      status: "pending",
      pixCode: "00020126580014br.gov.bcb.pix0136" + Math.random().toString(36).substring(7) + "5204000053039865802BR5913Sagaz Pagamentos6009Sao Paulo62070503***6304"
    }
  });

  return { success: true, recharge: { _id: recharge.id, pixCode: recharge.pixCode, totalAmount: recharge.totalAmount } };
}

export async function checkPaymentStatus(rechargeId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false };

  const recharge = await prisma.recharge.findUnique({ where: { id: rechargeId } });
  if (!recharge || recharge.userId !== session.user.id) return { success: false };

  // Mock checking logic: we will just autocomplete it randomly for demonstration purposes,
  // or after 5 seconds
  const isTimePassed = (new Date().getTime() - recharge.createdAt.getTime()) > 5000;
  
  if (recharge.status === "pending" && isTimePassed) {
    // approve payment
    await prisma.$transaction(async (tx) => {
      await tx.recharge.update({
        where: { id: rechargeId },
        data: { status: "completed" }
      });
      
      await tx.user.update({
        where: { id: recharge.userId },
        data: { 
          balance: { increment: recharge.totalAmount },
          referralRewardGiven: true 
        }
      });
      
      await tx.balanceMovement.create({
        data: {
          userId: recharge.userId,
          amount: recharge.totalAmount,
          type: "RECHARGE",
          description: `Recarga via ${recharge.method.toUpperCase()}`
        }
      });
    });

    revalidatePath("/dashboard");
    return { success: true, data: { status: "completed" } };
  }

  return { success: true, data: { status: recharge.status } };
}
