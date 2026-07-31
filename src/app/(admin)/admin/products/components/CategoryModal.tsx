"use client";
import { useState } from "react";
import { createCategory } from "../actions";
import { toast } from "sonner";

export function CategoryModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "" });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await createCategory(form.name, form.slug);
    if (res.success) {
      toast.success("Categoria criada!");
      setForm({ name: "", slug: "" });
      onClose();
    } else {
      toast.error(res.error || "Erro ao criar categoria");
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#181a20] border border-[#262933] rounded-2xl w-full max-w-sm overflow-hidden">
        <div className="p-4 border-b border-[#262933] flex justify-between items-center">
          <h2 className="font-bold text-white text-lg">Nova Categoria</h2>
          <button onClick={onClose} className="text-[#9ca3af] hover:text-white">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#9ca3af] mb-1">Nome da Categoria</label>
            <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})} className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-3 py-2 text-white outline-none focus:border-[#eab308] transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#9ca3af] mb-1">Slug (URL)</label>
            <input required type="text" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-3 py-2 text-white outline-none focus:border-[#eab308] transition-colors" />
          </div>
          <button disabled={isLoading} type="submit" className="w-full bg-white hover:bg-gray-200 text-black font-bold py-2 rounded-lg transition-colors disabled:opacity-50">
            {isLoading ? "Criando..." : "Criar Categoria"}
          </button>
        </form>
      </div>
    </div>
  );
}
