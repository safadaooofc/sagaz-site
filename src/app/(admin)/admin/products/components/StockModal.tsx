"use client";
import { useState, useEffect } from "react";
import { updateManualStock, addStockItems } from "../actions";
import { toast } from "sonner";

export function StockModal({ isOpen, onClose, product }: { isOpen: boolean, onClose: () => void, product: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ manualStock: 0, keys: "" });

  useEffect(() => {
    if (product) {
      setForm({ manualStock: product.stock, keys: "" });
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (form.manualStock !== product.stock) {
      await updateManualStock(product.id, form.manualStock);
    }

    if (form.keys.trim()) {
      const keys = form.keys.split("\n").map(k => k.trim()).filter(k => k.length > 0);
      if (keys.length > 0) {
        await addStockItems(product.id, keys);
        toast.success(`${keys.length} chaves adicionadas!`);
      }
    }

    toast.success("Estoque atualizado!");
    onClose();
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#181a20] border border-[#262933] rounded-2xl w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-[#262933] flex justify-between items-center">
          <h2 className="font-bold text-white text-lg">Gerenciar Estoque</h2>
          <button onClick={onClose} className="text-[#9ca3af] hover:text-white">&times;</button>
        </div>
        <div className="p-4 border-b border-[#262933] bg-[#0f1115]/50">
          <p className="text-sm text-white font-bold">{product.name}</p>
          <p className="text-xs text-[#9ca3af]">Você pode adicionar estoque manual (sem entrega automática) ou colar chaves linha por linha para entrega imediata após compra.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#9ca3af] mb-1">Estoque Manual</label>
            <input type="number" min="0" value={form.manualStock} onChange={e => setForm({...form, manualStock: parseInt(e.target.value) || 0})} className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-3 py-2 text-white outline-none focus:border-[#eab308] transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#9ca3af] mb-1">Adicionar Novas Chaves / Contas (1 por linha)</label>
            <textarea rows={5} value={form.keys} onChange={e => setForm({...form, keys: e.target.value})} placeholder="abc-def-ghi\njkl-mno-pqr" className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-3 py-2 text-white outline-none focus:border-[#eab308] transition-colors resize-none font-mono text-xs" />
          </div>
          <button disabled={isLoading} type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-colors disabled:opacity-50">
            {isLoading ? "Salvando..." : "Salvar Estoque"}
          </button>
        </form>
      </div>
    </div>
  );
}
