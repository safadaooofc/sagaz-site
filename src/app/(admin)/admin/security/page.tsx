import { prisma } from "@/lib/prisma";
import { ShieldAlert, Activity } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AdminSecurityPage() {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPERADMIN") {
    redirect("/admin");
  }

  const logs = await prisma.securityLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Monitoramento de IP e Segurança</h1>
          <p className="text-[#9ca3af]">Acesso exclusivo SuperAdmin. Rastreie atividades anômalas e bloqueios.</p>
        </div>
      </div>
      
      <div className="bg-[#181a20] border border-[#262933] rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-[#9ca3af]">
          <thead className="bg-[#1f2229] border-b border-[#262933]">
            <tr>
              <th className="px-6 py-4 font-bold text-white">IP / Origem</th>
              <th className="px-6 py-4 font-bold text-white">Evento</th>
              <th className="px-6 py-4 font-bold text-white">Detalhes</th>
              <th className="px-6 py-4 font-bold text-white text-right">Data/Hora</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} className="border-b border-[#262933] hover:bg-[#1f2229]/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-white font-mono text-xs">{log.ip}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold uppercase ${log.event.includes('RATE_LIMIT') ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    <Activity size={12} /> {log.event}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs">{log.details}</td>
                <td className="px-6 py-4 text-right text-xs">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-[#6b7280]">
                  <ShieldAlert size={24} className="mx-auto mb-2 opacity-50" />
                  Nenhum evento de segurança registrado recentemente.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
