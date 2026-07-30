import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get('x-cashinpay-signature') || req.headers.get('webhook-signature') || '';
    const secret = process.env.CASHINPAY_WEBHOOK_SECRET;

    if (secret && secret !== "YOUR_WEBHOOK_SECRET_HERE") {
      const hmac = crypto.createHmac('sha256', secret);
      const digest = hmac.update(bodyText).digest('hex');

      // Basic signature validation
      if (signature !== digest && signature !== '') {
        return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 });
      }
    }

    const data = JSON.parse(bodyText);
    
    // We expect the payload to tell us the status and the reference ID
    // Adapt to CashinPay's actual schema (e.g. data.status === 'PAID')
    const status = data.status || data.event;
    const reference = data.reference || data.id;

    if (!reference) {
      return NextResponse.json({ error: 'Referência não encontrada' }, { status: 400 });
    }

    const recharge = await prisma.recharge.findUnique({
      where: { id: reference }
    });

    if (!recharge) {
      return NextResponse.json({ error: 'Recarga não encontrada' }, { status: 404 });
    }

    // Only process if it's currently pending
    if (recharge.status === 'pending') {
      if (status === 'payment.paid' || status === 'PAID') {
        const userObj = await prisma.user.findUnique({
          where: { id: recharge.userId },
          select: { referredById: true }
        });

        await prisma.$transaction(async (tx) => {
          await tx.recharge.update({
            where: { id: recharge.id },
            data: { status: "completed" }
          });
          
          await tx.user.update({
            where: { id: recharge.userId },
            data: { 
              balance: { increment: recharge.totalAmount }
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

          // Give 5% to the inviter
          if (userObj?.referredById) {
            const inviterBonus = recharge.amount * 0.05;
            await tx.user.update({
              where: { id: userObj.referredById },
              data: { balance: { increment: inviterBonus } }
            });
            await tx.balanceMovement.create({
              data: {
                userId: userObj.referredById,
                amount: inviterBonus,
                type: "REFERRAL_BONUS",
                description: `Bônus de 5% sobre recarga de indicado`
              }
            });
          }
        });
        console.log(`[Webhook CashinPay] Pagamento ${recharge.id} aprovado com sucesso!`);
      } else if (status === 'payment.expired' || status === 'withdrawal.failed') {
        await prisma.recharge.update({
          where: { id: recharge.id },
          data: { status: "failed" }
        });
        console.log(`[Webhook CashinPay] Pagamento ${recharge.id} falhou ou expirou.`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('[Webhook CashinPay] Erro no processamento:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
