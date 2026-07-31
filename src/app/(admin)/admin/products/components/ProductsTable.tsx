"use client";
import { Package, Key as KeyIcon, Edit, Trash } from "lucide-react";
import { deleteProduct } from "../actions";
import { toast } from "sonner";
import { useState } from "react";

export function ProductsTable({ products, onEdit, onStock }: { products: any[], onEdit: (product: any) => void, onStock: (product: any) => void }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este produto?")) return;
    setIsLoading(true);
    const res = await deleteProduct(id);
    if (res.success) toast.success("Produto deletado!");
    else toast.error(res.error || "Erro ao deletar produto");
    setIsLoading(false);
  };

  return (
    <div className="bg-[#181a20] border border-[#262933] rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-[#9ca3af]">
          <thead className="bg-[#1f2229] border-b border-[#262933]">
            <tr>
              <th className="px-6 py-4 font-bold text-white">Produto</th>
              <th className="px-6 py-4 font-bold text-white text-center">Preço</th>
              <th className="px-6 py-4 font-bold text-white text-center">Estoque Manual</th>
              <th className="px-6 py-4 font-bold text-white text-center">Chaves (Automático)</th>
              <th className="px-6 py-4 font-bold text-white text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b border-[#262933] hover:bg-[#1f2229]/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#262933] rounded-lg overflow-hidden shrink-0">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={16} className="text-[#9ca3af]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-white font-bold">{product.name}</div>
                      <div className="text-xs">{product.category?.name || "Sem Categoria"}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center text-white font-medium">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                </td>
                <td className="px-6 py-4 text-center">{product.stock}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${product._count?.stockItems > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {product._count?.stockItems || 0} disponíveis
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button disabled={isLoading} onClick={() => onStock(product)} className="text-xs text-white font-medium bg-blue-500/20 hover:bg-blue-500/30 text-blue-500 transition-colors px-2 py-1.5 rounded-md inline-flex items-center gap-1 disabled:opacity-50">
                      <KeyIcon size={14} /> Estoque
                    </button>
                    <button disabled={isLoading} onClick={() => onEdit(product)} className="text-xs text-white font-medium bg-[#262933] hover:bg-[#374151] transition-colors px-2 py-1.5 rounded-md inline-flex items-center gap-1 disabled:opacity-50">
                      <Edit size={14} /> Editar
                    </button>
                    <button disabled={isLoading} onClick={() => handleDelete(product.id)} className="text-xs text-red-500 font-medium bg-red-500/10 hover:bg-red-500/20 transition-colors px-2 py-1.5 rounded-md inline-flex items-center gap-1 disabled:opacity-50">
                      <Trash size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[#9ca3af]">Nenhum produto cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
