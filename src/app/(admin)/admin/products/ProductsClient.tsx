"use client";

import { useState, useMemo } from "react";
import { Plus, TrendingUp, PackageMinus } from "lucide-react";
import { ProductModal } from "./components/ProductModal";
import { CategoryModal } from "./components/CategoryModal";
import { StockModal } from "./components/StockModal";
import { ProductsTable } from "./components/ProductsTable";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export default function ProductsClient({ products, categories, transactions }: { products: any[], categories: any[], transactions: any[] }) {
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

  // Prepare chart data
  const chartData = useMemo(() => {
    return products.map(p => ({
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      Vendas: p.soldCount,
      Estoque: p._count?.stockItems || 0,
      Receita: p.revenue
    })).sort((a, b) => b.Vendas - a.Vendas).slice(0, 7); // Top 7 products
  }, [products]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#181a20] border border-[#262933] p-3 rounded-lg shadow-xl">
          <p className="text-white font-bold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'Receita' ? `R$ ${entry.value.toFixed(2)}` : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#13151a] border border-[#262933] rounded-xl p-5">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-[#eab308]" /> 
            Top 7 Produtos Mais Vendidos
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262933" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1f2229' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="Vendas" fill="#eab308" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#13151a] border border-[#262933] rounded-xl p-5">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <PackageMinus size={18} className="text-cyan-400" /> 
            Situação de Estoque (Top 7)
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEstoque" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262933" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="Estoque" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#colorEstoque)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
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
