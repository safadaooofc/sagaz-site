"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

type Transaction = {
  id: string;
  productName: string;
  quantity: number;
  total: number;
  date: Date;
  status: string;
};

export function HistoryTable({ transactions }: { transactions: Transaction[] }) {
  const [search, setSearch] = useState("");

  const filtered = transactions.filter(t => 
    t.productName.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full max-w-[360px]">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4b5563]" />
          <input 
            type="text"
            placeholder="Buscar compras..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#181a20] border border-transparent rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-[#262933] transition-colors"
          />
        </div>
        <Link href="/buy/cards" className="bg-[#181a20] hover:bg-[#1f2229] border border-[#262933] text-white px-4 py-2 rounded-md text-[13px] font-bold transition-colors w-full sm:w-auto text-center">
          + Nova Compra
        </Link>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-[13px] text-[#9ca3af] min-w-[600px]">
          <thead>
            <tr className="border-b border-[#262933]">
              <th className="font-normal py-4 px-2">ID</th>
              <th className="font-normal py-4 px-2">Produto</th>
              <th className="font-normal py-4 px-2 text-center">Qtde</th>
              <th className="font-normal py-4 px-2 text-center">Total</th>
              <th className="font-normal py-4 px-2 text-center">Data</th>
              <th className="font-normal py-4 px-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-[#4b5563]">Nenhuma compra encontrada.</td>
              </tr>
            ) : (
              filtered.map(tx => (
                <tr key={tx.id} className="border-b border-[#262933] last:border-0 hover:bg-[#181a20] transition-colors">
                  <td className="px-2 py-3 text-xs">{tx.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-2 py-3 text-white">{tx.productName}</td>
                  <td className="px-2 py-3 text-center">{tx.quantity}</td>
                  <td className="px-2 py-3 text-center">R$ {tx.total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                  <td className="px-2 py-3 text-center">{new Date(tx.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-2 py-3 text-center">
                    <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs">{tx.status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
