"use client";

import { useState } from "react";
import { Gift, Package, Percent, Zap, Plus, Trash2, ShieldBan, CheckCircle, Ticket } from "lucide-react";
import { toast } from "sonner";
import { createRewardCode, deleteRewardCode, toggleRewardCodeActive } from "./actions";

export function MarketingClient({ rewardCodes, products }: { rewardCodes: any[], products: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Formulário do Modal
  const [code, setCode] = useState("");
  const [type, setType] = useState("BALANCE"); // BALANCE, PRODUCT, RECHARGE_BONUS, DISCOUNT
  const [value, setValue] = useState("");
  const [productId, setProductId] = useState("");
  const [maxUses, setMaxUses] = useState("1");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (type === "PRODUCT" && !productId) {
      toast.error("Selecione um produto!");
      setIsLoading(false);
      return;
    }
    
    if (type !== "PRODUCT" && !value) {
      toast.error("Informe o valor/porcentagem!");
      setIsLoading(false);
      return;
    }

    const res = await createRewardCode({
      code: code.trim().toUpperCase(),
      type,
      value: type !== "PRODUCT" ? parseFloat(value) : undefined,
      productId: type === "PRODUCT" ? productId : undefined,
      maxUses: parseInt(maxUses)
    });

    if (res.success) {
      toast.success("Recompensa suprema criada com sucesso!");
      setIsModalOpen(false);
      setCode("");
      setValue("");
    } else {
      toast.error(res.error);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja apagar este código?")) return;
    const res = await deleteRewardCode(id);
    if (res.success) toast.success("Código apagado!");
    else toast.error(res.error);
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const res = await toggleRewardCodeActive(id, !currentStatus);
    if (res.success) toast.success(`Código ${!currentStatus ? 'ativado' : 'desativado'}!`);
    else toast.error(res.error);
  };

  const getTypeIcon = (t: string) => {
    switch (t) {
      case 'BALANCE': return <Gift className="text-green-400" size={16} />;
      case 'PRODUCT': return <Package className="text-cyan-400" size={16} />;
      case 'RECHARGE_BONUS': return <Zap className="text-yellow-400" size={16} />;
      case 'DISCOUNT': return <Percent className="text-fuchsia-400" size={16} />;
      default: return <Ticket className="text-white" size={16} />;
    }
  };

  const getTypeName = (t: string) => {
    switch (t) {
      case 'BALANCE': return "Saldo";
      case 'PRODUCT': return "Produto Grátis";
      case 'RECHARGE_BONUS': return "Boost Recarga";
      case 'DISCOUNT': return "Cupom de Desconto";
      default: return t;
    }
  };

  return (
    <div className="font-sans">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
            <Gift className="text-fuchsia-400" /> Sistema Supremo de Benefícios
          </h1>
          <p className="text-[#9ca3af]">Crie Drops e Cupons dinâmicos com saldo, produtos ou boosts de recarga.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(217,70,239,0.3)] hover:shadow-[0_0_25px_rgba(217,70,239,0.5)]"
        >
          <Plus size={18} /> Novo Código
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {rewardCodes.map(code => (
          <div key={code.id} className={`bg-[#181a20] border ${code.active ? 'border-fuchsia-500/30 shadow-[0_0_10px_rgba(217,70,239,0.1)]' : 'border-[#262933] opacity-60'} rounded-xl p-5 relative transition-all`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getTypeIcon(code.type)}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9ca3af]">{getTypeName(code.type)}</span>
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-wider">{code.code}</h3>
              </div>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => handleToggleActive(code.id, code.active)}
                  className={`p-1.5 rounded-md ${code.active ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'}`}
                  title={code.active ? "Desativar Código" : "Ativar Código"}
                >
                  {code.active ? <ShieldBan size={14} /> : <CheckCircle size={14} />}
                </button>
                <button 
                  onClick={() => handleDelete(code.id)}
                  className="p-1.5 rounded-md bg-[#0f1115] text-[#6b7280] hover:bg-red-500 hover:text-white"
                  title="Apagar Permanentemente"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="bg-[#0f1115] p-3 rounded-lg border border-[#262933] mb-4">
              <p className="text-xs text-[#9ca3af] mb-1">Recompensa Entregue:</p>
              {code.type === 'BALANCE' && <p className="text-lg font-black text-green-400">R$ {code.value?.toFixed(2)}</p>}
              {code.type === 'DISCOUNT' && <p className="text-lg font-black text-fuchsia-400">{code.value}% OFF</p>}
              {code.type === 'RECHARGE_BONUS' && <p className="text-lg font-black text-yellow-400">+{code.value}% Bônus</p>}
              {code.type === 'PRODUCT' && (
                <p className="text-sm font-bold text-cyan-400 truncate">
                  {products.find(p => p.id === code.productId)?.name || "Produto não encontrado"}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center text-xs text-[#6b7280] font-mono">
              <span>Usos: {code.used} / {code.maxUses}</span>
              <div className="w-1/2 bg-[#0f1115] rounded-full h-1.5">
                <div 
                  className="bg-fuchsia-500 h-1.5 rounded-full" 
                  style={{ width: `${Math.min((code.used / code.maxUses) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
        {rewardCodes.length === 0 && (
          <div className="col-span-full py-12 text-center border border-dashed border-[#262933] rounded-xl text-[#6b7280]">
            Nenhum código ou drop ativo no momento.
          </div>
        )}
      </div>

      {/* Modal Supremo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#181a20] border border-[#262933] rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(217,70,239,0.15)] relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fuchsia-500 to-cyan-500"></div>
            
            <form onSubmit={handleCreate} className="p-6">
              <h2 className="text-2xl font-black text-white mb-6">Novo Drop/Cupom</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <label className="block text-xs font-bold text-[#9ca3af] uppercase">Nome do Código</label>
                    <button 
                      type="button" 
                      onClick={() => {
                        const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
                        setCode(code.includes('-') ? `${code.split('-')[0]}-${randomStr}` : `PREFIX-${randomStr}`);
                      }}
                      className="text-xs text-fuchsia-400 hover:text-fuchsia-300 font-bold"
                    >
                      Gerar Aleatório
                    </button>
                  </div>
                  <input 
                    type="text" 
                    required
                    value={code}
                    onChange={e => setCode(e.target.value.toUpperCase())}
                    placeholder="EX: PREFIXO-12345" 
                    className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-4 py-3 text-white font-mono outline-none focus:border-fuchsia-500 transition-colors uppercase"
                  />
                  <p className="text-[10px] text-[#6b7280] mt-1">Para gerar automático com prefixo, digite o prefixo com traço (ex: BOPE-) e clique em "Gerar Aleatório".</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#9ca3af] uppercase mb-1">Tipo de Recompensa</label>
                  <select 
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-4 py-3 text-white outline-none focus:border-fuchsia-500 transition-colors"
                  >
                    <option value="BALANCE">💳 Saldo na Carteira (Gift)</option>
                    <option value="PRODUCT">📦 Produto Grátis (Drop)</option>
                    <option value="RECHARGE_BONUS">⚡ Bônus de Recarga (Boost)</option>
                    <option value="DISCOUNT">🏷️ Cupom de Desconto (%)</option>
                  </select>
                </div>

                {type === "PRODUCT" ? (
                  <div>
                    <label className="block text-xs font-bold text-[#9ca3af] uppercase mb-1">Selecione o Produto</label>
                    <select 
                      required
                      value={productId}
                      onChange={e => setProductId(e.target.value)}
                      className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-4 py-3 text-white outline-none focus:border-fuchsia-500 transition-colors"
                    >
                      <option value="">-- Selecione --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-[#9ca3af] uppercase mb-1">
                      {type === 'BALANCE' && "Valor em R$ (Saldo)"}
                      {type === 'DISCOUNT' && "Porcentagem de Desconto (%)"}
                      {type === 'RECHARGE_BONUS' && "Porcentagem do Bônus (%)"}
                    </label>
                    <input 
                      type="number" 
                      required
                      step={type === 'BALANCE' ? '0.01' : '1'}
                      value={value}
                      onChange={e => setValue(e.target.value)}
                      placeholder={type === 'BALANCE' ? "10.50" : "30"}
                      className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-4 py-3 text-white outline-none focus:border-fuchsia-500 transition-colors"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#9ca3af] uppercase mb-1">Máximo de Usos (Resgates)</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={maxUses}
                    onChange={e => setMaxUses(e.target.value)}
                    className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-4 py-3 text-white outline-none focus:border-fuchsia-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-lg font-bold text-[#9ca3af] bg-[#0f1115] border border-[#262933] hover:text-white hover:border-[#374151] transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 rounded-lg font-bold text-white bg-fuchsia-600 hover:bg-fuchsia-500 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Criando..." : "Criar Drop Supremo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
