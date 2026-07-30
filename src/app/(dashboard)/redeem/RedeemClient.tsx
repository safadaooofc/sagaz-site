"use client";

import { Gift, RefreshCw } from "lucide-react";
import { useState } from "react";

import { toast } from "sonner";

export function RedeemClient() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const handleRedeem = async () => {
    if (!code) return;
    setLoading(true);
    // TODO: Implement actual redeem logic
    setTimeout(() => {
      setLoading(false);
      toast.error("Sistema de resgate em desenvolvimento.");
    }, 1000);
  };

  return (
    <div className="max-w-[1200px] mx-auto w-full p-4 sm:p-6 lg:p-8 font-sans space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Resgatar Gift</h1>
        <p className="text-[#9ca3af] text-sm">
          Utilize códigos promocionais para adicionar saldo à sua conta e acompanhe todo o histórico de resgates.
        </p>
      </div>

      {/* Main Box */}
      <div className="bg-[#181a20]/80 backdrop-blur-md border border-[#1f2229] border-t-2 border-t-[#eab308] rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Gift size={20} className="text-[#eab308]" />
              <h2 className="text-lg font-bold text-white">Resgatar Gift</h2>
            </div>
            <button className="p-2 border border-[#1f2229] bg-[#0f1115] hover:bg-[#262933] rounded-lg transition-colors text-[#9ca3af] hover:text-white">
              <RefreshCw size={16} />
            </button>
          </div>
          
          <p className="text-sm text-[#9ca3af] mb-8">
            Insira o código recebido para adicionar saldo à sua conta. Aproveite benefícios exclusivos para usuários verificados e boosters do Discord.
          </p>

          <div className="mb-8">
            <label className="block text-sm font-medium text-white mb-2">Código do Gift</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Ex: KNIGHT-BOOST-2025"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="flex-1 bg-[#0f1115] border border-[#1f2229] rounded-lg px-4 py-3 text-white placeholder-[#4b5563] focus:border-[#eab308] focus:outline-none transition-colors"
              />
              <button 
                onClick={handleRedeem}
                disabled={loading || !code}
                className="bg-[#eab308] hover:bg-[#ca8a04] text-black font-bold px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading ? "Processando..." : "Resgatar Gift"}
              </button>
            </div>
          </div>

          <div className="bg-[#0f1115] border border-[#1f2229] rounded-lg p-5">
            <h3 className="font-bold text-sm text-white mb-3">Requisitos importantes</h3>
            <ul className="space-y-2 text-sm text-[#9ca3af]">
              <li className="flex gap-2 items-start"><span className="text-[#4b5563]">•</span> Gifts podem exigir que seu Discord esteja vinculado e verificado no servidor.</li>
              <li className="flex gap-2 items-start"><span className="text-[#4b5563]">•</span> Alguns gifts são exclusivos para usuários com cargo de Booster.</li>
              <li className="flex gap-2 items-start"><span className="text-[#4b5563]">•</span> Cada gift pode ser utilizado apenas uma vez por usuário.</li>
              <li className="flex gap-2 items-start"><span className="text-[#4b5563]">•</span> Em caso de dúvidas, abra um ticket na área de suporte.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* History Box */}
      <div className="bg-[#181a20]/80 backdrop-blur-md border border-[#1f2229] rounded-xl p-6 sm:p-8">
        <h2 className="text-xl font-bold text-white mb-1">Histórico de Gifts</h2>
        <p className="text-sm text-[#9ca3af] mb-6">
          Consulte todos os gifts resgatados nesta conta. O histórico é ordenado do mais recente para o mais antigo.
        </p>

        {history.length === 0 ? (
          <div className="border border-dashed border-[#262933] bg-[#0f1115]/50 rounded-xl p-8 flex items-center justify-center">
            <p className="text-sm text-[#4b5563]">Nenhum gift resgatado ainda. Utilize um código válido para começar.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item, i) => (
              <div key={i} className="bg-[#0f1115] border border-[#1f2229] p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-bold text-white text-sm">{item.code}</p>
                  <p className="text-xs text-[#9ca3af]">{new Date(item.date).toLocaleDateString("pt-BR")}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-500">+ R$ {item.amount.toFixed(2)}</p>
                  <p className="text-xs text-[#4b5563]">Resgatado com sucesso</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
