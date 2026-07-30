import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (session?.user?.id) {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tokenVersion: true }
    });

    const currentTokenVersion = (session.user as any).tokenVersion || 1;
    
    if (dbUser && dbUser.tokenVersion > currentTokenVersion) {
      redirect("/api/auth/force-logout");
    }

    // Registrar Sessão (IP e Browser)
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "Unknown Browser";
    const ip = headersList.get("x-forwarded-for") || "Localhost/Unknown IP";

    const existingSession = await prisma.deviceSession.findFirst({
      where: { userId: session.user.id, tokenVersion: currentTokenVersion, ip, browser: userAgent }
    });

    if (!existingSession) {
      await prisma.deviceSession.create({
        data: {
          userId: session.user.id,
          ip,
          browser: userAgent,
          os: "Web",
          tokenVersion: currentTokenVersion
        }
      });
    } else {
      await prisma.deviceSession.update({
        where: { id: existingSession.id },
        data: { lastSeen: new Date() }
      });
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar user={session?.user as any} />
      <div className="flex flex-col flex-1 overflow-hidden w-full">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
