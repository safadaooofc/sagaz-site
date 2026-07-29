import { DiscordBanner } from "@/components/DiscordBanner";
import { StatsGrid } from "@/components/StatsGrid";
import { Feed } from "@/components/Feed";
import { HistoryTable } from "@/components/HistoryTable";
import { Star } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="max-w-[1200px] mx-auto h-full flex flex-col font-sans">
      <DiscordBanner />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#181a20] border border-[#262933] rounded-lg p-4 flex items-center gap-2">
            <Star size={18} className="text-[#eab308]" />
            <span className="text-sm text-[#9ca3af]">Curtiu o serviço? <a href="#" className="text-[#eab308] hover:underline font-bold">Deixe sua avaliação</a></span>
          </div>
          <StatsGrid />
        </div>
        
        <div className="lg:col-span-1 h-full">
          <Feed />
        </div>
      </div>

      <div className="flex-1 mt-2">
        <HistoryTable />
      </div>
    </div>
  );
}
