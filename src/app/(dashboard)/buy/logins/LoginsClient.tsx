"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Package, Zap, ChevronDown, CheckCircle2, Shield, Star, Info, Wallet, Plus, Minus } from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

export function LoginsClient({ logins, balance }: { logins: Product[], balance: number }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string>(logins.length > 0 ? logins[0].id : "");
  const [quantity, setQuantity] = useState<number>(1);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const selectedLogin = logins.find(l => l.id === selectedId);

  const handleQuantityChange = (val: string) => {
    let q = parseInt(val) || 1;
    if (selectedLogin) {
      if (q >= 1 && q <= selectedLogin.stock) {
        setQuantity(q);
      }
    }
  };

  const totalStock = logins.reduce((acc, curr) => acc + curr.stock, 0);

  return (
    <div className="font-sans max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-1">Logins NFA</h1>
        <p className="text-[#9ca3af] text-[15px]">Selecione e compre logins de alta qualidade</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#181a20] border border-[#262933] rounded-lg p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[13px] font-bold text-white">Saldo Disponível</span>
            <Wallet size={16} className="text-[#4b5563]" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">{formatCurrency(balance)}</h3>
            <p className="text-[11px] text-[#6b7280]">Para compras</p>
          </div>
        </div>

        <div className="bg-[#181a20] border border-[#262933] rounded-lg p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[13px] font-bold text-white">Logins Disponíveis</span>
            <Package size={16} className="text-[#4b5563]" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">{logins.length}</h3>
            <p className="text-[11px] text-[#6b7280]">Tipos diferentes</p>
          </div>
        </div>

        <div className="bg-[#181a20] border border-[#262933] rounded-lg p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[13px] font-bold text-white">Total em Estoque</span>
            <Zap size={16} className="text-[#4b5563]" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">{totalStock}</h3>
            <p className="text-[11px] text-[#6b7280]">Unidades</p>
          </div>
        </div>
      </div>

      {logins.length === 0 ? (
        <div className="bg-[#181a20] border border-[#262933] rounded-lg p-12 text-center flex flex-col items-center">
          <Package size={48} className="text-[#4b5563] mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Nenhum login disponível</h3>
          <p className="text-[#9ca3af] mb-6 text-[13px]">Não há logins disponíveis no momento.</p>
          <button onClick={() => router.push("/dashboard")} className="bg-[#1f2229] hover:bg-[#262933] border border-transparent hover:border-[#4b5563] text-white px-6 py-2.5 rounded-lg font-bold transition-all text-sm">
            Voltar ao Dashboard
          </button>
        </div>
      ) : (
        <div className="bg-[#181a20] border border-[#262933] rounded-lg p-6">
          <div className="flex items-start gap-3 mb-6">
            <Star className="text-[#eab308] shrink-0 mt-0.5" size={20} fill="currentColor" />
            <div>
              <h3 className="font-bold text-white text-[15px] mb-1">Logins NFA de Alta Qualidade</h3>
              <p className="text-[13px] text-[#9ca3af] leading-relaxed pr-4">
                Temos a maior variedade de logins NFA do mercado! Todos os logins disponíveis são antigos e possuem histórico de uso, o que aumenta significativamente as chances de aprovação. São logins de alta qualidade, prontos para impulsionar seus resultados com muito mais confiança e segurança!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <CheckCircle2 size={16} className="text-green-500" />
              <span className="text-[13px] font-bold text-green-500">Logins Antigos</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Shield size={16} className="text-blue-500" />
              <span className="text-[13px] font-bold text-blue-500">Alta Qualidade</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <Zap size={16} className="text-purple-500" />
              <span className="text-[13px] font-bold text-purple-500">Melhor Aprovação</span>
            </div>
          </div>

          <hr className="border-[#262933] mb-6" />

          <div className="mb-6">
            <label className="block text-[13px] font-bold text-white mb-2">Selecione o Login</label>
            <div className="relative">
              <button 
                onClick={() => setIsSelectOpen(!isSelectOpen)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-lg text-sm font-bold transition-all ${isSelectOpen ? 'border border-[#eab308] text-white bg-[#0f1115]' : 'bg-[#0f1115] border border-[#1f2229] hover:border-[#262933] text-white'}`}
              >
                {selectedLogin ? `${selectedLogin.name} - ${formatCurrency(selectedLogin.price)} (${selectedLogin.stock} disponível${selectedLogin.stock !== 1 ? 's' : ''})` : "Escolha um login disponível"}
                <ChevronDown size={16} className="text-[#9ca3af]" />
              </button>
              
              {isSelectOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsSelectOpen(false)}></div>
                  <div className="absolute left-0 top-full mt-2 w-full bg-[#181a20] border border-[#1f2229] rounded-xl shadow-xl overflow-hidden z-50 py-1">
                    {logins.map(login => (
                      <button
                        key={login.id}
                        onClick={() => { setSelectedId(login.id); setQuantity(1); setIsSelectOpen(false); }}
                        className={`w-full text-left px-4 py-3.5 text-[13px] font-bold hover:bg-[#1f2229] transition-colors ${selectedId === login.id ? "text-[#eab308] bg-[#1f2229]" : "text-white"}`}
                      >
                        {login.name} - {formatCurrency(login.price)} <span className="text-[#6b7280] font-normal">({login.stock} disponível{login.stock !== 1 ? 's' : ''})</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {selectedLogin && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-[#0f1115] rounded-lg border border-[#1f2229]">
                  <p className="text-[11px] uppercase tracking-widest text-[#4b5563] mb-1 font-bold">Preço Unitário</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(selectedLogin.price)}</p>
                </div>
                <div className="p-4 bg-[#0f1115] rounded-lg border border-[#1f2229]">
                  <p className="text-[11px] uppercase tracking-widest text-[#4b5563] mb-1 font-bold">Em Estoque</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-white">{selectedLogin.stock}</p>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${selectedLogin.stock > 0 ? 'bg-white/10 text-white' : 'bg-red-500/10 text-red-500'}`}>
                      {selectedLogin.stock === 1 ? 'unidade' : 'unidades'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-[13px] font-bold text-white mb-2">Quantidade</label>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleQuantityChange(String(Math.max(1, quantity - 1)))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-lg border border-[#262933] bg-[#0f1115] text-white flex items-center justify-center disabled:opacity-50 transition-colors hover:bg-[#1f2229]"
                  >
                    <Minus size={14} />
                  </button>
                  <input 
                    type="number" 
                    min="1" 
                    max={selectedLogin.stock} 
                    value={quantity}
                    onChange={e => handleQuantityChange(e.target.value)}
                    className="w-20 h-10 bg-[#0f1115] border border-[#262933] rounded-lg text-center text-white font-bold focus:outline-none focus:border-[#eab308] transition-colors"
                  />
                  <button 
                    onClick={() => handleQuantityChange(String(Math.min(selectedLogin.stock, quantity + 1)))}
                    disabled={quantity >= selectedLogin.stock}
                    className="w-10 h-10 rounded-lg border border-[#262933] bg-[#0f1115] text-white flex items-center justify-center disabled:opacity-50 transition-colors hover:bg-[#1f2229]"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <p className="text-xs text-[#6b7280] mt-2 font-medium">
                  Máximo: {selectedLogin.stock} {selectedLogin.stock === 1 ? 'unidade' : 'unidades'}
                </p>
              </div>

              <div className="p-5 bg-gradient-to-r from-[#eab308]/10 to-transparent rounded-lg border border-[#eab308]/20 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">Total a Pagar</p>
                    <p className="text-[11px] text-[#9ca3af] mt-1 font-medium">
                      {quantity} {quantity === 1 ? 'unidade' : 'unidades'} × {formatCurrency(selectedLogin.price)}
                    </p>
                  </div>
                  <p className="text-3xl font-black text-[#eab308] drop-shadow-md">
                    {formatCurrency(selectedLogin.price * quantity)}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => {
                  if (selectedLogin.stock === 0) return;
                  router.push(`/checkout?loginId=${selectedId}&quantity=${quantity}&type=login`);
                }}
                disabled={selectedLogin.stock === 0}
                className="w-full h-12 rounded-lg bg-[#eab308] hover:bg-[#ca8a04] disabled:opacity-50 disabled:bg-[#262933] disabled:text-[#6b7280] text-[#0f1115] font-black flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(234,179,8,0.15)] hover:shadow-[0_0_25px_rgba(234,179,8,0.25)]"
              >
                {selectedLogin.stock === 0 ? (
                  <><ShoppingCart size={18} /> Esgotado</>
                ) : (
                  <><Zap size={18} /> Comprar Agora</>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-[#6b7280]">
                <Info size={14} />
                <span className="text-[11px] font-medium">Entrega instantânea após confirmação do pagamento</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
