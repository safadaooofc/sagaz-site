import { MessageSquare, X } from "lucide-react";

export function DiscordBanner() {
  return (
    <div className="bg-[#1a1b18] border border-[#3f3b1b] rounded-lg p-4 flex items-center justify-between gap-4 mb-6 font-sans">
      <div className="flex items-center gap-3">
        <MessageSquare size={20} className="text-[#eab308]" />
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold text-[#eab308]">Discord não vinculado</span>
          <span className="text-[#9ca3af]">Vincule seu Discord para maior segurança na sua conta e acesso a benefícios exclusivos</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="shrink-0 bg-[#eab308] hover:bg-[#ca8a04] text-[#0f1115] font-bold text-[13px] px-4 py-2 rounded-md transition-colors flex items-center gap-2">
          <MessageSquare size={16} /> Vincular Agora
        </button>
        <button className="text-[#9ca3af] hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
