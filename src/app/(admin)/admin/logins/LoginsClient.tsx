"use client";

import { useState } from "react";
import { Search, Monitor, Smartphone, ShieldBan, ShoppingCart, DollarSign, Gift, Ticket } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { revokeAllSessions } from "./actions";

export function LoginsClient({ sessions, currentUser }: { sessions: any[], currentUser: any }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filtered = sessions.filter(s => 
    s.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
          <h1 className="text-3xl font-black text-white mb-2">Raio-X de Usuários (Logins)</h1>
          <p className="text-[#9ca3af]">Visão completa dos últimos usuários ativos, seus saldos, compras e IPs.</p>
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
      
      <div className="space-y-4">
        {filtered.map(session => (
          <div key={session.id} className="bg-[#181a20] border border-[#262933] rounded-xl overflow-hidden p-6 hover:border-[#374151] transition-colors">
            
            <div className="flex flex-col md:flex-row justify-between gap-6">
              {/* Info do Usuário */}
              <div className="flex items-start gap-4 md:w-1/3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-[#262933] shrink-0 border-2 border-[#eab308]">
                  {session.user.image ? <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-lg font-bold text-white">{session.user.name?.charAt(0) || "U"}</div>}
                </div>
                <div>
                  <h3 className="text-white font-black text-lg flex items-center gap-2">
                    {session.user.name || "Sem Nome"}
                    <span className="text-[10px] font-mono text-[#6b7280] font-normal px-2 py-0.5 bg-[#0f1115] rounded border border-[#262933]">{session.ip}</span>
                  </h3>
                  <p className="text-sm text-[#9ca3af] mb-2">{session.user.email}</p>
                  
                  <div className="flex items-center gap-2 text-xs text-[#6b7280]">
                    {getDeviceIcon(session.os)}
                    <span>{session.os} ({session.browser})</span>
                    <span className="mx-1">•</span>
                    <span className="text-[#eab308]">Visto {formatDistanceToNow(new Date(session.lastSeen), { addSuffix: true, locale: ptBR })}</span>
                  </div>
                </div>
              </div>

              {/* Informações Financeiras e Atividade */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Saldo */}
                <div className="bg-[#0f1115] p-3 rounded-lg border border-[#262933]">
                  <p className="text-xs text-[#9ca3af] font-bold mb-1 flex items-center gap-1"><DollarSign size={12}/> Saldo Atual</p>
                  <p className="text-xl font-black text-white">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(session.user.balance || 0)}
                  </p>
                  <p className="text-[10px] text-green-500 mt-1">{session.user.recharges?.length || 0} recargas recentes</p>
                </div>

                {/* Últimas Compras */}
                <div className="bg-[#0f1115] p-3 rounded-lg border border-[#262933] md:col-span-2">
                  <p className="text-xs text-[#9ca3af] font-bold mb-2 flex items-center gap-1"><ShoppingCart size={12}/> Últimas Compras</p>
                  
                  <div className="space-y-2">
                    {session.user.transactions?.length > 0 ? (
                      session.user.transactions.map((tx: any) => (
                        <div key={tx.id} className="flex justify-between items-center text-xs">
                          <span className="text-white truncate max-w-[150px]">{tx.product?.name || "Produto Removido"}</span>
                          <span className="text-[#eab308] font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tx.total)}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-[#6b7280]">Nenhuma compra recente.</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Ações */}
              <div className="flex flex-col justify-center shrink-0">
                <button 
                  disabled={isLoading || currentUser.role !== "OWNER"}
                  onClick={() => handleRevoke(session.userId)} 
                  className="text-xs text-red-500 font-bold bg-[#0f1115] hover:bg-red-500/10 border border-[#262933] hover:border-red-500/30 transition-colors px-4 py-2 rounded-md flex items-center justify-center gap-2 disabled:opacity-50"
                  title={currentUser.role !== "OWNER" ? "Apenas o Dono pode fazer isso" : ""}
                >
                  <ShieldBan size={14} /> Desconectar
                </button>
              </div>

            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-[#181a20] border border-[#262933] rounded-xl p-8 text-center text-[#9ca3af]">
            Nenhum usuário ativo recentemente.
          </div>
        )}
      </div>
    </div>
  );
}
