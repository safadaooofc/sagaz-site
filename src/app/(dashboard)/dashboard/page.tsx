import { StatsGrid } from "@/components/StatsGrid";
import { Feed } from "@/components/Feed";
import { HistoryTable } from "@/components/HistoryTable";
import { Star } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();
  
  let formattedTxs: any[] = [];
  if (session?.user?.id) {
    const txs = await prisma.transaction.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
      include: { product: { select: { name: true } } }
    });
    
    formattedTxs = txs.map(tx => ({
      id: tx.id,
      productName: tx.product?.name || "Produto Removido",
      quantity: tx.quantity,
      total: tx.total,
      date: tx.date,
      status: tx.status
    }));
  }

  return (
    <div className="max-w-[1200px] mx-auto h-full flex flex-col font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 mt-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#181a20] border border-[#1f2229] rounded-lg p-3 flex items-center">
            <Star size={18} className="text-[#eab308] shrink-0 mr-2" />
            <span className="text-[13px] text-[#9ca3af]">Curtiu o serviço?</span>
            <a href="/reviews" className="text-[#eab308] border border-[#eab308] rounded px-2.5 py-0.5 ml-2 text-[13px] hover:bg-[#eab308]/10 font-bold transition-colors">
              Deixe sua avaliação
            </a>
          </div>
          <StatsGrid />
        </div>
        
        <div className="lg:col-span-1 h-full">
          <Feed />
        </div>
      </div>

      <div className="flex-1 mt-2">
        <HistoryTable transactions={formattedTxs} />
      </div>
    </div>
  );
}
