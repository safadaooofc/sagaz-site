"use client";
import { useState, useEffect } from "react";
import { Gift, X } from "lucide-react";

export function ReferralModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Mostra apenas uma vez por sessão
    const hasSeen = sessionStorage.getItem("seen_referral_modal");
    if (!hasSeen) {
      setIsOpen(true);
      sessionStorage.setItem("seen_referral_modal", "true");
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-[#181a20] border border-yellow-500/30 rounded-2xl p-8 max-w-md w-full relative animate-in zoom-in-95 duration-300 shadow-[0_0_50px_rgba(234,179,8,0.15)]">
        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-[#9ca3af] hover:text-white transition-colors">
          <X size={20} />
        </button>
        <div className="w-16 h-16 bg-yellow-500/10 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Gift size={32} />
        </div>
        <h2 className="text-2xl font-black text-white text-center mb-3">Você foi convidado! 🎉</h2>
        <p className="text-[#9ca3af] text-center mb-8 leading-relaxed">
          Faça sua primeira recarga no valor mínimo de <strong className="text-yellow-500">R$ 10,00</strong> para desbloquear <strong className="text-white">5% de Desconto Vitalício</strong> em qualquer produto da nossa loja.
        </p>
        <button onClick={() => setIsOpen(false)} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-black py-4 rounded-xl transition-colors text-lg">
          Recarregar Agora
        </button>
      </div>
    </div>
  );
}
