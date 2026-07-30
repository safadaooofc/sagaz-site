"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export function RechargeForm({ balance, isEligibleForReferralBonus }: { balance: number, isEligibleForReferralBonus: boolean }) {
  const [amount, setAmount] = useState<number>(108);

  const bonus = isEligibleForReferralBonus ? amount * 0.10 : 0;
  const newBalance = balance + amount + bonus;

  const handleAmountChange = (val: string) => {
    const num = parseFloat(val.replace(',', '.'));
    if (!isNaN(num)) {
      setAmount(num);
    } else if (val === "") {
      setAmount(0);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-[#181a20] border border-[#262933] rounded-xl p-5 flex justify-between items-start">
          <div>
            <p className="text-sm font-bold text-white mb-1">Saldo Atual</p>
            <h3 className="text-3xl font-bold text-white">R$ {balance.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3>
            <p className="text-[11px] text-[#6b7280] mt-1">Disponível na conta</p>
          </div>
          <span className="text-[#4b5563] font-black text-xl">$</span>
        </div>
        <div className="bg-[#181a20] border border-[#22c55e] rounded-xl p-5 flex justify-between items-start transition-all duration-300">
          <div>
            <p className="text-sm font-bold text-white mb-1">Saldo Após Recarga</p>
            <h3 className="text-3xl font-bold text-[#22c55e]">R$ {newBalance.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3>
            <p className="text-[11px] text-[#22c55e] mt-1">
              +R$ {amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})} {bonus > 0 && `+ R$ ${bonus.toLocaleString('pt-BR', {minimumFractionDigits: 2})} bônus (10%)`}
            </p>
          </div>
          <CheckCircle2 className="text-[#22c55e]" size={20} />
        </div>
      </div>

      <div className="bg-[#181a20] border border-[#262933] rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <span className="text-[#eab308]">$</span> Etapa 1: Escolha o valor
        </h2>
        <p className="text-[#9ca3af] text-sm mb-6">Selecione quanto deseja recarregar</p>

        <div className="bg-[#1f2229] border border-[#3f3b1b] rounded-xl p-6 text-center mb-8 transition-all">
          <h3 className="text-3xl font-bold text-[#eab308] mb-1">R$ {amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3>
          <p className="text-[#6b7280] text-sm mb-2">Valor selecionado</p>
          {bonus > 0 && (
            <div className="flex items-center justify-center gap-1 text-[#22c55e] text-xs font-bold">
              <CheckCircle2 size={12} /> Bônus de 10% ativo!
            </div>
          )}
        </div>

        <div className="mb-6">
          <p className="text-sm font-bold text-white mb-4">Valores Rápidos</p>
          <div className="grid grid-cols-3 gap-3">
            {[10, 25, 50, 100, 200, 500].map((val) => (
              <button 
                key={val} 
                onClick={() => setAmount(val)}
                className={`border py-3 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 ${amount === val ? 'bg-[#eab308] text-black border-[#eab308]' : 'bg-[#0f1115] border-[#262933] text-white hover:border-[#eab308]'}`}
              >
                R$ {val}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-bold text-white">Ou ajuste o valor</p>
          </div>
          <div className="relative pt-2 pb-6">
            <input 
              type="range" 
              min="10" 
              max="500" 
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-1 bg-[#262933] rounded-xl appearance-none cursor-pointer accent-[#eab308]"
            />
            <div className="flex justify-between text-[#6b7280] text-[11px] mt-2 font-bold">
              <span>R$ 10</span>
              <span>R$ 500</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-bold text-white mb-2">Valor personalizado</label>
          <input 
            type="text" 
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="w-full bg-[#0f1115] border border-[#262933] rounded-xl px-4 py-3 text-white placeholder-[#4b5563] focus:outline-none focus:border-[#eab308] transition-colors"
            placeholder="Ex: 50,00"
          />
          <p className="text-[11px] text-[#6b7280] mt-2">Mínimo: R$ 10,00 • Máximo: R$ 500,00</p>
        </div>

        <button className="w-full bg-[#eab308] hover:bg-[#ca8a04] text-[#0f1115] font-bold text-[15px] py-4 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
          Continuar <span className="text-xl leading-none">›</span>
        </button>
      </div>
    </>
  );
}
