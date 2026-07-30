import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Users, DollarSign, ShoppingCart, Key } from "lucide-react";

export default async function AdminDashboardPage() {
  const totalUsers = await prisma.user.count();
  const totalSalesObj = await prisma.transaction.aggregate({
    _sum: { total: true },
    where: { status: "COMPLETED" }
  });
  const totalSales = totalSalesObj._sum.total || 0;
  
  const totalProducts = await prisma.product.count();
  const availableStock = await prisma.stockItem.count({ where: { isDelivered: false } });

  return (
    <div>
      <h1 className="text-3xl font-black text-white mb-2">Visão Geral</h1>
      <p className="text-[#9ca3af] mb-8">Estatísticas gerais da sua plataforma.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#181a20] border border-[#262933] rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Users size={16} />
            </div>
            <span className="text-[#9ca3af] text-sm font-medium">Usuários</span>
          </div>
          <div className="text-3xl font-black text-white">{totalUsers}</div>
        </div>

        <div className="bg-[#181a20] border border-[#262933] rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded bg-green-500/10 flex items-center justify-center text-green-500">
              <DollarSign size={16} />
            </div>
            <span className="text-[#9ca3af] text-sm font-medium">Vendas Totais</span>
          </div>
          <div className="text-3xl font-black text-white">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSales)}
          </div>
        </div>

        <div className="bg-[#181a20] border border-[#262933] rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center text-purple-500">
              <ShoppingCart size={16} />
            </div>
            <span className="text-[#9ca3af] text-sm font-medium">Produtos</span>
          </div>
          <div className="text-3xl font-black text-white">{totalProducts}</div>
        </div>

        <div className="bg-[#181a20] border border-[#262933] rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded bg-yellow-500/10 flex items-center justify-center text-yellow-500">
              <Key size={16} />
            </div>
            <span className="text-[#9ca3af] text-sm font-medium">Estoque (Pronto)</span>
          </div>
          <div className="text-3xl font-black text-white">{availableStock}</div>
        </div>
      </div>
    </div>
  );
}
