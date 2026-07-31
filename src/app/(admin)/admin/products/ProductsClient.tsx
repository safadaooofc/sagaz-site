"use client";

import { useState } from "react";
import { Plus, Settings, Package, Key as KeyIcon, Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import { createProduct, updateProduct, deleteProduct, createCategory, updateManualStock, addStockItems } from "./actions";

export default function ProductsClient({ products, categories }: { products: any[], categories: any[] }) {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [stockProduct, setStockProduct] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [productForm, setProductForm] = useState({ name: "", categoryId: "", description: "", price: 0, image: "" });
  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "" });
  const [stockForm, setStockForm] = useState({ manualStock: 0, keys: "" });

  const openNewProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: "", categoryId: "", description: "", price: 0, image: "" });
    setIsProductModalOpen(true);
  };

  const openEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      categoryId: product.categoryId || "",
      description: product.description || "",
      price: product.price,
      image: product.image || ""
    });
    setIsProductModalOpen(true);
  };

  const openStockModal = (product: any) => {
    setStockProduct(product);
    setStockForm({ manualStock: product.stock, keys: "" });
    setIsStockModalOpen(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = editingProduct 
      ? await updateProduct(editingProduct.id, productForm)
      : await createProduct(productForm);
    
    if (res.success) {
      toast.success(editingProduct ? "Produto atualizado!" : "Produto criado!");
      setIsProductModalOpen(false);
    } else {
      toast.error(res.error || "Erro ao salvar produto");
    }
    setIsLoading(false);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await createCategory(categoryForm.name, categoryForm.slug);
    if (res.success) {
      toast.success("Categoria criada!");
      setIsCategoryModalOpen(false);
    } else {
      toast.error(res.error || "Erro ao criar categoria");
    }
    setIsLoading(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este produto?")) return;
    setIsLoading(true);
    const res = await deleteProduct(id);
    if (res.success) toast.success("Produto deletado!");
    else toast.error(res.error || "Erro ao deletar produto");
    setIsLoading(false);
  };

  const handleStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (stockForm.manualStock !== stockProduct.stock) {
      await updateManualStock(stockProduct.id, stockForm.manualStock);
    }

    if (stockForm.keys.trim()) {
      const keys = stockForm.keys.split("\n").map(k => k.trim()).filter(k => k.length > 0);
      if (keys.length > 0) {
        await addStockItems(stockProduct.id, keys);
        toast.success(`${keys.length} chaves adicionadas!`);
      }
    }

    toast.success("Estoque atualizado!");
    setIsStockModalOpen(false);
    setIsLoading(false);
  };

  return (
    <div className="font-sans">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Produtos e Estoque</h1>
          <p className="text-[#9ca3af]">Crie produtos e adicione as contas/keys para entrega automática.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="bg-[#262933] hover:bg-[#374151] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> Nova Categoria
          </button>
          <button 
            onClick={openNewProduct}
            className="bg-[#eab308] hover:bg-[#ca8a04] text-black px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> Novo Produto
          </button>
        </div>
      </div>
      
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
                      <button onClick={() => openStockModal(product)} className="text-xs text-white font-medium bg-blue-500/20 hover:bg-blue-500/30 text-blue-500 transition-colors px-2 py-1.5 rounded-md inline-flex items-center gap-1" title="Gerenciar Estoque">
                        <KeyIcon size={14} /> Estoque
                      </button>
                      <button onClick={() => openEditProduct(product)} className="text-xs text-white font-medium bg-[#262933] hover:bg-[#374151] transition-colors px-2 py-1.5 rounded-md inline-flex items-center gap-1" title="Editar Produto">
                        <Edit size={14} /> Editar
                      </button>
                      <button onClick={() => handleDeleteProduct(product.id)} className="text-xs text-red-500 font-medium bg-red-500/10 hover:bg-red-500/20 transition-colors px-2 py-1.5 rounded-md inline-flex items-center gap-1" title="Deletar">
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

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181a20] border border-[#262933] rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-[#262933] flex justify-between items-center">
              <h2 className="font-bold text-white text-lg">{editingProduct ? "Editar Produto" : "Novo Produto"}</h2>
              <button onClick={() => setIsProductModalOpen(false)} className="text-[#9ca3af] hover:text-white">&times;</button>
            </div>
            <form onSubmit={handleProductSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#9ca3af] mb-1">Nome do Produto</label>
                <input required type="text" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-3 py-2 text-white outline-none focus:border-[#eab308] transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#9ca3af] mb-1">Preço (R$)</label>
                  <input required type="number" step="0.01" value={productForm.price} onChange={e => setProductForm({...productForm, price: parseFloat(e.target.value)})} className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-3 py-2 text-white outline-none focus:border-[#eab308] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#9ca3af] mb-1">Categoria</label>
                  <select value={productForm.categoryId} onChange={e => setProductForm({...productForm, categoryId: e.target.value})} className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-3 py-2 text-white outline-none focus:border-[#eab308] transition-colors appearance-none">
                    <option value="">Nenhuma</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#9ca3af] mb-1">URL da Imagem</label>
                <input type="text" value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-3 py-2 text-white outline-none focus:border-[#eab308] transition-colors" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#9ca3af] mb-1">Descrição</label>
                <textarea rows={3} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-3 py-2 text-white outline-none focus:border-[#eab308] transition-colors resize-none" />
              </div>
              <button disabled={isLoading} type="submit" className="w-full bg-[#eab308] hover:bg-[#ca8a04] text-black font-bold py-2 rounded-lg transition-colors disabled:opacity-50">
                {isLoading ? "Salvando..." : "Salvar Produto"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181a20] border border-[#262933] rounded-2xl w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b border-[#262933] flex justify-between items-center">
              <h2 className="font-bold text-white text-lg">Nova Categoria</h2>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-[#9ca3af] hover:text-white">&times;</button>
            </div>
            <form onSubmit={handleCategorySubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#9ca3af] mb-1">Nome da Categoria</label>
                <input required type="text" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})} className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-3 py-2 text-white outline-none focus:border-[#eab308] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#9ca3af] mb-1">Slug (URL)</label>
                <input required type="text" value={categoryForm.slug} onChange={e => setCategoryForm({...categoryForm, slug: e.target.value})} className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-3 py-2 text-white outline-none focus:border-[#eab308] transition-colors" />
              </div>
              <button disabled={isLoading} type="submit" className="w-full bg-white hover:bg-gray-200 text-black font-bold py-2 rounded-lg transition-colors disabled:opacity-50">
                {isLoading ? "Criando..." : "Criar Categoria"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Stock Modal */}
      {isStockModalOpen && stockProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181a20] border border-[#262933] rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-[#262933] flex justify-between items-center">
              <h2 className="font-bold text-white text-lg">Gerenciar Estoque</h2>
              <button onClick={() => setIsStockModalOpen(false)} className="text-[#9ca3af] hover:text-white">&times;</button>
            </div>
            <div className="p-4 border-b border-[#262933] bg-[#0f1115]/50">
              <p className="text-sm text-white font-bold">{stockProduct.name}</p>
              <p className="text-xs text-[#9ca3af]">Você pode adicionar estoque manual (sem entrega automática) ou colar chaves linha por linha para entrega imediata após compra.</p>
            </div>
            <form onSubmit={handleStockSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#9ca3af] mb-1">Estoque Manual</label>
                <input type="number" min="0" value={stockForm.manualStock} onChange={e => setStockForm({...stockForm, manualStock: parseInt(e.target.value) || 0})} className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-3 py-2 text-white outline-none focus:border-[#eab308] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#9ca3af] mb-1">Adicionar Novas Chaves / Contas (1 por linha)</label>
                <textarea rows={5} value={stockForm.keys} onChange={e => setStockForm({...stockForm, keys: e.target.value})} placeholder="abc-def-ghi\njkl-mno-pqr" className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-3 py-2 text-white outline-none focus:border-[#eab308] transition-colors resize-none font-mono text-xs" />
              </div>
              <button disabled={isLoading} type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-colors disabled:opacity-50">
                {isLoading ? "Salvando..." : "Salvar Estoque"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
