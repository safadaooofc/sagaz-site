"use client";

import { useState } from "react";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";

export function AdminDashboardClient({ stats }: any) {
  const [period, setPeriod] = useState("90d");

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-muted-foreground mt-2 text-[#9ca3af]">Visão geral do sistema</p>
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

      <div className="bg-[#181a20] border border-[#262933] rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[#262933] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg text-white">Vendas e Receita</h3>
            <p className="text-sm text-[#9ca3af]">Mostrando dados do período selecionado</p>
          </div>
          <div className="flex items-center gap-2 bg-[#0f1115] border border-[#262933] p-1 rounded-lg">
            <button 
              onClick={() => setPeriod("90d")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${period === '90d' ? 'bg-[#262933] text-white' : 'text-[#9ca3af] hover:text-white'}`}
            >
              Últimos 3 meses
            </button>
            <button 
              onClick={() => setPeriod("30d")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${period === '30d' ? 'bg-[#262933] text-white' : 'text-[#9ca3af] hover:text-white'}`}
            >
              Últimos 30 dias
            </button>
            <button 
              onClick={() => setPeriod("7d")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${period === '7d' ? 'bg-[#262933] text-white' : 'text-[#9ca3af] hover:text-white'}`}
            >
              Últimos 7 dias
            </button>
          </div>
        </div>
        
        <div className="p-6 h-[400px] flex items-center justify-center text-center">
          <div className="max-w-sm">
            <BarChart className="w-16 h-16 text-[#333845] mx-auto mb-4" />
            <p className="text-[#9ca3af] text-sm">O gráfico de desempenho estará disponível na próxima atualização do painel.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BarChart(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  );
}
