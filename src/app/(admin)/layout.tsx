import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminLayoutClient } from "./AdminLayoutClient";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user as any;

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN" && user.role !== "MODERATOR" && user.role !== "OWNER" && !user.isSupporter)) {
    redirect("/dashboard");
  }

  return <AdminLayoutClient user={user}>{children}</AdminLayoutClient>;
}
