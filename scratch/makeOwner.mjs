import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
  await prisma.user.updateMany({
    where: { email: 'paoteste40@gmail.com' },
    data: { role: 'OWNER' }
  });
  console.log('Role updated to OWNER for paoteste40@gmail.com');
}
run().catch(console.error).finally(() => prisma.$disconnect());
