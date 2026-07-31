"use client";

import { useState } from "react";
import { Search, Monitor, ShieldBan, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { revokeAllSessions } from "./actions";

export function LoginsClient({ sessions, currentUser }: { sessions: any[], currentUser: any }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filtered = sessions.filter(s => 
    s.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.ip?.includes(searchTerm)
  );

  const handleRevoke = async (userId: string) => {
    if (!confirm("Tem certeza que deseja desconectar todos os dispositivos deste usuário?")) return;
    
    setIsLoading(true);
    const res = await revokeAllSessions(userId);
    if (res.success) toast.success("Sessões revogadas com sucesso!");
    else toast.error(res.error || "Erro ao revogar sessões");
    setIsLoading(false);
  };

  const getDeviceIcon = (os: string) => {
    if (os.toLowerCase().includes('windows') || os.toLowerCase().includes('mac') || os.toLowerCase().includes('linux')) {
      return <Monitor size={16} className="text-[#9ca3af]" />;
    }
    return <Smartphone size={16} className="text-[#9ca3af]" />;
  };

  return (
    <div className="font-sans">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Monitor de Logins</h1>
          <p className="text-[#9ca3af]">Acompanhe sessões ativas, IPs e dispositivos por motivos de segurança.</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
          <input 
            type="text" 
            placeholder="Buscar por usuário ou IP..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-[#181a20] border border-[#262933] rounded-lg pl-9 pr-4 py-2 text-sm text-white outline-none focus:border-[#eab308] transition-colors w-64"
          />
        </div>
      </div>
      
      <div className="bg-[#181a20] border border-[#262933] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#9ca3af]">
            <thead className="bg-[#1f2229] border-b border-[#262933]">
              <tr>
                <th className="px-6 py-4 font-bold text-white">Usuário</th>
                <th className="px-6 py-4 font-bold text-white">IP Local</th>
                <th className="px-6 py-4 font-bold text-white">Dispositivo / SO</th>
                <th className="px-6 py-4 font-bold text-white">Último Acesso</th>
                <th className="px-6 py-4 font-bold text-white text-right">Ações (Dono)</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(session => (
                <tr key={session.id} className="border-b border-[#262933] hover:bg-[#1f2229]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-[#262933] shrink-0">
                        {session.user.image ? <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white">{session.user.name?.charAt(0) || "U"}</div>}
                      </div>
                      <div>
                        <div className="text-white font-bold">{session.user.name || "Sem Nome"}</div>
                        <div className="text-xs">{session.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs bg-[#0f1115] px-2 py-1 rounded border border-[#262933]">{session.ip}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(session.os)}
                      <span>{session.os} - {session.browser}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {formatDistanceToNow(new Date(session.lastSeen), { addSuffix: true, locale: ptBR })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      disabled={isLoading || currentUser.role !== "OWNER"}
                      onClick={() => handleRevoke(session.userId)} 
                      className="text-[11px] text-red-500 font-bold bg-[#0f1115] hover:bg-red-500/10 border border-[#262933] hover:border-red-500/30 transition-colors px-3 py-1.5 rounded-md flex items-center justify-center gap-1 disabled:opacity-50 ml-auto"
                      title={currentUser.role !== "OWNER" ? "Apenas o Dono pode fazer isso" : ""}
                    >
                      <ShieldBan size={12} /> Desconectar
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#9ca3af]">Nenhuma sessão ativa encontrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
