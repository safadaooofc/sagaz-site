"use client";

import { useState, useEffect } from "react";
import { Gift, ShieldCheck, Diamond, MessageSquare, ShieldAlert, Clock, Lock, Copy, Check } from "lucide-react";
import Link from "next/link";
import { claimDrop } from "./actions";

export function DropsClient({ events, hasDiscord }: any) {
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [cardsResult, setCardsResult] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [timers, setTimers] = useState<Record<string, string>>({});

  useEffect(() => {
    const updateTimers = () => {
      const now = new Date().getTime();
      const newTimers: Record<string, string> = {};
      events.forEach((ev: any) => {
        const exp = new Date(ev.expiresAt).getTime();
        const diff = exp - now;
        if (diff <= 0) {
          newTimers[ev.id] = "Expirado";
        } else {
          const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((diff % (1000 * 60)) / 1000);
          newTimers[ev.id] = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
      });
      setTimers(newTimers);
    };
    
    updateTimers();
    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval);
  }, [events]);

  const handleClaim = async (ev: any) => {
    if (ev.hasPassword && selectedEvent?.id !== ev.id) {
      setSelectedEvent(ev);
      setPasswordInput("");
      return;
    }

    setClaimingId(ev.id);
    const res = await claimDrop(ev.id, ev.hasPassword ? passwordInput : undefined);
    setClaimingId(null);
    
    if (res.success) {
      setCardsResult(res.cards || []);
      setSelectedEvent(ev); // to show results
    } else {
      alert(res.error || "Erro ao resgatar.");
    }
  };

  const copyToClipboard = (txt: string, idx: number) => {
    navigator.clipboard.writeText(txt);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="font-sans max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Drops Disponíveis</h1>
        <p className="text-sm text-[#9ca3af]">Resgate cartões grátis dropados pela equipe</p>
      </div>

      {!hasDiscord && (
        <div className="bg-[#1f1e16] border border-[#3f3b1b] rounded-lg p-5 mb-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert size={20} className="text-[#eab308]" />
            <div>
              <p className="text-sm font-bold text-white">Sua conta não está vinculada ao Discord</p>
              <p className="text-xs text-[#9ca3af]">A maioria dos drops exige verificação no nosso servidor.</p>
            </div>
          </div>
          <Link href="/settings" className="bg-[#eab308] hover:bg-[#ca8a04] text-black text-sm font-bold px-4 py-2 rounded-lg transition-colors">
            Vincular Agora
          </Link>
        </div>
      )}

      {events.length === 0 ? (
        <div className="bg-[#181a20] border border-[#262933] rounded-lg p-12 flex flex-col items-center justify-center text-center mb-8 min-h-[300px]">
          <Gift size={48} className="text-[#333845] mb-4" />
          <h3 className="font-bold text-lg text-white mb-2">Nenhum drop ativo no momento</h3>
          <p className="text-sm text-[#9ca3af]">Fique de olho! Novos drops aparecem regularmente no nosso Discord e aqui.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {events.map((ev: any) => {
            const isExpired = new Date(ev.expiresAt).getTime() <= new Date().getTime();
            const hasClaimed = ev.claims?.length > 0;
            
            return (
              <div key={ev.id} className={`bg-[#181a20] border border-[#262933] rounded-xl overflow-hidden flex flex-col transition-all hover:border-[#333845] ${isExpired && !hasClaimed ? 'opacity-50 grayscale' : ''}`}>
                <div className="p-5 border-b border-[#262933] flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2">
                      {ev.targetAudience === "boosters" && <span className="bg-[#c084fc]/20 text-[#c084fc] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1"><Diamond size={10} /> Booster</span>}
                      {ev.targetAudience === "verificados" && <span className="bg-[#3b82f6]/20 text-[#3b82f6] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1"><ShieldCheck size={10} /> Verificado</span>}
                      {ev.targetAudience === "todos" && <span className="bg-[#22c55e]/20 text-[#22c55e] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Livre</span>}
                    </div>
                    {ev.hasPassword && <Lock size={16} className="text-[#9ca3af]" />}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{ev.title}</h3>
                  <p className="text-sm text-[#9ca3af] mb-4 line-clamp-2">{ev.description || "Resgate este drop antes que acabe!"}</p>
                  
                  <div className="flex items-center gap-2 text-[#eab308] text-sm font-bold bg-[#eab308]/10 w-max px-3 py-1.5 rounded-lg">
                    <Clock size={14} />
                    {timers[ev.id] || "00:00:00"}
                  </div>
                </div>
                
                <div className="p-4 bg-[#0f1115]">
                  <button 
                    onClick={() => hasClaimed ? (setCardsResult(ev.cards?.map((c:any) => c.content) || []), setSelectedEvent(ev)) : handleClaim(ev)}
                    disabled={claimingId === ev.id || (isExpired && !hasClaimed)}
                    className={`w-full py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 ${
                      hasClaimed ? 'bg-[#22c55e] hover:bg-[#16a34a] text-white' :
                      isExpired ? 'bg-[#333845] text-[#9ca3af] cursor-not-allowed' :
                      'bg-[#eab308] hover:bg-[#ca8a04] text-black'
                    }`}
                  >
                    {claimingId === ev.id ? "Aguarde..." : hasClaimed ? "Ver Cartões" : "Resgatar Drop"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Como funciona */}
      <div className="bg-[#181a20] border border-[#262933] rounded-lg p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-[#eab308]/20 text-[#eab308] flex items-center justify-center font-bold">?</div>
          <h2 className="text-xl font-bold text-white">Como Funcionam os Drops?</h2>
        </div>
        <p className="text-sm text-[#9ca3af] mb-8">Tudo que você precisa saber sobre os drops de cartões gratuitos.</p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="flex gap-4">
            <Gift size={24} className="text-[#22c55e] shrink-0" />
            <div>
              <h4 className="font-bold text-white mb-1">Drops Gratuitos</h4>
              <p className="text-sm text-[#9ca3af]">A equipe disponibiliza cartões aleatórios periodicamente. Basta resgatar dentro do tempo limite para ver as informações.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <ShieldCheck size={24} className="text-[#3b82f6] shrink-0" />
            <div>
              <h4 className="font-bold text-white mb-1">Verificação Necessária</h4>
              <p className="text-sm text-[#9ca3af]">Muitos drops exigem que você esteja no nosso servidor Discord. Se for o caso, você não poderá resgatar sem ter a conta vinculada.</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#2a1331] to-[#1a0f2e] border border-[#482054] rounded-lg p-6 flex gap-4">
          <Diamond size={28} className="text-[#c084fc] shrink-0" />
          <div>
            <h4 className="font-bold text-white mb-2">Drops Premium (Boosters)</h4>
            <p className="text-sm text-[#c084fc]/90">
              Drops exclusivos para membros Booster no Discord possuem os melhores cartões e com saldos garantidos. 
              Dê boost no nosso servidor para liberar o acesso a estes drops especiais!
            </p>
          </div>
        </div>
      </div>

      {/* Modal - Senha ou Resultado */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#181a20] border border-[#262933] rounded-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-[#262933] flex justify-between items-center">
              <h3 className="font-bold text-white text-lg">
                {cardsResult.length > 0 ? "Cartões Resgatados" : "Senha Necessária"}
              </h3>
              <button onClick={() => { setSelectedEvent(null); setCardsResult([]); setPasswordInput(""); }} className="text-[#9ca3af] hover:text-white">✕</button>
            </div>
            
            <div className="p-5">
              {cardsResult.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-[#9ca3af] mb-4">Aproveite seus cartões! Eles estarão visíveis enquanto o drop estiver ativo.</p>
                  <div className="max-h-64 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {cardsResult.map((txt, idx) => (
                      <div key={idx} className="bg-[#0f1115] border border-[#262933] p-3 rounded-lg flex justify-between items-center group">
                        <span className="font-mono text-sm text-white select-all">{txt}</span>
                        <button onClick={() => copyToClipboard(txt, idx)} className="text-[#9ca3af] hover:text-white bg-[#1f2229] p-1.5 rounded transition-colors">
                          {copiedIndex === idx ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-[#9ca3af]">Este drop está protegido por senha. A senha costuma ser divulgada no chat geral ou em avisos do Discord.</p>
                  <input 
                    type="password" 
                    placeholder="Digite a senha"
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                    className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-4 py-3 text-white focus:border-[#eab308] focus:outline-none text-center tracking-widest font-mono"
                  />
                  <button 
                    onClick={() => handleClaim(selectedEvent)}
                    disabled={!passwordInput || claimingId === selectedEvent.id}
                    className="w-full bg-[#eab308] hover:bg-[#ca8a04] text-black font-bold py-3 rounded-lg transition-colors"
                  >
                    {claimingId === selectedEvent.id ? "Aguarde..." : "Confirmar Senha"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
