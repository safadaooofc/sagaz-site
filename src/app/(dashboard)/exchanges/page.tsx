import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ExchangesClient } from "./ExchangesClient";
import { prisma } from "@/lib/prisma";

export default async function ExchangesPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const history = await (prisma as any).exchangeRequest.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" }
  });

  return <ExchangesClient history={history} />;
}
