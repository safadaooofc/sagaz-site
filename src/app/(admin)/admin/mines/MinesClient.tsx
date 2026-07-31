"use client";

import { Bomb, Play, StopCircle, Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function MinesClient() {
  const [isActive, setIsActive] = useState(false);
  const [multiplier, setMultiplier] = useState("1.5");
  const [maxBet, setMaxBet] = useState("100");

  const toggleEvent = () => {
    setIsActive(!isActive);
    toast.success(isActive ? "Evento do Mines Desativado!" : "Evento do Mines Iniciado!");
  };

  return (
    <div className="font-sans space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
            <Bomb className="text-red-500" /> Evento: Casino Mines
          </h1>
          <p className="text-[#9ca3af]">Controle o minigame de campo minado para os usuários jogarem com saldo.</p>
        </div>
        <button 
          onClick={toggleEvent}
          className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all ${
            isActive 
              ? "bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]" 
              : "bg-green-500 hover:bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]"
          }`}
        >
          {isActive ? <><StopCircle size={18}/> Encerrar Evento</> : <><Play size={18}/> Iniciar Evento</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#13151a] border border-[#262933] rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Settings size={18} className="text-[#eab308]"/> Configuração de Ganhos</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#9ca3af] uppercase mb-1">Multiplicador Base (x)</label>
              <input 
                type="number" 
                value={multiplier}
                onChange={e => setMultiplier(e.target.value)}
                className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-4 py-3 text-white outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#9ca3af] uppercase mb-1">Aposta Máxima (R$)</label>
              <input 
                type="number" 
                value={maxBet}
                onChange={e => setMaxBet(e.target.value)}
                className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-4 py-3 text-white outline-none focus:border-red-500"
              />
            </div>
            <button className="w-full bg-[#262933] hover:bg-[#374151] text-white font-bold py-3 rounded-lg transition-colors">
              Salvar Configurações
            </button>
          </div>
        </div>

        <div className="bg-[#13151a] border border-[#262933] rounded-xl p-6 flex flex-col justify-center items-center text-center">
          <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-4 ${isActive ? 'bg-green-500/10 border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'bg-[#262933] border border-[#374151]'}`}>
            <Bomb size={64} className={isActive ? 'text-green-500' : 'text-[#6b7280]'} />
          </div>
          <h3 className="text-2xl font-black text-white">{isActive ? "Mines Ao Vivo!" : "Mines Offline"}</h3>
          <p className="text-[#9ca3af] mt-2 max-w-sm">
            {isActive 
              ? "A aba do Casino Mines está visível no painel dos usuários. Eles podem apostar o saldo agora." 
              : "O evento está desativado. Ninguém pode acessar o minigame."}
          </p>
        </div>
      </div>
    </div>
  );
}
