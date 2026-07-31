import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const users = await prisma.user.findMany({ select: { email: true, role: true } });
  console.log("Users:", users);
  
  // force update paoteste40@gmail.com
  await prisma.user.updateMany({
    where: { email: "paoteste40@gmail.com" },
    data: { role: "OWNER" }
  });
  console.log("Force updated paoteste40@gmail.com to OWNER");
}

main().catch(console.error);
