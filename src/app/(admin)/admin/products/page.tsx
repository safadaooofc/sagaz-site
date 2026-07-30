import { prisma } from "@/lib/prisma";
import { Plus, Settings } from "lucide-react";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true, _count: { select: { stockItems: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Produtos e Estoque</h1>
          <p className="text-[#9ca3af]">Crie produtos e adicione as contas/keys para entrega automática.</p>
        </div>
        <button className="bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
          <Plus size={16} /> Novo Produto
        </button>
      </div>
      
      <div className="bg-[#181a20] border border-[#262933] rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-[#9ca3af]">
          <thead className="bg-[#1f2229] border-b border-[#262933]">
            <tr>
              <th className="px-6 py-4 font-bold text-white">Produto</th>
              <th className="px-6 py-4 font-bold text-white text-center">Preço</th>
              <th className="px-6 py-4 font-bold text-white text-center">Estoque Manual</th>
              <th className="px-6 py-4 font-bold text-white text-center">Entrega Automática (Chaves)</th>
              <th className="px-6 py-4 font-bold text-white text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b border-[#262933] hover:bg-[#1f2229]/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-white font-bold">{product.name}</div>
                  <div className="text-xs">{product.category?.name || "Sem Categoria"}</div>
                </td>
                <td className="px-6 py-4 text-center text-white font-medium">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                </td>
                <td className="px-6 py-4 text-center">{product.stock}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${product._count.stockItems > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {product._count.stockItems} disponíveis
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-xs text-white font-medium bg-[#262933] hover:bg-[#374151] transition-colors px-3 py-1.5 rounded-md inline-flex items-center gap-2">
                    <Settings size={14} /> Editar
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center">Nenhum produto cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
