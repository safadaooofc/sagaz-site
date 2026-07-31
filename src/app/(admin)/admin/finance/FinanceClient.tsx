"use client";

import { useState } from "react";
import { Search, DollarSign, CheckCircle, XCircle, Clock, Check, X } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { approveRecharge, rejectRecharge } from "./actions";

export function FinanceClient({ recharges }: { recharges: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filtered = recharges.filter(r => 
    r.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = async (id: string) => {
    if (!confirm("Aprovar esta recarga e adicionar o saldo ao usuário?")) return;
    setIsLoading(true);
    const res = await approveRecharge(id);
    if (res.success) toast.success("Recarga aprovada com sucesso!");
    else toast.error(res.error || "Erro ao aprovar");
    setIsLoading(false);
  };

  const handleReject = async (id: string) => {
    if (!confirm("Rejeitar esta recarga?")) return;
    setIsLoading(true);
    const res = await rejectRecharge(id);
    if (res.success) toast.success("Recarga rejeitada.");
    else toast.error(res.error || "Erro ao rejeitar");
    setIsLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case "completed": return <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><CheckCircle size={12} /> Aprovado</span>;
      case "pending": return <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><Clock size={12} /> Pendente</span>;
      case "failed": return <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><XCircle size={12} /> Falhou</span>;
      default: return <span className="bg-gray-500/10 text-gray-500 border border-gray-500/20 px-2 py-1 rounded text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="font-sans">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Recargas e Finanças</h1>
          <p className="text-[#9ca3af]">Acompanhe depósitos via Pix, Crypto e aprove recargas manuais.</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
          <input 
            type="text" 
            placeholder="Buscar por nome, email ou ID..." 
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
                <th className="px-6 py-4 font-bold text-white">ID / Cliente</th>
                <th className="px-6 py-4 font-bold text-white">Método</th>
                <th className="px-6 py-4 font-bold text-white">Valor (Total + Bônus)</th>
                <th className="px-6 py-4 font-bold text-white">Data</th>
                <th className="px-6 py-4 font-bold text-white text-right">Status / Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(recharge => (
                <tr key={recharge.id} className="border-b border-[#262933] hover:bg-[#1f2229]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-white font-bold">{recharge.user?.name || "Sem Nome"}</div>
                    <div className="text-xs">{recharge.user?.email}</div>
                    <div className="text-[10px] text-[#6b7280] font-mono mt-1">#{recharge.id.substring(0, 8)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-white uppercase text-xs bg-[#262933] px-2 py-1 rounded">{recharge.method}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-bold text-base">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(recharge.totalAmount)}
                    </div>
                    {recharge.bonus > 0 && <div className="text-xs text-green-500 font-medium">+ Bônus de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(recharge.bonus)}</div>}
                  </td>
                  <td className="px-6 py-4">
                    {formatDistanceToNow(new Date(recharge.createdAt), { addSuffix: true, locale: ptBR })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(recharge.status)}
                      
                      {recharge.status === "pending" && (
                        <div className="flex items-center gap-2 mt-2">
                          <button 
                            disabled={isLoading}
                            onClick={() => handleApprove(recharge.id)}
                            className="text-[11px] text-green-500 font-bold bg-[#0f1115] hover:bg-green-500/10 border border-[#262933] hover:border-green-500/30 transition-colors px-2 py-1.5 rounded-md flex items-center gap-1 disabled:opacity-50"
                          >
                            <Check size={12} /> Aprovar
                          </button>
                          <button 
                            disabled={isLoading}
                            onClick={() => handleReject(recharge.id)}
                            className="text-[11px] text-red-500 font-bold bg-[#0f1115] hover:bg-red-500/10 border border-[#262933] hover:border-red-500/30 transition-colors px-2 py-1.5 rounded-md flex items-center gap-1 disabled:opacity-50"
                          >
                            <X size={12} /> Rejeitar
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#9ca3af]">Nenhuma recarga encontrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
