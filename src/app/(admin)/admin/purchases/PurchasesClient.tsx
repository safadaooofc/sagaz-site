"use client";

import { useState } from "react";
import { Search, ShoppingCart, CheckCircle, Clock, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function PurchasesClient({ purchases }: { purchases: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = purchases.filter(p => 
    p.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "COMPLETED": return <CheckCircle size={14} className="text-green-500" />;
      case "PENDING": return <Clock size={14} className="text-yellow-500" />;
      case "FAILED": return <XCircle size={14} className="text-red-500" />;
      default: return <Clock size={14} className="text-gray-500" />;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "COMPLETED": return <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-1 rounded text-xs font-bold">Aprovado</span>;
      case "PENDING": return <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-1 rounded text-xs font-bold">Pendente</span>;
      case "FAILED": return <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-1 rounded text-xs font-bold">Falhou</span>;
      default: return <span className="bg-gray-500/10 text-gray-500 border border-gray-500/20 px-2 py-1 rounded text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="font-sans">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Vendas e Compras</h1>
          <p className="text-[#9ca3af]">Histórico de todas as transações de produtos no site.</p>
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
                <th className="px-6 py-4 font-bold text-white">ID / Cliente</th>
                <th className="px-6 py-4 font-bold text-white">Produto(s)</th>
                <th className="px-6 py-4 font-bold text-white">Valor</th>
                <th className="px-6 py-4 font-bold text-white">Data</th>
                <th className="px-6 py-4 font-bold text-white text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(purchase => (
                <tr key={purchase.id} className="border-b border-[#262933] hover:bg-[#1f2229]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-white font-bold">{purchase.user?.name || "Sem Nome"}</div>
                    <div className="text-xs">{purchase.user?.email}</div>
                    <div className="text-[10px] text-[#6b7280] font-mono mt-1">#{purchase.id.substring(0, 8)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <ShoppingCart size={16} className="text-[#9ca3af]" />
                      <span className="text-white font-medium">Carrinho</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white font-bold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(purchase.total)}
                  </td>
                  <td className="px-6 py-4">
                    {formatDistanceToNow(new Date(purchase.createdAt), { addSuffix: true, locale: ptBR })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {getStatusBadge(purchase.status)}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#9ca3af]">Nenhuma compra encontrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
