import { prisma } from '../src/lib/prisma';

async function run() {
  console.log("Updating kiover to SUPERADMIN...");
  const user = await prisma.user.updateMany({
    where: { email: "paoteste40@gmail.com" },
    data: { role: "SUPERADMIN" }
  });
  console.log(`Updated ${user.count} user(s) successfully!`);
}

run().catch(console.error).finally(() => prisma.$disconnect());
