"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { ProductModal } from "./components/ProductModal";
import { CategoryModal } from "./components/CategoryModal";
import { StockModal } from "./components/StockModal";
import { ProductsTable } from "./components/ProductsTable";

export default function ProductsClient({ products, categories }: { products: any[], categories: any[] }) {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [stockProduct, setStockProduct] = useState<any>(null);

  const openNewProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const openEditProduct = (product: any) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const openStockModal = (product: any) => {
    setStockProduct(product);
    setIsStockModalOpen(true);
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
      
      <ProductsTable 
        products={products} 
        onEdit={openEditProduct} 
        onStock={openStockModal} 
      />

      <ProductModal 
        isOpen={isProductModalOpen} 
        onClose={() => setIsProductModalOpen(false)} 
        product={editingProduct} 
        categories={categories} 
      />
      
      <CategoryModal 
        isOpen={isCategoryModalOpen} 
        onClose={() => setIsCategoryModalOpen(false)} 
      />
      
      <StockModal 
        isOpen={isStockModalOpen} 
        onClose={() => setIsStockModalOpen(false)} 
        product={stockProduct} 
      />
    </div>
  );
}
