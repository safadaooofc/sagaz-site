import { prisma } from "./src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user1234", 10);

  // Criar Admin
  await prisma.user.upsert({
    where: { email: "admin@sagaz.com" },
    update: {
      password: adminPassword,
      role: "SUPERADMIN",
      balance: 9999.00,
    },
    create: {
      email: "admin@sagaz.com",
      name: "Admin Sagaz",
      password: adminPassword,
      role: "SUPERADMIN",
      balance: 9999.00,
    }
  });

  // Criar Usuário Normal
  await prisma.user.upsert({
    where: { email: "user@sagaz.com" },
    update: {
      password: userPassword,
      role: "USER",
      balance: 50.00,
    },
    create: {
      email: "user@sagaz.com",
      name: "João Usuário",
      password: userPassword,
      role: "USER",
      balance: 50.00,
    }
  });

  console.log("Senhas atualizadas!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
