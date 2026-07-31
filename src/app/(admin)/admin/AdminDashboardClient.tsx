"use client";

import { useState } from "react";
import { Users, Package, ShoppingCart, DollarSign, Activity, ShieldCheck, Clock, Power } from "lucide-react";
import { updateAdminStatus } from "./actions";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function AdminDashboardClient({ stats, logs, team, currentUser }: any) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (status: "TRABALHANDO" | "REPOUSO" | "OFFLINE") => {
    setIsUpdating(true);
    const res = await updateAdminStatus(currentUser.id, status);
    if (res.success) toast.success(`Status atualizado para ${status}`);
    else toast.error("Erro ao atualizar status");
    setIsUpdating(false);
  };

  const getStatusColor = (status: string) => {
    if (status === "TRABALHANDO") return "bg-green-500";
    if (status === "REPOUSO") return "bg-yellow-500";
    return "bg-gray-500";
  };

  const getStatusText = (status: string) => {
    if (status === "TRABALHANDO") return "Trabalhando";
    if (status === "REPOUSO") return "Em Repouso";
    return "Offline";
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard e Logs</h1>
          <p className="text-muted-foreground mt-1 text-[#9ca3af]">Visão geral do sistema (Versão 1.2.0)</p>
        </div>
        
        {/* Admin Status Controller */}
        <div className="bg-[#181a20] border border-[#262933] rounded-lg p-2 flex items-center gap-2">
          <span className="text-xs font-bold text-[#9ca3af] px-2">Meu Status:</span>
          <button disabled={isUpdating} onClick={() => handleStatusChange("TRABALHANDO")} className="px-3 py-1.5 rounded-md text-xs font-bold bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors flex items-center gap-1">
            <Activity size={12} /> Trabalhando
          </button>
          <button disabled={isUpdating} onClick={() => handleStatusChange("REPOUSO")} className="px-3 py-1.5 rounded-md text-xs font-bold bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 transition-colors flex items-center gap-1">
            <Clock size={12} /> Repouso
          </button>
          <button disabled={isUpdating} onClick={() => handleStatusChange("OFFLINE")} className="px-3 py-1.5 rounded-md text-xs font-bold bg-gray-500/10 text-gray-400 hover:bg-gray-500/20 transition-colors flex items-center gap-1">
            <Power size={12} /> Offline
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <div className="bg-[#181a20] border border-[#262933] rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-white">Total de Usuários</h3>
            <Users size={16} className="text-[#9ca3af]" />
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
            <p className="text-xs text-[#9ca3af] mt-1">Usuários cadastrados</p>
          </div>
        </div>

        {/* Total Stock */}
        <div className="bg-[#181a20] border border-[#262933] rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-white">Estoque Total</h3>
            <Package size={16} className="text-[#9ca3af]" />
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{stats.totalStock}</div>
            <p className="text-xs text-[#9ca3af] mt-1">Cartões disponíveis</p>
          </div>
        </div>

        {/* Total Purchases */}
        <div className="bg-[#181a20] border border-[#262933] rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-white">Total de Compras</h3>
            <ShoppingCart size={16} className="text-[#9ca3af]" />
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{stats.totalPurchases}</div>
            <p className="text-xs text-[#9ca3af] mt-1">Compras realizadas</p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-[#181a20] border border-[#262933] rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-white">Receita Total</h3>
            <DollarSign size={16} className="text-[#9ca3af]" />
          </div>
          <div>
            <div className="text-3xl font-bold text-[#22c55e]">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(stats.totalRevenue)}
            </div>
            <p className="text-xs text-[#9ca3af] mt-1">Acumulado total</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Action Logs */}
        <div className="lg:col-span-2 bg-[#181a20] border border-[#262933] rounded-xl overflow-hidden shadow-sm flex flex-col h-[500px]">
          <div className="p-4 border-b border-[#262933] flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2"><Activity size={16} className="text-blue-500" /> Logs Administrativos</h3>
            <span className="text-xs font-bold bg-blue-500/10 text-blue-500 px-2 py-1 rounded">Ao vivo</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {logs.map((log: any) => (
              <div key={log.id} className="flex gap-4 items-start p-3 bg-[#0f1115] border border-[#262933] rounded-lg">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-[#262933] shrink-0">
                  {log.user.image ? <img src={log.user.image} alt={log.user.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white">{log.user.name?.charAt(0)}</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-white truncate">{log.user.name} <span className="text-xs font-normal text-[#6b7280]">({log.user.role})</span></p>
                    <span className="text-[10px] text-[#6b7280] whitespace-nowrap">{formatDistanceToNow(new Date(log.createdAt), { addSuffix: true, locale: ptBR })}</span>
                  </div>
                  <p className="text-xs text-[#eab308] font-medium mt-0.5">{log.action}</p>
                  {log.details && <p className="text-xs text-[#9ca3af] mt-1 bg-[#181a20] p-2 rounded">{log.details}</p>}
                </div>
              </div>
            ))}
            {logs.length === 0 && <p className="text-sm text-[#9ca3af] text-center mt-10">Nenhum log registrado ainda.</p>}
          </div>
        </div>

        {/* Team Status */}
        <div className="bg-[#181a20] border border-[#262933] rounded-xl overflow-hidden shadow-sm flex flex-col h-[500px]">
          <div className="p-4 border-b border-[#262933]">
            <h3 className="font-bold text-white flex items-center gap-2"><ShieldCheck size={16} className="text-purple-500" /> Status da Equipe</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {team.map((member: any) => (
              <div key={member.id} className="flex items-center gap-3 p-3 bg-[#0f1115] border border-[#262933] rounded-lg">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#262933]">
                    {member.image ? <img src={member.image} alt={member.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white">{member.name?.charAt(0)}</div>}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0f1115] ${getStatusColor(member.adminStatus)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{member.name}</p>
                  <p className="text-xs text-[#9ca3af] truncate">{member.role} • {getStatusText(member.adminStatus)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
