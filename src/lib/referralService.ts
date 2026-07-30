import { prisma } from "./prisma";

/**
 * Função chamada quando um pagamento for aprovado (ex: Recarga PIX ou Cartão).
 * Verifica se a recarga atingiu R$ 10,00 e processa os bônus de indicação.
 */
export async function processReferralReward(userId: string, rechargeAmount: number) {
  // Regra 1: Só aciona se a recarga for igual ou maior que R$ 10,00
  if (rechargeAmount < 10) return;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, referredById: true, referralRewardGiven: true }
  });

  if (!user || !user.referredById) return; // Usuário orgânico, sem indicação
  if (user.referralRewardGiven) return; // Já acionou os prêmios antes

  // Transação segura para garantir que tudo ocorra ou falhe junto
  await prisma.$transaction(async (tx) => {
    // 1. Marca que a Maria já ativou o bônus e dá os 5% de desconto a ela
    await tx.user.update({
      where: { id: user.id },
      data: {
        referralDiscount: { increment: 5 },
        referralRewardGiven: true 
      }
    });

    const referrerId = user.referredById as string;

    // 2. Quantas pessoas o João já indicou que também já recarregaram +10?
    const previousSuccessfulReferralsCount = await tx.user.count({
      where: {
        referredById: referrerId,
        referralRewardGiven: true,
        id: { not: user.id } // Ignora a própria Maria
      }
    });

    if (previousSuccessfulReferralsCount === 0) {
      // Primeira vez que alguém que o João indicou recarrega: Dá 5% pro João.
      await tx.user.update({
        where: { id: referrerId },
        data: {
          referralDiscount: { increment: 5 }
        }
      });
    } else {
      // 2ª vez em diante: Dá R$ 3,00 de saldo pro João e salva no extrato.
      await tx.user.update({
        where: { id: referrerId },
        data: {
          balance: { increment: 3.0 }
        }
      });

      await tx.balanceMovement.create({
        data: {
          userId: referrerId,
          amount: 3.0,
          type: "REFERRAL_REWARD",
          description: `Bônus de Indicação de R$ 3,00 (Recarga da conta ${user.id})`
        }
      });
    }
  });
}
