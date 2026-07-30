import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Bell, ArrowRight, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { redirect } from "next/navigation";

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  // Marca todas como lidas ao entrar na página
  await prisma.notification.updateMany({
    where: { userId: session.user.id, isRead: false },
    data: { isRead: true }
  });

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
          <Bell className="text-blue-500" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Central de Notificações</h1>
          <p className="text-[#9ca3af] text-sm mt-1">Histórico de alertas e ganhos por indicação do Discord.</p>
        </div>
      </div>

      <div className="bg-[#181a20] border border-[#262933] rounded-xl overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-[#9ca3af]">
            Você não possui nenhuma notificação ainda.
          </div>
        ) : (
          <div className="divide-y divide-[#262933]">
            {notifications.map((notif) => (
              <div key={notif.id} className="p-4 sm:p-6 hover:bg-[#1f2229]/50 transition-colors flex gap-4">
                <div className="mt-1">
                  {notif.type.includes("REWARD") ? (
                    <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                      <CheckCircle size={16} />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                      <Bell size={16} />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-white font-bold">{notif.title}</h3>
                  <p className="text-[#9ca3af] text-sm mt-1 mb-2">{notif.message}</p>
                  <span className="text-xs font-bold text-[#6b7280]">
                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: ptBR })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
