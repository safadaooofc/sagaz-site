import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SettingsClient } from "./SettingsClient";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      discordId: true,
      purchases: {
        select: {
          price: true
        }
      }
    }
  });

  if (!user) redirect("/login");

  const totalSpent = user.purchases.reduce((acc, curr) => acc + curr.price, 0);

  return <SettingsClient user={user} stats={{ totalSpent }} />;
}
