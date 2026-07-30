import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DropsClient } from "./DropsClient";
import { redirect } from "next/navigation";

export default async function DropsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { discordId: true }
  });

  const events = await prisma.dropEvent.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      cards: true,
      claims: {
        where: { userId: session.user.id }
      }
    }
  });

  return <DropsClient events={events} hasDiscord={!!user?.discordId} />;
}
