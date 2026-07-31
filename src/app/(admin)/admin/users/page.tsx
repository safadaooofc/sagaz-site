import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UsersClient } from "./UsersClient";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return <UsersClient users={users} currentUser={session.user} />;
}
