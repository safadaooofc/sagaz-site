import { Bell, ChevronRight, PanelLeft } from "lucide-react";
import Link from "next/link";

export function Topbar() {
  return (
    <header className="h-[72px] bg-[#0f1115] border-b border-[#262933] flex items-center justify-between px-8 shrink-0 font-sans">
      <div className="flex items-center gap-4">
        <button className="text-[#9ca3af] hover:text-white transition-colors">
          <PanelLeft size={20} />
        </button>
        <div className="w-[1px] h-6 bg-[#262933]"></div>
        <div className="flex items-center gap-2 text-[13px] font-medium text-[#9ca3af]">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-white">Dashboard</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative text-[#9ca3af] hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#eab308] rounded-full border-2 border-[#0f1115]"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-[#181a20] border border-[#262933] flex items-center justify-center font-bold text-white text-sm">
          a
        </div>
      </div>
    </header>
  );
}
