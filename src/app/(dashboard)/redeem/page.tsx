import { Gift } from "lucide-react";

export default function RedeemPage() {
  return (
    <div className="font-sans max-w-[600px] mx-auto pt-10">
      <div className="bg-[#181a20] border border-[#1f2229] rounded-xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto mb-6">
          <Gift size={32} className="text-[#eab308]" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">Resgatar Gift Card</h1>
        <p className="text-sm text-[#9ca3af] mb-8">
          Insira o código promocional ou gift card recebido para adicionar saldo instantaneamente em sua conta.
        </p>

        <div className="space-y-4">
          <div className="text-left">
            <label className="block text-sm font-medium text-[#9ca3af] mb-2">Código do Gift</label>
            <input 
              type="text" 
              placeholder="Ex: KNIGHT-XXXX-XXXX" 
              className="w-full bg-[#0f1115] border border-[#1f2229] rounded-lg px-4 py-3.5 text-white font-mono text-center tracking-widest placeholder-[#4b5563] focus:border-[#eab308] focus:outline-none transition-colors uppercase" 
            />
          </div>
          <button className="w-full bg-[#eab308] hover:bg-[#ca8a04] text-[#0f1115] font-bold text-[15px] py-4 rounded-lg transition-transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
            Confirmar Resgate
          </button>
        </div>
      </div>
    </div>
  );
}
