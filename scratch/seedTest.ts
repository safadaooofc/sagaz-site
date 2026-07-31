import { prisma } from '../src/lib/prisma';

async function main() {
  let product = await prisma.product.findFirst();
  if (!product) {
    product = await prisma.product.create({
      data: {
        name: 'Produto de Teste',
        price: 100.0,
        stock: 5,
        stockItems: {
          create: [
            { content: 'ITEM1' },
            { content: 'ITEM2' }
          ]
        }
      }
    });
    console.log('Criado produto:', product.id);
  } else {
    await prisma.stockItem.create({
      data: { productId: product.id, content: 'ITEM_NEW' }
    });
  }

  await prisma.user.upsert({
    where: { email: 'inviter@test.com' },
    update: { referralCode: 'TESTINVITE' },
    create: {
      email: 'inviter@test.com',
      password: 'hash',
      name: 'Inviter',
      referralCode: 'TESTINVITE'
    }
  });

  await prisma.rewardCode.upsert({
    where: { code: 'PROMO50' },
    update: { active: true, used: 0, maxUses: 10, type: 'DISCOUNT', value: 50 },
    create: {
      code: 'PROMO50',
      type: 'DISCOUNT',
      value: 50,
      active: true,
      maxUses: 10,
    }
  });

  await prisma.rewardCode.upsert({
    where: { code: 'DROP10' },
    update: { active: true, used: 0, maxUses: 10, type: 'BALANCE', value: 10 },
    create: {
      code: 'DROP10',
      type: 'BALANCE',
      value: 10,
      active: true,
      maxUses: 10,
    }
  });

  console.log('Seeded test data: TESTINVITE, PROMO50, DROP10');
}

main().catch(console.error).finally(() => prisma.$disconnect());
