"use client";

import { useState } from "react";
import { Search, DollarSign, CheckCircle, XCircle, Clock, Check, X, ArrowDownToLine } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { processWithdrawal } from "./actions";

export function SaquesClient({ withdrawals }: { withdrawals: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filtered = withdrawals.filter(w => 
    w.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProcess = async (id: string, action: "COMPLETED" | "REJECTED") => {
    if (!confirm(action === "COMPLETED" ? "Confirmar o pagamento deste saque?" : "Rejeitar o saque e devolver o saldo para o usuário?")) return;
    setIsLoading(true);
    const res = await processWithdrawal(id, action);
    if (res.success) toast.success(`Saque ${action === "COMPLETED" ? "pago" : "rejeitado"} com sucesso!`);
    else toast.error(res.error || "Erro ao processar");
    setIsLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "COMPLETED": return <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><CheckCircle size={12} /> Pago</span>;
      case "PENDING": return <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><Clock size={12} /> Pendente</span>;
      case "REJECTED": return <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><XCircle size={12} /> Rejeitado</span>;
      default: return <span className="bg-gray-500/10 text-gray-500 border border-gray-500/20 px-2 py-1 rounded text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="font-sans">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Saques e Retiradas</h1>
          <p className="text-[#9ca3af]">Aprove saques de afiliados e gerencie a saída de dinheiro.</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
          <input 
            type="text" 
            placeholder="Buscar pedido, usuário..." 
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
                <th className="px-6 py-4 font-bold text-white">Chave Pix</th>
                <th className="px-6 py-4 font-bold text-white">Valor</th>
                <th className="px-6 py-4 font-bold text-white">Data</th>
                <th className="px-6 py-4 font-bold text-white text-right">Status / Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(w => (
                <tr key={w.id} className="border-b border-[#262933] hover:bg-[#1f2229]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-white font-bold">{w.user?.name || "Sem Nome"}</div>
                    <div className="text-xs">{w.user?.email}</div>
                    <div className="text-[10px] text-[#6b7280] font-mono mt-1">#{w.id.substring(0, 8)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-mono text-white text-xs bg-[#0f1115] px-2 py-1 rounded border border-[#262933] inline-block mb-1">{w.pixKey}</div>
                    <div className="text-[10px] uppercase font-bold text-[#6b7280]">{w.pixType}</div>
                  </td>
                  <td className="px-6 py-4 text-white font-bold text-base">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(w.amount)}
                  </td>
                  <td className="px-6 py-4">
                    {formatDistanceToNow(new Date(w.createdAt), { addSuffix: true, locale: ptBR })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(w.status)}
                      
                      {w.status === "PENDING" && (
                        <div className="flex items-center gap-2 mt-2">
                          <button 
                            disabled={isLoading}
                            onClick={() => handleProcess(w.id, "COMPLETED")}
                            className="text-[11px] text-green-500 font-bold bg-[#0f1115] hover:bg-green-500/10 border border-[#262933] hover:border-green-500/30 transition-colors px-2 py-1.5 rounded-md flex items-center gap-1 disabled:opacity-50"
                          >
                            <Check size={12} /> Já Paguei
                          </button>
                          <button 
                            disabled={isLoading}
                            onClick={() => handleProcess(w.id, "REJECTED")}
                            className="text-[11px] text-red-500 font-bold bg-[#0f1115] hover:bg-red-500/10 border border-[#262933] hover:border-red-500/30 transition-colors px-2 py-1.5 rounded-md flex items-center gap-1 disabled:opacity-50"
                          >
                            <X size={12} /> Rejeitar e Devolver
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#9ca3af]">Nenhum saque encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
