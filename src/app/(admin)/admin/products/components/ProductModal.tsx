"use client";
import { useState, useEffect } from "react";
import { createProduct, updateProduct } from "../actions";
import { toast } from "sonner";

export function ProductModal({ isOpen, onClose, product, categories }: { isOpen: boolean, onClose: () => void, product: any, categories: any[] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ name: "", categoryId: "", description: "", price: 0, image: "" });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        categoryId: product.categoryId || "",
        description: product.description || "",
        price: product.price,
        image: product.image || ""
      });
    } else {
      setForm({ name: "", categoryId: "", description: "", price: 0, image: "" });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = product 
      ? await updateProduct(product.id, form)
      : await createProduct(form);
    
    if (res.success) {
      toast.success(product ? "Produto atualizado!" : "Produto criado!");
      onClose();
    } else {
      toast.error(res.error || "Erro ao salvar produto");
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#181a20] border border-[#262933] rounded-2xl w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-[#262933] flex justify-between items-center">
          <h2 className="font-bold text-white text-lg">{product ? "Editar Produto" : "Novo Produto"}</h2>
          <button onClick={onClose} className="text-[#9ca3af] hover:text-white">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#9ca3af] mb-1">Nome do Produto</label>
            <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-3 py-2 text-white outline-none focus:border-[#eab308] transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#9ca3af] mb-1">Preço (R$)</label>
              <input required type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: parseFloat(e.target.value)})} className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-3 py-2 text-white outline-none focus:border-[#eab308] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#9ca3af] mb-1">Categoria</label>
              <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})} className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-3 py-2 text-white outline-none focus:border-[#eab308] transition-colors appearance-none">
                <option value="">Nenhuma</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#9ca3af] mb-1">URL da Imagem</label>
            <input type="text" value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-3 py-2 text-white outline-none focus:border-[#eab308] transition-colors" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#9ca3af] mb-1">Descrição</label>
            <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-3 py-2 text-white outline-none focus:border-[#eab308] transition-colors resize-none" />
          </div>
          <button disabled={isLoading} type="submit" className="w-full bg-[#eab308] hover:bg-[#ca8a04] text-black font-bold py-2 rounded-lg transition-colors disabled:opacity-50">
            {isLoading ? "Salvando..." : "Salvar Produto"}
          </button>
        </form>
      </div>
    </div>
  );
}
