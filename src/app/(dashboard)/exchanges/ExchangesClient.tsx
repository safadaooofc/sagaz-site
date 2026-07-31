"use client";

import { useState } from "react";
import { RefreshCw, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { createExchangeRequest } from "./actions";

export function ExchangesClient({ history }: { history: any[] }) {
  const [giftCardCode, setGiftCardCode] = useState("");
  const [requestedValue, setRequestedValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(requestedValue);
    if (isNaN(val) || val <= 0) return toast.error("Valor inválido.");
    
    setLoading(true);
    const res = await createExchangeRequest(giftCardCode, val);
    if (res.success) {
      toast.success("Solicitação enviada com sucesso! Aguarde a análise da administração.");
      setGiftCardCode("");
      setRequestedValue("");
      window.location.reload();
    } else {
      toast.error(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="font-sans space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
          <RefreshCw className="text-[#eab308]" /> Trocas (Exchanges)
        </h1>
        <p className="text-[#9ca3af]">Possui um Gift Card? Venda para a plataforma e receba saldo instantâneo após a análise.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-[#13151a] border border-[#262933] rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Nova Solicitação</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#9ca3af] mb-2">Código do Gift Card</label>
              <input 
                type="text" 
                value={giftCardCode}
                onChange={e => setGiftCardCode(e.target.value)}
                required
                placeholder="XXXX-XXXX-XXXX-XXXX"
                className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-4 py-3 text-white outline-none focus:border-[#eab308]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#9ca3af] mb-2">Valor Solicitado (R$)</label>
              <input 
                type="number" 
                step="0.01"
                value={requestedValue}
                onChange={e => setRequestedValue(e.target.value)}
                required
                placeholder="Ex: 50.00"
                className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-4 py-3 text-white outline-none focus:border-[#eab308]"
              />
            </div>
            
            <div className="p-4 bg-[#eab308]/10 border border-[#eab308]/20 rounded-lg text-sm text-[#eab308] mt-4">
              <p className="font-bold mb-1">Termos de Troca:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>O código será testado manualmente por um administrador.</li>
                <li>Qualquer tentativa de fraude resultará em banimento.</li>
                <li>O saldo será creditado imediatamente se aprovado.</li>
              </ul>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#eab308] hover:bg-[#ca8a04] text-black font-black py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(234,179,8,0.3)] mt-6">
              {loading ? <Loader2 className="animate-spin" /> : "SOLICITAR TROCA"} <ArrowRight size={18} />
            </button>
          </form>
        </div>

        {/* History */}
        <div className="bg-[#13151a] border border-[#262933] rounded-xl p-6 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6">Histórico</h2>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {history.length === 0 ? (
              <div className="text-center text-[#6b7280] py-8">
                Nenhuma solicitação enviada.
              </div>
            ) : (
              history.map(item => (
                <div key={item.id} className="bg-[#0f1115] border border-[#262933] p-4 rounded-lg flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">R$ {item.requestedValue.toFixed(2)}</span>
                    <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${
                      item.status === 'APPROVED' ? 'bg-green-500/20 text-green-500' : 
                      item.status === 'REJECTED' ? 'bg-red-500/20 text-red-500' : 
                      'bg-orange-500/20 text-orange-500'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="text-xs text-[#6b7280] font-mono">{item.giftCardCode}</div>
                  {item.adminNotes && (
                    <div className="text-xs text-red-400 mt-2 p-2 bg-red-500/10 rounded">
                      <span className="font-bold">Nota do Admin:</span> {item.adminNotes}
                    </div>
                  )}
                  <div className="text-[10px] text-[#4b5563] mt-1">{new Date(item.createdAt).toLocaleString('pt-BR')}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
