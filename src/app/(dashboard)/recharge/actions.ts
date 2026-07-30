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
    select: { referredById: true }
  });

  const isEligibleForReferralBonus = !!user?.referredById;
  const { bonusAmount, totalAmount } = calculateBonus(amount, isEligibleForReferralBonus);

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

  return { success: true, recharge: { id: recharge.id, pixCode: recharge.pixCode, totalAmount: recharge.totalAmount, amount: recharge.amount, method: "crypto" } };
}

export async function createPixPayment(amount: number) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: "Não autorizado" };

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { referredById: true, name: true, email: true }
  });

  const isEligibleForReferralBonus = !!user?.referredById;
  const { bonusAmount, totalAmount } = calculateBonus(amount, isEligibleForReferralBonus);

  // Create pending recharge first so we can send its ID as reference
  const recharge = await prisma.recharge.create({
    data: {
      userId: session.user.id,
      amount,
      bonus: bonusAmount,
      totalAmount,
      method: "pix",
      status: "pending",
      pixCode: "" // will update below
    }
  });

  const fallbackPixCode = "00020126580014br.gov.bcb.pix0136" + Math.random().toString(36).substring(7) + "5204000053039865802BR5913Sagaz Pagamentos6009Sao Paulo62070503***6304";

  try {
    const apiUrl = process.env.CASHINPAY_API_URL || "https://api.cashinpay.com.br/v1";
    const apiKey = process.env.CASHINPAY_API_KEY;

    if (apiKey && apiKey !== "YOUR_API_KEY_HERE") {
      const response = await fetch(`${apiUrl}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          value: amount,
          reference: recharge.id,
          customer: {
            name: user?.name || "Cliente Sagaz",
            email: user?.email || "cliente@sagaz.com"
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("CashinPay Response Error:", response.status, errorText);
        throw new Error(`Erro na API do CashinPay: ${errorText}`);
      }

      const data = await response.json();
      const pixCode = data.qr_code || data.pix_code || data.payload || "";

      await prisma.recharge.update({
        where: { id: recharge.id },
        data: { pixCode: pixCode }
      });

      return { success: true, recharge: { id: recharge.id, pixCode: pixCode, totalAmount: recharge.totalAmount, amount: recharge.amount, method: "pix" } };
    } else {
      // Fallback for development if keys aren't set
      await prisma.recharge.update({
        where: { id: recharge.id },
        data: { pixCode: fallbackPixCode }
      });
      return { success: true, recharge: { id: recharge.id, pixCode: fallbackPixCode, totalAmount: recharge.totalAmount, amount: recharge.amount, method: "pix" } };
    }
  } catch (error) {
    console.error("CashinPay Error:", error);
    return { success: false, message: "Erro de comunicação com a API da CashinPay." };
  }
}

export async function checkPaymentStatus(rechargeId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false };

  const recharge = await prisma.recharge.findUnique({ where: { id: rechargeId } });
  if (!recharge || recharge.userId !== session.user.id) return { success: false };

  // Status is now handled via webhook, we just return the current status from DB
  return { success: true, data: { status: recharge.status } };
}
