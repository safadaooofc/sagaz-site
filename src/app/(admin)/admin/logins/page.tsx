import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { LoginsClient } from "./LoginsClient";
import { redirect } from "next/navigation";

export default async function AdminLoginsPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const sessions = await prisma.deviceSession.findMany({
    orderBy: { lastSeen: 'desc' },
    include: {
      user: {
        select: { name: true, email: true, image: true }
      }
    }
  });

  return <LoginsClient sessions={sessions} currentUser={session.user} />;
}
