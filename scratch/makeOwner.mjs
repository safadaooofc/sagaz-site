import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function run() {
  try {
    const user = await prisma.user.findUnique({ where: { email: "paoteste40@gmail.com" } });
    if (!user) {
      console.log("USER NOT FOUND");
      return;
    }
    console.log("BEFORE:", user.role);
    
    await prisma.user.update({
      where: { email: "paoteste40@gmail.com" },
      data: { role: "OWNER" }
    });
    
    console.log("UPDATED TO OWNER SUCCESSFULLY");
  } catch (e) {
    console.error(e);
  }
}

run().finally(() => prisma.$disconnect());
