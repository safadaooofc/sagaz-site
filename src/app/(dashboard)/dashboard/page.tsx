import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardDataTable, TransactionData } from "@/components/dashboard/DashboardDataTable";
import { MessageSquare, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

function SectionCards({
  balance = 0,
  totalPurchases = 0,
  totalSpent = 0,
  averageValue = 0,
}: {
  balance?: number;
  totalPurchases?: number;
  totalSpent?: number;
  averageValue?: number;
}) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

  const stats = [
    {
      label: "Saldo",
      value: formatCurrency(balance),
      description: "Disponível para compras",
    },
    {
      label: "Compras",
      value: String(totalPurchases),
      description: "Cartões adquiridos",
    },
    {
      label: "Total gasto",
      value: formatCurrency(totalSpent),
      description: "Desde o cadastro",
    },
    {
      label: "Ticket médio",
      value: formatCurrency(averageValue),
      description: "Por compra",
    },
  ];

  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:grid-rows-2 flex-1 min-h-[300px]">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-[#181a20]/80 backdrop-blur-md border border-[#1f2229] rounded-xl flex flex-col justify-center space-y-2 p-8 h-full"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-[#9ca3af]">
            {stat.label}
          </p>
          <p className="font-display text-4xl font-bold text-white">{stat.value}</p>
          <p className="text-sm text-[#9ca3af]">{stat.description}</p>
        </div>
      ))}
    </div>
  );
}

export default async function DashboardPage() {
  const session = await auth();

  let formattedTxs: TransactionData[] = [];
  let balance = 0;
  let totalPurchases = 0;
  let totalSpent = 0;
  let averageValue = 0;
  let discordId: string | null = null;
  let latestSales: { productName: string; time: Date }[] = [];

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { balance: true, discordId: true },
    });
    balance = user?.balance || 0;
    discordId = user?.discordId || null;

    // Fetch latest global sales (max 5) for social proof
    const globalLatest = await prisma.transaction.findMany({
      where: { status: { in: ["completed", "COMPLETED"] } },
      orderBy: { date: "desc" },
      take: 5,
      include: { product: { select: { name: true } } }
    });
    
    latestSales = globalLatest.map(tx => ({
      productName: tx.product?.name || "Produto",
      time: tx.date,
    }));

    const txs = await prisma.transaction.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
      include: {
        product: { select: { name: true } },
        stockItems: true,
      },
    });

    totalPurchases = txs.reduce((acc, tx) => acc + tx.quantity, 0);
    totalSpent = txs.reduce((acc, tx) => acc + tx.total, 0);
    averageValue = totalPurchases > 0 ? totalSpent / totalPurchases : 0;

    formattedTxs = txs.map((tx) => {
      const parsedCards: any[] = [];
      let parsedLogin: any = undefined;
      let type: "card" | "login" = "card";

      for (const item of tx.stockItems) {
        if (item.content.includes("|")) {
          const parts = item.content.split("|");
          // Heuristic: If it has only 2 parts and an @, it's a login
          if (parts.length === 2 && parts[0].includes("@")) {
            type = "login";
            parsedLogin = { email: parts[0], password: parts[1] };
          } else {
            type = "card";
            parsedCards.push({
              number: parts[0] || "",
              cvv: parts[1] || "",
              expiry: parts[2] || "",
              name: parts[3] || "",
              bank: parts[4] || "",
              brand: parts[5] || "",
              level: parts[6] || "",
              type: parts[7] || "",
              country: parts[8] || "",
              bin: parts[9] || "",
              cpf: parts[10] || "",
            });
          }
        }
      }

      const isLoginProduct = tx.product?.name.toLowerCase().includes("login");
      if (isLoginProduct && !parsedLogin) type = "login";

      return {
        id: tx.id,
        type: type,
        cardName: type === "card" ? tx.product?.name || "Produto Removido" : undefined,
        loginName: type === "login" ? tx.product?.name || "Produto Removido" : undefined,
        quantity: tx.quantity,
        totalPrice: tx.total,
        purchaseDate: tx.date,
        status: tx.status,
        purchasedCards: type === "card" ? parsedCards : undefined,
        loginData: type === "login" ? parsedLogin : undefined,
      };
    });

    if (!discordId) {
      const existingNotif = await prisma.notification.findFirst({
        where: { userId: session.user.id, title: "Vincule seu Discord!" }
      });
      if (!existingNotif) {
        await prisma.notification.create({
          data: {
            userId: session.user.id,
            title: "Vincule seu Discord!",
            message: "Conecte sua conta do Discord na aba Configurações para resgatar compras e usar os Drops.",
            type: "info"
          }
        });
      }
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto h-full flex flex-col font-sans px-4 sm:px-0 pt-4 pb-6">
      
      <div className="bg-[#181a20] border border-[#262933] rounded-xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden group">
        <div className="flex items-center gap-4 relative z-10">
           <div className="bg-[#eab308]/10 border border-[#eab308]/20 p-2.5 rounded-lg text-[#eab308]">
             <Star size={24} className="fill-[#eab308]/40" />
           </div>
           <div>
             <h3 className="text-[#eab308] font-bold text-base drop-shadow-sm">O que você achou da nossa loja?</h3>
             <p className="text-xs text-[#9ca3af] mt-0.5">Sua opinião é muito importante! Compartilhe sua experiência de compra.</p>
           </div>
        </div>
        <Link href="/reviews" className="bg-[#eab308] hover:bg-[#ca8a04] text-black text-sm font-bold px-6 py-2.5 rounded-lg transition-colors shadow-md relative z-10 w-full sm:w-auto text-center shrink-0">
          Deixar Avaliação
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-8 min-h-[300px]">
        <SectionCards
          balance={balance}
          totalPurchases={totalPurchases}
          totalSpent={totalSpent}
          averageValue={averageValue}
        />
        
        <div className="w-full lg:w-[350px] bg-[#181a20]/80 backdrop-blur-md border border-[#1f2229] rounded-xl flex flex-col overflow-hidden">
          <div className="p-5 border-b border-[#1f2229] flex justify-between items-center bg-[#14161b]">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              Últimas Vendas
            </h3>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </div>
          <div className="p-4 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
            {latestSales.length > 0 ? latestSales.map((sale, i) => (
              <div key={i} className="flex items-start gap-3 bg-[#0f1115] p-3.5 rounded-lg border border-[#1f2229]">
                <div className="mt-0.5 bg-green-500/10 p-2 rounded-lg border border-green-500/20">
                  <ShoppingCart size={14} className="text-green-500" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-[#9ca3af]">Um usuário comprou</p>
                  <p className="text-sm font-bold text-white leading-tight mt-0.5">{sale.productName}</p>
                  <p className="text-[10px] text-[#4b5563] mt-1.5 font-medium">
                    {formatDistanceToNow(new Date(sale.time), { addSuffix: true, locale: ptBR })}
                  </p>
                </div>
              </div>
            )) : (
              <div className="text-center text-xs text-[#4b5563] mt-10">Nenhuma venda recente</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-white text-lg">Minhas Compras</h3>
      </div>

      <div className="flex-1 min-h-[400px]">
        <DashboardDataTable transactions={formattedTxs} />
      </div>
    </div>
  );
}
